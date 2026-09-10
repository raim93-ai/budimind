import time
from typing import Any

from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.db.session import get_db

router = APIRouter()


@router.get("/live")
async def liveness_check() -> dict[str, str]:
    """Kubernetes liveness probe - just checks if the app is running."""
    return {"status": "alive"}


@router.get("/ready")
async def readiness_check(db: AsyncSession = Depends(get_db)) -> dict[str, Any]:  # noqa: B008
    """Kubernetes readiness probe - checks if the app can serve requests."""
    checks = {}
    overall = "ready"

    # Check database connectivity
    db_start = time.time()
    try:
        await db.execute(text("SELECT 1"))
        checks["database"] = {
            "status": "healthy",
            "latency_ms": round((time.time() - db_start) * 1000, 2),
        }
    except Exception as e:
        checks["database"] = {"status": "unhealthy", "error": str(e)}
        overall = "not_ready"

    # Check configuration
    checks["configuration"] = {
        "status": "healthy",
        "environment": settings.ENVIRONMENT,
        "version": settings.VERSION,
    }

    return {
        "status": overall,
        "checks": checks,
    }
