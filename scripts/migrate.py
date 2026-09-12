"""Apply the baseline schema to both isolated PostgreSQL databases."""

from __future__ import annotations

import asyncio
import os
import subprocess
from datetime import UTC, datetime
from urllib.parse import urlparse

from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine

MIGRATION_DIRS = {
    "corporate-db": "supabase/corporate/migrations",
    "clinical-db": "supabase/clinical/migrations",
}
CORPORATE_LOCAL_URL = (
    "postgresql+asyncpg://corporate_app:corporate_dev@localhost:5432/budimind_corporate"
)
CLINICAL_LOCAL_URL = (
    "postgresql+asyncpg://clinical_app:clinical_dev@localhost:5433/budimind_clinical"
)
MARKER_SQL = """
CREATE SCHEMA IF NOT EXISTS private;
CREATE TABLE IF NOT EXISTS private._schema_migrations (
    version VARCHAR(64) PRIMARY KEY,
    applied_at TIMESTAMP(6) WITH TIME ZONE NOT NULL
)
"""


async def migrate(url: str, service: str, database: str, user: str) -> None:
    migration_dir = MIGRATION_DIRS[service]
    migrations = sorted(
        (path for path in __import__("pathlib").Path(migration_dir).glob("*.sql")),
        key=lambda path: path.name,
    )
    engine = create_async_engine(url, pool_pre_ping=True)
    try:
        async with engine.begin() as connection:
            await connection.exec_driver_sql(MARKER_SQL)
            for migration in migrations:
                version = migration.stem
                result = await connection.execute(
                    text("SELECT 1 FROM private._schema_migrations WHERE version = :version"),
                    {"version": version},
                )
                if result.scalar_one_or_none() is None:
                    await connection.exec_driver_sql(migration.read_text(encoding="utf-8"))
                    await connection.execute(
                        text(
                            "INSERT INTO private._schema_migrations (version, applied_at) "
                            "VALUES (:version, :applied_at)"
                        ),
                        {"version": version, "applied_at": datetime.now(UTC)},
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
                f"{MARKER_SQL};"
                + "".join(path.read_text(encoding="utf-8") + "\n" for path in migrations)
                + "INSERT INTO private._schema_migrations (version, applied_at) "
                + "SELECT value, CURRENT_TIMESTAMP FROM unnest(ARRAY["
                + ",".join("'" + path.stem.replace("'", "''") + "'" for path in migrations)
                + "]) AS value ON CONFLICT (version) DO NOTHING;",
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
