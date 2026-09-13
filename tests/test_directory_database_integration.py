from __future__ import annotations

import os
from uuid import uuid4

import pytest
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.pool import NullPool

CLINICAL_URL = os.getenv(
    "CLINICAL_DATABASE_URL",
    "postgresql+asyncpg://clinical_app:clinical_dev@localhost:5433/budimind_clinical",
)


@pytest.mark.asyncio
async def test_publication_lifecycle_and_expiry_leakage() -> None:
    engine = create_async_engine(CLINICAL_URL, poolclass=NullPool)
    slug = f"synthetic-directory-{uuid4().hex[:12]}"
    practitioner_id: str | None = None
    try:
        async with engine.begin() as connection:
            practitioner_id = str(
                (
                    await connection.execute(
                        text(
                            "insert into private.practitioner_profile "
                            "(slug, display_name, biography, languages, modalities, locations) "
                            "values (:slug, 'Synthetic Clinician', 'Synthetic test profile', "
                            "array['en'], array['CBT'], array['Kuala Lumpur']) returning id"
                        ),
                        {"slug": slug},
                    )
                ).scalar_one()
            )
            await connection.execute(
                text(
                    "insert into private.practitioner_credential "
                    "(practitioner_id, authority, evidence_ref, scope, status, expires_at, "
                    "indemnity_expires_at) values (cast(:id as uuid), 'Synthetic Board', "
                    "'synthetic-ref', 'Adult counselling', "
                    "'verified', now() + interval '1 day', now() + interval '1 day')"
                ),
                {"id": practitioner_id},
            )
            await connection.execute(
                text(
                    "insert into private.practitioner_publication_approval "
                    "(practitioner_id, approver_actor_id, decision) values "
                    "(cast(:id as uuid), '00000000-0000-0000-0000-000000000001', 'approved'), "
                    "(cast(:id as uuid), '00000000-0000-0000-0000-000000000002', 'approved')"
                ),
                {"id": practitioner_id},
            )
            await connection.execute(
                text(
                    "update private.practitioner_profile set publication_state='published' "
                    "where id=cast(:id as uuid)"
                ),
                {"id": practitioner_id},
            )
            assert (
                await connection.execute(
                    text(
                        "select count(*) from private.practitioner_public_projection "
                        "where slug=:slug"
                    ),
                    {"slug": slug},
                )
            ).scalar_one() == 1

            await connection.execute(
                text(
                    "update private.practitioner_credential "
                    "set expires_at=now() - interval '1 second' "
                    "where practitioner_id=cast(:id as uuid)"
                ),
                {"id": practitioner_id},
            )
            assert (
                await connection.execute(
                    text(
                        "select count(*) from private.practitioner_public_projection "
                        "where slug=:slug"
                    ),
                    {"slug": slug},
                )
            ).scalar_one() == 0
    finally:
        if practitioner_id is not None:
            async with engine.begin() as connection:
                await connection.execute(
                    text("delete from private.practitioner_profile where id=cast(:id as uuid)"),
                    {"id": practitioner_id},
                )
        await engine.dispose()
