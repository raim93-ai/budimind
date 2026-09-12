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

    # CORS
    CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://localhost:3001"]

    @model_validator(mode="after")
    def reject_local_production_configuration(self) -> Self:
        if self.ENVIRONMENT == "production":
            if "localhost" in self.CORPORATE_DATABASE_URL:
                raise ValueError("Production corporate database cannot use localhost")
        return self

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()
