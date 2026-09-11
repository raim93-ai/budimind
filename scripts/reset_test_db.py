"""Reset only the baseline migration marker in explicitly configured dev databases."""

from __future__ import annotations

import asyncio
import os

from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine


async def reset(url: str) -> None:
    if "localhost" not in url and "127.0.0.1" not in url:
        raise RuntimeError("Refusing to reset a non-local database")
    engine = create_async_engine(url, pool_pre_ping=True)
    async with engine.begin() as connection:
        await connection.execute(text("DROP TABLE IF EXISTS _schema_migrations"))
    await engine.dispose()


async def main() -> None:
    await asyncio.gather(
        reset(os.environ["CORPORATE_DATABASE_URL"]),
        reset(os.environ["CLINICAL_DATABASE_URL"]),
    )


if __name__ == "__main__":
    asyncio.run(main())
