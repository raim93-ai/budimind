"""Reset only the baseline migration marker in explicitly configured dev databases."""

from __future__ import annotations

import asyncio
import os
import subprocess
from urllib.parse import urlparse

from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine

CORPORATE_LOCAL_URL = (
    "postgresql+asyncpg://corporate_app:corporate_dev@localhost:5432/budimind_corporate"
)
CLINICAL_LOCAL_URL = (
    "postgresql+asyncpg://clinical_app:clinical_dev@localhost:5433/budimind_clinical"
)


async def reset(url: str, service: str, database: str, user: str) -> None:
    parsed = urlparse(url)
    if parsed.hostname not in {"localhost", "127.0.0.1"}:
        raise RuntimeError("Refusing to reset a non-local database")
    engine = create_async_engine(url, pool_pre_ping=True)
    try:
        async with engine.begin() as connection:
            await connection.execute(text("DROP TABLE IF EXISTS _schema_migrations"))
    except Exception:
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
                "DROP TABLE IF EXISTS _schema_migrations;",
            ],
            check=True,
            capture_output=True,
            text=True,
        )
    finally:
        await engine.dispose()


async def main() -> None:
    await asyncio.gather(
        reset(
            os.getenv("CORPORATE_DATABASE_URL", CORPORATE_LOCAL_URL),
            "corporate-db",
            "budimind_corporate",
            "corporate_app",
        ),
        reset(
            os.getenv("CLINICAL_DATABASE_URL", CLINICAL_LOCAL_URL),
            "clinical-db",
            "budimind_clinical",
            "clinical_app",
        ),
    )


if __name__ == "__main__":
    asyncio.run(main())
