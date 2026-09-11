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

    # CORS
    CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://localhost:3001"]

    # Security
    CLINICAL_SECRET_KEY: str = "dev-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    @model_validator(mode="after")
    def reject_local_production_configuration(self) -> Self:
        if self.ENVIRONMENT == "production":
            if "localhost" in self.CLINICAL_DATABASE_URL:
                raise ValueError("Production clinical database cannot use localhost")
            if self.CLINICAL_SECRET_KEY.startswith("dev-"):
                raise ValueError("Production clinical secret is not configured")
        return self

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()
