"""Worker configuration settings."""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "BudiMind Worker"
    VERSION: str = "0.1.0"
    ENVIRONMENT: str = "development"

    # Corporate Database
    CORPORATE_DATABASE_URL: str = (
        "postgresql+asyncpg://corporate_worker:corporate_worker_dev@localhost:5432/budimind_corporate"
    )

    # Clinical Database
    CLINICAL_DATABASE_URL: str = (
        "postgresql+asyncpg://clinical_worker:clinical_worker_dev@localhost:5433/budimind_clinical"
    )

    model_config = SettingsConfigDict(
        env_file="../../.env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()
