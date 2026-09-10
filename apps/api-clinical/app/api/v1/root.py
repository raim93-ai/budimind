from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def api_root() -> dict[str, str]:
    return {
        "message": "BudiMind Clinical API v1",
        "docs": "/docs",
        "health": "/health",
    }
