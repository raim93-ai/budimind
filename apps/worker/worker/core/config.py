"""Worker configuration settings."""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "BudiMind Worker"
    VERSION: str = "0.1.0"
    ENVIRONMENT: str = "development"

    # Corporate Database
    CORPORATE_DATABASE_URL: str = (
        "mysql+asyncmy://corporate_worker:corporate_worker_dev@localhost:3306/budimind_corporate"
    )

    # Clinical Database
    CLINICAL_DATABASE_URL: str = (
        "mysql+asyncmy://clinical_worker:clinical_worker_dev@localhost:3307/budimind_clinical"
    )

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    # AWS / LocalStack
    AWS_REGION: str = "ap-southeast-1"
    AWS_ACCESS_KEY_ID: str = "test"
    AWS_SECRET_ACCESS_KEY: str = "test"
    AWS_ENDPOINT_URL: str = "http://localhost:4566"

    # SQS Queues
    CORPORATE_QUEUE_URL: str = "http://localhost:4566/000000000000/corporate-jobs"
    CLINICAL_QUEUE_URL: str = "http://localhost:4566/000000000000/clinical-jobs"

    # S3 Buckets
    CORPORATE_REPORTS_BUCKET: str = "budimind-corporate-reports"
    CLINICAL_DOCUMENTS_BUCKET: str = "budimind-clinical-documents"

    model_config = SettingsConfigDict(
        env_file="../../.env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()
