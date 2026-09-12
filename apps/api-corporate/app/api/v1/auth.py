import httpx
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.db.session import get_db

router = APIRouter()
bearer = HTTPBearer(auto_error=False)


async def require_actor(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer),  # noqa: B008
    db: AsyncSession = Depends(get_db),  # noqa: B008
) -> dict[str, str]:
    if not credentials or credentials.scheme.lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required"
        )
    if not settings.CORPORATE_SUPABASE_URL or not settings.CORPORATE_SUPABASE_SECRET_KEY:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Authentication provider is not configured",
        )
    try:
        async with httpx.AsyncClient(timeout=5) as client:
            response = await client.get(
                f"{settings.CORPORATE_SUPABASE_URL.rstrip('/')}/auth/v1/user",
                headers={
                    "Authorization": f"Bearer {credentials.credentials}",
                    "apikey": settings.CORPORATE_SUPABASE_SECRET_KEY,
                },
            )
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=503, detail="Authentication provider unavailable") from exc
    if response.status_code != 200:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid access token")
    subject = response.json().get("id")
    if not isinstance(subject, str) or not subject:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid access token subject"
        )
    result = await db.execute(
        text(
            "select id::text, auth_subject, role, status "
            "from private.app_actor where auth_subject = :subject"
        ),
        {"subject": subject},
    )
    actor = result.mappings().first()
    if not actor or actor["status"] != "active":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Actor is not provisioned"
        )
    return {"id": actor["id"], "auth_subject": actor["auth_subject"], "role": actor["role"]}


@router.get("/session")
async def current_session(actor: dict[str, str] = Depends(require_actor)) -> dict[str, object]:  # noqa: B008
    return {"authenticated": True, "actor": actor}
