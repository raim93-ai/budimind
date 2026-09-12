from __future__ import annotations

import secrets

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.db.session import get_db
from python.budimind_auth import (
    CSRF_COOKIE_NAME,
    SESSION_COOKIE_NAME,
    ActorContext,
    AuthIdentity,
    IdentityProviderUnavailable,
    InvalidIdentity,
    SessionContext,
    build_identity_adapter,
    csrf_matches,
    issue_session,
    lookup_actor_for_identity,
    lookup_session,
    revoke_session,
    rotate_session,
)

router = APIRouter()
bearer = HTTPBearer(auto_error=False)
identity_adapter = build_identity_adapter(
    provider=settings.AUTH_PROVIDER,
    environment=settings.ENVIRONMENT,
    url=settings.CLINICAL_SUPABASE_URL,
    api_key=settings.CLINICAL_SUPABASE_PUBLISHABLE_KEY,
)


def _unauthorized() -> HTTPException:
    return HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")


def _actor_payload(context: ActorContext | SessionContext) -> dict[str, str]:
    return {
        "id": context.actor_id,
        "auth_subject": context.auth_subject,
        "role": context.role,
    }


async def _actor_for_identity(db: AsyncSession, identity: AuthIdentity) -> ActorContext:
    actor = await lookup_actor_for_identity(db, identity)
    if not actor:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Authentication denied")
    return actor


async def _identity_from_bearer(credentials: HTTPAuthorizationCredentials | None) -> AuthIdentity:
    if not credentials or credentials.scheme.lower() != "bearer":
        raise _unauthorized()
    try:
        return await identity_adapter.introspect(credentials.credentials)
    except IdentityProviderUnavailable as exc:
        raise HTTPException(status_code=503, detail="Authentication provider unavailable") from exc
    except InvalidIdentity as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid access token"
        ) from exc


async def require_actor(
    request: Request,
    db: AsyncSession = Depends(get_db),  # noqa: B008
) -> dict[str, str]:
    session_token = request.cookies.get(SESSION_COOKIE_NAME)
    if not session_token:
        raise _unauthorized()
    context = await lookup_session(db, session_token)
    if not context:
        raise _unauthorized()
    return _actor_payload(context)


async def require_session(
    request: Request,
    db: AsyncSession = Depends(get_db),  # noqa: B008
) -> SessionContext:
    session_token = request.cookies.get(SESSION_COOKIE_NAME)
    if not session_token:
        raise _unauthorized()
    context = await lookup_session(db, session_token)
    if not context:
        raise _unauthorized()
    return context


def require_csrf(request: Request) -> None:
    if not csrf_matches(request.cookies.get(CSRF_COOKIE_NAME), request.headers.get("X-CSRF-Token")):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="CSRF validation failed")


def _set_auth_cookies(response: Response, session_token: str, csrf_token: str) -> None:
    response.headers["Cache-Control"] = "private, no-store"
    response.set_cookie(
        SESSION_COOKIE_NAME,
        session_token,
        max_age=settings.AUTH_SESSION_TTL_SECONDS,
        httponly=True,
        secure=settings.AUTH_COOKIE_SECURE,
        samesite="lax",
        path="/",
    )
    response.set_cookie(
        CSRF_COOKIE_NAME,
        csrf_token,
        max_age=settings.AUTH_SESSION_TTL_SECONDS,
        httponly=False,
        secure=settings.AUTH_COOKIE_SECURE,
        samesite="lax",
        path="/",
    )


def _clear_auth_cookies(response: Response) -> None:
    response.delete_cookie(
        SESSION_COOKIE_NAME, path="/", secure=settings.AUTH_COOKIE_SECURE, samesite="lax"
    )
    response.delete_cookie(
        CSRF_COOKIE_NAME, path="/", secure=settings.AUTH_COOKIE_SECURE, samesite="lax"
    )


@router.post("/session", status_code=status.HTTP_201_CREATED)
async def create_session(
    response: Response,
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer),  # noqa: B008
    db: AsyncSession = Depends(get_db),  # noqa: B008
) -> dict[str, object]:
    identity = await _identity_from_bearer(credentials)
    actor = await _actor_for_identity(db, identity)
    session_token, csrf_token = await issue_session(
        db, actor_id=actor.actor_id, ttl_seconds=settings.AUTH_SESSION_TTL_SECONDS
    )
    _set_auth_cookies(response, session_token, csrf_token)
    return {"authenticated": True, "actor": _actor_payload(actor)}


@router.get("/csrf")
async def csrf_token(response: Response) -> dict[str, str]:
    response.headers["Cache-Control"] = "private, no-store"
    token = secrets.token_urlsafe(32)
    response.set_cookie(
        CSRF_COOKIE_NAME,
        token,
        max_age=settings.AUTH_SESSION_TTL_SECONDS,
        httponly=False,
        secure=settings.AUTH_COOKIE_SECURE,
        samesite="lax",
        path="/",
    )
    return {"csrf_token": token}


@router.get("/session")
async def current_session(
    response: Response,
    actor: dict[str, str] = Depends(require_actor),  # noqa: B008
) -> dict[str, object]:
    response.headers["Cache-Control"] = "private, no-store"
    return {"authenticated": True, "actor": actor}


@router.post("/session/rotate")
async def rotate_current_session(
    request: Request,
    response: Response,
    context: SessionContext = Depends(require_session),  # noqa: B008
    db: AsyncSession = Depends(get_db),  # noqa: B008
) -> dict[str, object]:
    response.headers["Cache-Control"] = "private, no-store"
    require_csrf(request)
    rotated = await rotate_session(
        db,
        current_token=request.cookies[SESSION_COOKIE_NAME],
        actor_id=context.actor_id,
        ttl_seconds=settings.AUTH_SESSION_TTL_SECONDS,
    )
    if not rotated:
        raise _unauthorized()
    _set_auth_cookies(response, *rotated)
    return {"authenticated": True, "actor": _actor_payload(context)}


async def _logout(request: Request, response: Response, db: AsyncSession) -> dict[str, bool]:
    response.headers["Cache-Control"] = "private, no-store"
    require_csrf(request)
    token = request.cookies.get(SESSION_COOKIE_NAME)
    if token:
        await revoke_session(db, token)
    _clear_auth_cookies(response)
    return {"authenticated": False}


@router.post("/logout")
async def logout(
    request: Request,
    response: Response,
    db: AsyncSession = Depends(get_db),  # noqa: B008
) -> dict[str, bool]:
    return await _logout(request, response, db)


@router.delete("/session")
async def delete_session(
    request: Request,
    response: Response,
    db: AsyncSession = Depends(get_db),  # noqa: B008
) -> dict[str, bool]:
    return await _logout(request, response, db)
