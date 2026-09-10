import logging
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1 import health, root
from app.core.config import settings
from app.core.logging import setup_logging


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    # Startup
    setup_logging()
    logging.info("Starting Clinical API")
    yield
    # Shutdown
    logging.info("Shutting down Clinical API")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description="BudiMind Clinical Psychology Services API",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, prefix="/health", tags=["health"])
app.include_router(root.router, prefix="/api/v1", tags=["root"])


@app.get("/")
async def service_root() -> dict[str, str]:
    return {
        "name": settings.APP_NAME,
        "version": settings.VERSION,
        "status": "running",
    }
