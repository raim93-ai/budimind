from __future__ import annotations

import asyncio
import os
import sys
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from pathlib import Path
from uuid import uuid4

import httpx
import pytest
from sqlalchemy import text
from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.pool import NullPool

from python.budimind_auth import (
    AuthIdentity,
    csrf_matches,
    issue_session,
    lookup_actor_for_identity,
    lookup_session,
    revoke_session,
    rotate_session,
    token_hash,
)

ROOT = Path(__file__).resolve().parents[1]
CORPORATE_URL = os.getenv(
    "CORPORATE_DATABASE_URL",
    "postgresql+asyncpg://corporate_app:corporate_dev@localhost:5432/budimind_corporate",
)
CLINICAL_URL = os.getenv(
    "CLINICAL_DATABASE_URL",
    "postgresql+asyncpg://clinical_app:clinical_dev@localhost:5433/budimind_clinical",
)


def _engine(url: str) -> AsyncEngine:
    return create_async_engine(url, poolclass=NullPool)


@asynccontextmanager
async def _synthetic_actor(engine: AsyncEngine, *, role: str) -> AsyncIterator[tuple[str, str]]:
    subject = f"synthetic-{uuid4()}"
    async with engine.begin() as connection:
        actor_id = (
            await connection.execute(
                text(
                    "insert into private.app_actor (auth_subject, role) "
                    "values (:subject, :role) returning id::text"
                ),
                {"subject": subject, "role": role},
            )
        ).scalar_one()
    try:
        yield actor_id, subject
    finally:
        async with engine.begin() as connection:
            await connection.execute(
                text("delete from private.server_session where actor_id = cast(:id as uuid)"),
                {"id": actor_id},
            )
            await connection.execute(
                text("delete from private.app_actor where id = cast(:id as uuid)"),
                {"id": actor_id},
            )


@pytest.mark.asyncio
async def test_verified_identity_and_cross_plane_actor_denial() -> None:
    corporate = _engine(CORPORATE_URL)
    clinical = _engine(CLINICAL_URL)
    corporate_sessions = async_sessionmaker(corporate, expire_on_commit=False)
    clinical_sessions = async_sessionmaker(clinical, expire_on_commit=False)
    try:
        async with _synthetic_actor(corporate, role="corporate_admin") as (actor_id, subject):
            async with corporate_sessions() as session:
                actor = await lookup_actor_for_identity(session, AuthIdentity(subject, True))
                assert actor is not None
                assert actor.actor_id == actor_id
                assert (
                    await lookup_actor_for_identity(session, AuthIdentity(subject, False)) is None
                )
            async with clinical_sessions() as session:
                assert await lookup_actor_for_identity(session, AuthIdentity(subject, True)) is None
    finally:
        await corporate.dispose()
        await clinical.dispose()


@pytest.mark.asyncio
@pytest.mark.parametrize(
    ("url", "role"),
    [(CORPORATE_URL, "corporate_admin"), (CLINICAL_URL, "clinic_admin")],
)
async def test_session_lifecycle_rotation_expiry_logout_and_replay_denial(
    url: str, role: str
) -> None:
    engine = _engine(url)
    sessions = async_sessionmaker(engine, expire_on_commit=False)
    try:
        async with _synthetic_actor(engine, role=role) as (actor_id, _subject):
            async with sessions() as session:
                original, csrf = await issue_session(session, actor_id=actor_id, ttl_seconds=300)
                assert csrf_matches(csrf, csrf)
                assert (await lookup_session(session, original)) is not None

            async with sessions() as session:
                stored = await session.execute(
                    text(
                        "select token_hash from private.server_session "
                        "where actor_id = cast(:id as uuid)"
                    ),
                    {"id": actor_id},
                )
                assert stored.scalar_one() == token_hash(original)

            async def rotate_once() -> tuple[str, str] | None:
                async with sessions() as session:
                    return await rotate_session(
                        session, current_token=original, actor_id=actor_id, ttl_seconds=300
                    )

            rotations = await asyncio.gather(rotate_once(), rotate_once())
            successful = [rotation for rotation in rotations if rotation is not None]
            assert len(successful) == 1
            rotated, _rotated_csrf = successful[0]

            async with sessions() as session:
                assert await lookup_session(session, original) is None
                assert (
                    await rotate_session(
                        session, current_token=original, actor_id=actor_id, ttl_seconds=300
                    )
                    is None
                )
                assert (await lookup_session(session, rotated)) is not None
                assert await revoke_session(session, rotated)
                assert await lookup_session(session, rotated) is None

                expiring, _ = await issue_session(session, actor_id=actor_id, ttl_seconds=300)
                await session.execute(
                    text(
                        "update private.server_session "
                        "set created_at = now() - interval '2 seconds', "
                        "expires_at = now() - interval '1 second' "
                        "where token_hash = :token_hash"
                    ),
                    {"token_hash": token_hash(expiring)},
                )
                await session.commit()
                assert await lookup_session(session, expiring) is None
    finally:
        await engine.dispose()


@pytest.mark.asyncio
async def test_session_token_cannot_cross_data_planes() -> None:
    corporate = _engine(CORPORATE_URL)
    clinical = _engine(CLINICAL_URL)
    corporate_sessions = async_sessionmaker(corporate, expire_on_commit=False)
    clinical_sessions = async_sessionmaker(clinical, expire_on_commit=False)
    try:
        async with _synthetic_actor(corporate, role="corporate_admin") as (actor_id, _subject):
            async with corporate_sessions() as session:
                token, _ = await issue_session(session, actor_id=actor_id, ttl_seconds=300)
            async with clinical_sessions() as session:
                assert await lookup_session(session, token) is None
    finally:
        await corporate.dispose()
        await clinical.dispose()


@pytest.mark.asyncio
async def test_corporate_auth_routes_require_cookie_csrf_and_clear_logout() -> None:
    sys.path.insert(0, str(ROOT / "apps" / "api-corporate"))
    try:
        from app.main import app

        engine = _engine(CORPORATE_URL)
        async with _synthetic_actor(engine, role="corporate_admin") as (_actor_id, subject):
            transport = httpx.ASGITransport(app=app)
            async with httpx.AsyncClient(
                transport=transport, base_url="https://corporate.test"
            ) as client:
                unverified = await client.post(
                    "/api/v1/auth/session",
                    headers={"Authorization": f"Bearer fake-unverified:{subject}"},
                )
                assert unverified.status_code == 403

                created = await client.post(
                    "/api/v1/auth/session",
                    headers={"Authorization": f"Bearer fake-verified:{subject}"},
                )
                assert created.status_code == 201
                set_cookies = created.headers.get_list("set-cookie")
                assert any("bm_session=" in value and "HttpOnly" in value for value in set_cookies)
                assert all("Secure" in value and "SameSite=lax" in value for value in set_cookies)
                assert created.headers["cache-control"] == "private, no-store"

                bearer_only = httpx.AsyncClient(
                    transport=transport, base_url="https://corporate.test"
                )
                try:
                    denied = await bearer_only.get(
                        "/api/v1/auth/session",
                        headers={"Authorization": f"Bearer fake-verified:{subject}"},
                    )
                    assert denied.status_code == 401
                finally:
                    await bearer_only.aclose()

                current = await client.get("/api/v1/auth/session")
                assert current.status_code == 200
                assert current.headers["cache-control"] == "private, no-store"
                assert (await client.post("/api/v1/auth/session/rotate")).status_code == 403

                csrf = client.cookies["bm_csrf"]
                rotated = await client.post(
                    "/api/v1/auth/session/rotate", headers={"X-CSRF-Token": csrf}
                )
                assert rotated.status_code == 200

                logout_csrf = client.cookies["bm_csrf"]
                logged_out = await client.post(
                    "/api/v1/auth/logout", headers={"X-CSRF-Token": logout_csrf}
                )
                assert logged_out.status_code == 200
                assert logged_out.json() == {"authenticated": False}
                assert (await client.get("/api/v1/auth/session")).status_code == 401
        await engine.dispose()
    finally:
        sys.path.remove(str(ROOT / "apps" / "api-corporate"))
