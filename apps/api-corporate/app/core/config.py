from typing import Self

from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "BudiMind Corporate API"
    VERSION: str = "0.1.0"
    ENVIRONMENT: str = "development"

    # Database
    CORPORATE_DATABASE_URL: str = (
        "postgresql+asyncpg://corporate_app:corporate_dev@localhost:5432/budimind_corporate"
    )
    CORPORATE_SUPABASE_URL: str = ""
    CORPORATE_SUPABASE_PUBLISHABLE_KEY: str = ""
    CORPORATE_SUPABASE_SECRET_KEY: str = ""
    AUTH_PROVIDER: str = "fake"
    AUTH_SESSION_TTL_SECONDS: int = 1800
    AUTH_COOKIE_SECURE: bool = True

    # CORS
    CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://localhost:3001"]

    @model_validator(mode="after")
    def reject_local_production_configuration(self) -> Self:
        if self.AUTH_PROVIDER not in {"supabase", "fake"}:
            raise ValueError("AUTH_PROVIDER must be supabase or fake")
        if not 60 <= self.AUTH_SESSION_TTL_SECONDS <= 86_400:
            raise ValueError("AUTH_SESSION_TTL_SECONDS must be between 60 and 86400")
        if self.ENVIRONMENT == "production" and self.AUTH_PROVIDER == "fake":
            raise ValueError("Deterministic fake identity cannot be enabled in production")
        if self.ENVIRONMENT == "production" and not self.AUTH_COOKIE_SECURE:
            raise ValueError("Production auth cookies must use Secure")
        if self.ENVIRONMENT == "production":
            if any(host in self.CORPORATE_DATABASE_URL for host in ("localhost", "127.0.0.1")):
                raise ValueError("Production corporate database cannot use localhost")
            if not self.CORPORATE_DATABASE_URL.startswith("postgresql+asyncpg://"):
                raise ValueError("Production corporate database must use async PostgreSQL")
            if self.AUTH_PROVIDER == "supabase" and not self.CORPORATE_SUPABASE_URL.startswith(
                "https://"
            ):
                raise ValueError("Production Supabase URL must use HTTPS")
            if self.AUTH_PROVIDER == "supabase" and (
                not self.CORPORATE_SUPABASE_PUBLISHABLE_KEY
                or not self.CORPORATE_SUPABASE_SECRET_KEY
            ):
                raise ValueError("Production Supabase keys must be configured as server secrets")
            if any(origin.startswith("http://localhost") for origin in self.CORS_ORIGINS):
                raise ValueError("Production CORS cannot include localhost")
        return self

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()
