"""Apply the baseline schema to both isolated PostgreSQL databases."""

from __future__ import annotations

import asyncio
import os
import subprocess
from datetime import UTC, datetime
from urllib.parse import urlparse

from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine

MIGRATION = "0001_baseline"
CORPORATE_LOCAL_URL = (
    "postgresql+asyncpg://corporate_app:corporate_dev@localhost:5432/budimind_corporate"
)
CLINICAL_LOCAL_URL = (
    "postgresql+asyncpg://clinical_app:clinical_dev@localhost:5433/budimind_clinical"
)
SCHEMA_SQL = """
CREATE TABLE IF NOT EXISTS _schema_migrations (
    version VARCHAR(64) PRIMARY KEY,
    applied_at TIMESTAMP(6) WITH TIME ZONE NOT NULL
)
"""


async def migrate(url: str, service: str, database: str, user: str) -> None:
    engine = create_async_engine(url, pool_pre_ping=True)
    try:
        async with engine.begin() as connection:
            await connection.execute(text(SCHEMA_SQL))
            result = await connection.execute(
                text("SELECT 1 FROM _schema_migrations WHERE version = :version"),
                {"version": MIGRATION},
            )
            if result.scalar_one_or_none() is None:
                await connection.execute(
                    text(
                        "INSERT INTO _schema_migrations (version, applied_at) "
                        "VALUES (:version, :applied_at)"
                    ),
                    {"version": MIGRATION, "applied_at": datetime.now(UTC)},
                )
    except Exception:
        parsed = urlparse(url)
        if parsed.hostname not in {"localhost", "127.0.0.1"} or os.getenv(
            "BUDIMIND_DISABLE_DOCKER_FALLBACK"
        ):
            raise
        subprocess.run(
            [
                "docker",
                "compose",
                "exec",
                "-T",
                service,
                "psql",
                "-U",
                user,
                "-d",
                database,
                "-v",
                "ON_ERROR_STOP=1",
                "-c",
                f"{SCHEMA_SQL}; INSERT INTO _schema_migrations VALUES "
                f"('{MIGRATION}', CURRENT_TIMESTAMP) ON CONFLICT (version) DO NOTHING;",
            ],
            check=True,
            capture_output=True,
            text=True,
        )
    finally:
        await engine.dispose()


async def main() -> None:
    await asyncio.gather(
        migrate(
            os.getenv("CORPORATE_DATABASE_URL", CORPORATE_LOCAL_URL),
            "corporate-db",
            "budimind_corporate",
            "corporate_app",
        ),
        migrate(
            os.getenv("CLINICAL_DATABASE_URL", CLINICAL_LOCAL_URL),
            "clinical-db",
            "budimind_clinical",
            "clinical_app",
        ),
    )


if __name__ == "__main__":
    asyncio.run(main())
