"""Apply the baseline schema to both isolated MySQL databases."""

from __future__ import annotations

import asyncio
import os
from datetime import UTC, datetime

from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine


MIGRATION = "0001_baseline"


async def migrate(url: str) -> None:
    engine = create_async_engine(url, pool_pre_ping=True)
    async with engine.begin() as connection:
        await connection.execute(
            text(
                """
                CREATE TABLE IF NOT EXISTS _schema_migrations (
                    version VARCHAR(64) PRIMARY KEY,
                    applied_at TIMESTAMP(6) NOT NULL
                )
                """
            )
        )
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
    await engine.dispose()


async def main() -> None:
    urls = [os.environ["CORPORATE_DATABASE_URL"], os.environ["CLINICAL_DATABASE_URL"]]
    await asyncio.gather(*(migrate(url) for url in urls))


if __name__ == "__main__":
    asyncio.run(main())
