from typing import Self

from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "BudiMind Clinical API"
    VERSION: str = "0.1.0"
    ENVIRONMENT: str = "development"

    # Database
    CLINICAL_DATABASE_URL: str = (
        "postgresql+asyncpg://clinical_app:clinical_dev@localhost:5433/budimind_clinical"
    )
    CLINICAL_SUPABASE_URL: str = ""
    CLINICAL_SUPABASE_PUBLISHABLE_KEY: str = ""
    CLINICAL_SUPABASE_SECRET_KEY: str = ""

    # CORS
    CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://localhost:3001"]

    @model_validator(mode="after")
    def reject_local_production_configuration(self) -> Self:
        if self.ENVIRONMENT == "production":
            if any(host in self.CLINICAL_DATABASE_URL for host in ("localhost", "127.0.0.1")):
                raise ValueError("Production clinical database cannot use localhost")
            if not self.CLINICAL_DATABASE_URL.startswith("postgresql+asyncpg://"):
                raise ValueError("Production clinical database must use async PostgreSQL")
            if not self.CLINICAL_SUPABASE_URL.startswith("https://"):
                raise ValueError("Production Supabase URL must use HTTPS")
            if (
                not self.CLINICAL_SUPABASE_PUBLISHABLE_KEY
                or not self.CLINICAL_SUPABASE_SECRET_KEY
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
