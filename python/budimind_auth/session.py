"""Provider authentication and opaque, database-backed browser sessions.

The provider access token is accepted only at the session exchange boundary. All
subsequent browser requests use a random opaque cookie whose hash is stored in
the plane's private schema. This keeps provider tokens out of application
routes, logs, and URLs while retaining Supabase Auth as the identity source.
"""

from __future__ import annotations

import hashlib
import hmac
import re
import secrets
from dataclasses import dataclass
from typing import Protocol

import httpx
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

SESSION_COOKIE_NAME = "bm_session"
CSRF_COOKIE_NAME = "bm_csrf"
_ACCESS_TOKEN_RE = re.compile(r"^[A-Za-z0-9._~:-]{1,4096}$")
_SESSION_TOKEN_RE = re.compile(r"^[A-Za-z0-9_-]{32,128}$")
_SUBJECT_RE = re.compile(r"^[A-Za-z0-9._:-]{1,128}$")


@dataclass(frozen=True, slots=True)
class AuthIdentity:
    """Minimal provider identity. Email and metadata are intentionally omitted."""

    subject: str
    email_verified: bool


@dataclass(frozen=True, slots=True)
class ActorContext:
    actor_id: str
    auth_subject: str
    role: str


@dataclass(frozen=True, slots=True)
class SessionContext:
    session_id: str
    actor_id: str
    auth_subject: str
    role: str


class IdentityAdapter(Protocol):
    async def introspect(self, access_token: str) -> AuthIdentity: ...


class SupabaseIdentityAdapter:
    """Introspect a Supabase Auth access token using the publishable API key."""

    def __init__(self, url: str, api_key: str, timeout: float = 5.0) -> None:
        self._url = url.rstrip("/")
        self._api_key = api_key
        self._timeout = timeout

    async def introspect(self, access_token: str) -> AuthIdentity:
        _validate_access_token(access_token)
        if not self._url or not self._api_key:
            raise IdentityProviderUnavailable
        try:
            async with httpx.AsyncClient(timeout=self._timeout) as client:
                response = await client.get(
                    f"{self._url}/auth/v1/user",
                    headers={
                        "Authorization": f"Bearer {access_token}",
                        "apikey": self._api_key,
                    },
                )
        except httpx.HTTPError as exc:
            raise IdentityProviderUnavailable from exc
        if response.status_code != 200:
            raise InvalidIdentity
        try:
            payload = response.json()
        except ValueError as exc:
            raise InvalidIdentity from exc
        if not isinstance(payload, dict):
            raise InvalidIdentity
        subject = payload.get("id")
        if not isinstance(subject, str) or not _SUBJECT_RE.fullmatch(subject):
            raise InvalidIdentity
        # Only the provider's verified timestamp is trusted. User metadata is
        # user-editable and must never influence authorization decisions.
        email_confirmed_at = payload.get("email_confirmed_at")
        return AuthIdentity(
            subject=subject,
            email_verified=isinstance(email_confirmed_at, str) and bool(email_confirmed_at),
        )


class DeterministicFakeIdentityAdapter:
    """Synthetic identity provider for development/test only.

    Tokens are deliberately fixed and non-secret. The adapter is never
    constructed for production settings. Tests can use the two explicit token
    forms to exercise verified-email and denial paths deterministically.
    """

    async def introspect(self, access_token: str) -> AuthIdentity:
        _validate_access_token(access_token)
        if access_token == "fake-verified-token":
            return AuthIdentity("fake-verified-user", True)
        if access_token == "fake-unverified-token":
            return AuthIdentity("fake-unverified-user", False)
        if access_token.startswith("fake-verified:"):
            subject = access_token.removeprefix("fake-verified:")
            if _SUBJECT_RE.fullmatch(subject):
                return AuthIdentity(subject, True)
        if access_token.startswith("fake-unverified:"):
            subject = access_token.removeprefix("fake-unverified:")
            if _SUBJECT_RE.fullmatch(subject):
                return AuthIdentity(subject, False)
        raise InvalidIdentity


class InvalidIdentity(Exception):
    """The provider rejected the access token or returned an invalid subject."""


class IdentityProviderUnavailable(Exception):
    """The configured identity provider could not be reached."""


def build_identity_adapter(
    *, provider: str, environment: str, url: str, api_key: str
) -> IdentityAdapter:
    if provider == "fake":
        if environment not in {"development", "test"}:
            raise ValueError("Deterministic fake identity is only available in development or test")
        return DeterministicFakeIdentityAdapter()
    if provider != "supabase":
        raise ValueError("AUTH_PROVIDER must be supabase or fake")
    return SupabaseIdentityAdapter(url, api_key)


def token_hash(token: str) -> bytes:
    _validate_session_token(token)
    return hashlib.sha256(token.encode("ascii")).digest()


def _validate_access_token(token: str) -> None:
    if not isinstance(token, str) or not _ACCESS_TOKEN_RE.fullmatch(token):
        raise InvalidIdentity


def _validate_session_token(token: str) -> None:
    if not isinstance(token, str) or not _SESSION_TOKEN_RE.fullmatch(token):
        raise InvalidIdentity


async def lookup_actor_for_identity(
    db: AsyncSession, identity: AuthIdentity
) -> ActorContext | None:
    """Resolve a verified provider identity to an active actor in this database only."""

    if not identity.email_verified:
        return None
    result = await db.execute(
        text(
            "select id::text as actor_id, auth_subject, role "
            "from private.app_actor where auth_subject = :subject and status = 'active'"
        ),
        {"subject": identity.subject},
    )
    row = result.mappings().first()
    if not row:
        return None
    return ActorContext(
        actor_id=row["actor_id"], auth_subject=row["auth_subject"], role=row["role"]
    )


async def issue_session(
    db: AsyncSession,
    *,
    actor_id: str,
    ttl_seconds: int,
) -> tuple[str, str]:
    """Create a session and CSRF secret, returning values for cookies."""

    if not 60 <= ttl_seconds <= 86_400:
        raise ValueError("Session TTL must be between 60 seconds and 24 hours")
    session_token = secrets.token_urlsafe(32)
    csrf_token = secrets.token_urlsafe(32)
    await db.execute(
        text(
            "insert into private.server_session "
            "(actor_id, token_hash, expires_at) "
            "values (:actor_id, :token_hash, now() + (:ttl * interval '1 second'))"
        ),
        {"actor_id": actor_id, "token_hash": token_hash(session_token), "ttl": ttl_seconds},
    )
    await db.commit()
    return session_token, csrf_token


async def lookup_session(db: AsyncSession, session_token: str) -> SessionContext | None:
    try:
        digest = token_hash(session_token)
    except InvalidIdentity:
        return None
    result = await db.execute(
        text(
            "select s.id::text as session_id, a.id::text as actor_id, "
            "a.auth_subject, a.role "
            "from private.server_session s "
            "join private.app_actor a on a.id = s.actor_id "
            "where s.token_hash = :token_hash and s.revoked_at is null "
            "and s.expires_at > now() and a.status = 'active'"
        ),
        {"token_hash": digest},
    )
    row = result.mappings().first()
    if not row:
        return None
    await db.execute(
        text("update private.server_session set last_seen_at = now() where id = :id"),
        {"id": row["session_id"]},
    )
    await db.commit()
    return SessionContext(
        session_id=row["session_id"],
        actor_id=row["actor_id"],
        auth_subject=row["auth_subject"],
        role=row["role"],
    )


async def revoke_session(db: AsyncSession, session_token: str) -> bool:
    try:
        digest = token_hash(session_token)
    except InvalidIdentity:
        return False
    result = await db.execute(
        text(
            "update private.server_session set revoked_at = now() "
            "where token_hash = :token_hash and revoked_at is null returning id"
        ),
        {"token_hash": digest},
    )
    revoked = result.scalar_one_or_none() is not None
    await db.commit()
    return revoked


async def rotate_session(
    db: AsyncSession,
    *,
    current_token: str,
    actor_id: str,
    ttl_seconds: int,
) -> tuple[str, str] | None:
    if not 60 <= ttl_seconds <= 86_400:
        raise ValueError("Session TTL must be between 60 seconds and 24 hours")
    try:
        digest = token_hash(current_token)
    except InvalidIdentity:
        return None
    revoked = await db.execute(
        text(
            "update private.server_session as s set revoked_at = now() "
            "from private.app_actor as a "
            "where s.token_hash = :token_hash and s.actor_id = cast(:actor_id as uuid) "
            "and a.id = s.actor_id and a.status = 'active' "
            "and s.revoked_at is null and s.expires_at > now() "
            "returning s.id::text"
        ),
        {"token_hash": digest, "actor_id": actor_id},
    )
    rotated_from = revoked.scalar_one_or_none()
    if rotated_from is None:
        await db.rollback()
        return None
    new_token = secrets.token_urlsafe(32)
    csrf_token = secrets.token_urlsafe(32)
    await db.execute(
        text(
            "insert into private.server_session "
            "(actor_id, token_hash, expires_at, rotated_from) "
            "values (:actor_id, :token_hash, now() + (:ttl * interval '1 second'), :rotated_from)"
        ),
        {
            "actor_id": actor_id,
            "token_hash": token_hash(new_token),
            "ttl": ttl_seconds,
            "rotated_from": rotated_from,
        },
    )
    await db.commit()
    return new_token, csrf_token


def csrf_matches(cookie_value: str | None, header_value: str | None) -> bool:
    if not cookie_value or not header_value:
        return False
    return hmac.compare_digest(cookie_value, header_value)
