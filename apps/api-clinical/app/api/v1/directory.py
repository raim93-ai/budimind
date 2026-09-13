from __future__ import annotations

from datetime import datetime
from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.auth import require_actor
from app.db.session import get_db
from python.budimind_auth import AuthorizationDenied, PolicyContext, authorize, emit_audit

router = APIRouter()
OPS_ROLES = frozenset({"clinic_admin", "clinical_operations"})


class PractitionerCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    slug: str = Field(pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$", min_length=2, max_length=80)
    display_name: str = Field(min_length=2, max_length=120)
    biography: str = Field(default="", max_length=2_000)
    languages: list[str] = Field(default_factory=list, max_length=5)
    modalities: list[str] = Field(default_factory=list, max_length=8)
    locations: list[str] = Field(default_factory=list, max_length=5)


class CredentialCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    authority: str = Field(min_length=2, max_length=120)
    evidence_ref: str = Field(min_length=2, max_length=200)
    scope: str = Field(min_length=2, max_length=500)
    expires_at: datetime
    indemnity_expires_at: datetime


class CredentialReview(BaseModel):
    model_config = ConfigDict(extra="forbid")

    decision: str = Field(pattern=r"^(verified|suspended)$")


class ServiceCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: str = Field(min_length=2, max_length=120)
    duration_minutes: int = Field(ge=30, le=180)
    fee_minor: int = Field(ge=0, le=10_000_000)
    currency: str = Field(pattern=r"^MYR$")


class ApprovalCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    decision: str = Field(pattern=r"^(approved|rejected)$")


def _ops_context(actor: dict[str, str]) -> PolicyContext:
    try:
        return PolicyContext(actor["id"], actor["role"], "clinical")
    except (KeyError, TypeError) as exc:
        raise HTTPException(status_code=403, detail="Access denied") from exc


def _require_ops(actor: dict[str, str]) -> PolicyContext:
    context = _ops_context(actor)
    try:
        authorize(context, plane="clinical", roles=OPS_ROLES)
    except AuthorizationDenied as exc:
        raise HTTPException(status_code=403, detail="Access denied") from exc
    return context


@router.get("/practitioners")
async def list_public_practitioners(
    response: Response,
    limit: Annotated[int, Query(ge=1, le=50)] = 20,
    offset: Annotated[int, Query(ge=0, le=10_000)] = 0,
    db: AsyncSession = Depends(get_db),  # noqa: B008
) -> dict[str, object]:
    response.headers["Cache-Control"] = "public, max-age=60, stale-while-revalidate=300"
    result = await db.execute(
        text(
            "select slug, display_name, biography, languages, modalities, locations, services "
            "from private.practitioner_public_projection "
            "order by display_name, slug limit :limit offset :offset"
        ),
        {"limit": limit, "offset": offset},
    )
    return {
        "items": [dict(row) for row in result.mappings().all()],
        "limit": limit,
        "offset": offset,
    }


@router.get("/practitioners/{slug}")
async def get_public_practitioner(
    slug: str,
    response: Response,
    db: AsyncSession = Depends(get_db),  # noqa: B008
) -> dict[str, object]:
    response.headers["Cache-Control"] = "public, max-age=60, stale-while-revalidate=300"
    result = await db.execute(
        text(
            "select slug, display_name, biography, languages, modalities, locations, services "
            "from private.practitioner_public_projection where slug = :slug"
        ),
        {"slug": slug},
    )
    row = result.mappings().first()
    if not row:
        raise HTTPException(status_code=404, detail="Practitioner not found")
    return dict(row)


@router.post("/operations/practitioners", status_code=status.HTTP_201_CREATED)
async def create_practitioner(
    payload: PractitionerCreate,
    actor: dict[str, str] = Depends(require_actor),  # noqa: B008
    db: AsyncSession = Depends(get_db),  # noqa: B008
) -> dict[str, str]:
    context = _require_ops(actor)
    result = await db.execute(
        text(
            "insert into private.practitioner_profile "
            "(slug, display_name, biography, languages, modalities, locations) "
            "values (:slug, :display_name, :biography, :languages, :modalities, :locations) "
            "returning id::text"
        ),
        payload.model_dump(),
    )
    practitioner_id = result.scalar_one()
    await emit_audit(
        db,
        context,
        action="practitioner.create",
        resource_type="practitioner",
        outcome="success",
        resource_id=practitioner_id,
    )
    return {"id": practitioner_id}


@router.post("/operations/practitioners/{practitioner_id}/credential")
async def add_credential(
    practitioner_id: UUID,
    payload: CredentialCreate,
    actor: dict[str, str] = Depends(require_actor),  # noqa: B008
    db: AsyncSession = Depends(get_db),  # noqa: B008
) -> dict[str, str]:
    context = _require_ops(actor)
    try:
        result = await db.execute(
            text(
                "insert into private.practitioner_credential "
                "(practitioner_id, authority, evidence_ref, scope, expires_at, "
                "indemnity_expires_at) "
                "values (:id, :authority, :evidence_ref, :scope, :expires_at, "
                ":indemnity_expires_at) "
                "returning id::text"
            ),
            {"id": practitioner_id, **payload.model_dump()},
        )
    except IntegrityError as exc:
        await db.rollback()
        raise HTTPException(status_code=404, detail="Practitioner not found") from exc
    credential_id = result.scalar_one()
    await emit_audit(
        db,
        context,
        action="practitioner.credential.add",
        resource_type="credential",
        outcome="success",
        resource_id=credential_id,
    )
    return {"id": credential_id}


@router.post("/operations/credentials/{credential_id}/review")
async def review_credential(
    credential_id: UUID,
    payload: CredentialReview,
    actor: dict[str, str] = Depends(require_actor),  # noqa: B008
    db: AsyncSession = Depends(get_db),  # noqa: B008
) -> dict[str, str]:
    context = _require_ops(actor)
    result = await db.execute(
        text(
            "update private.practitioner_credential c "
            "set status = :decision, reviewed_by = cast(:actor as uuid), reviewed_at = now() "
            "where c.id = :id and (:decision <> 'verified' or "
            "(c.expires_at > now() and c.indemnity_expires_at > now())) "
            "returning c.practitioner_id::text"
        ),
        {"id": credential_id, "actor": context.actor_id, **payload.model_dump()},
    )
    practitioner_id = result.scalar_one_or_none()
    if practitioner_id is None:
        raise HTTPException(status_code=404, detail="Credential not found")
    if payload.decision == "suspended":
        await db.execute(
            text(
                "update private.practitioner_profile set publication_state='suspended', "
                "updated_at=now() where id=cast(:id as uuid)"
            ),
            {"id": practitioner_id},
        )
    await emit_audit(
        db,
        context,
        action="practitioner.credential.review",
        resource_type="credential",
        outcome="success",
        resource_id=str(credential_id),
    )
    return {"status": payload.decision}


@router.post("/operations/practitioners/{practitioner_id}/service")
async def add_service(
    practitioner_id: UUID,
    payload: ServiceCreate,
    actor: dict[str, str] = Depends(require_actor),  # noqa: B008
    db: AsyncSession = Depends(get_db),  # noqa: B008
) -> dict[str, str]:
    context = _require_ops(actor)
    try:
        result = await db.execute(
            text(
                "insert into private.practitioner_service "
                "(practitioner_id, name, duration_minutes, fee_minor, currency) "
                "values (:id, :name, :duration_minutes, :fee_minor, :currency) "
                "returning id::text"
            ),
            {"id": practitioner_id, **payload.model_dump()},
        )
    except IntegrityError as exc:
        await db.rollback()
        raise HTTPException(status_code=404, detail="Practitioner not found") from exc
    service_id = result.scalar_one()
    await emit_audit(
        db,
        context,
        action="practitioner.service.add",
        resource_type="service",
        outcome="success",
        resource_id=service_id,
    )
    return {"id": service_id}


@router.post("/operations/practitioners/{practitioner_id}/publish")
async def publish_practitioner(
    practitioner_id: UUID,
    actor: dict[str, str] = Depends(require_actor),  # noqa: B008
    db: AsyncSession = Depends(get_db),  # noqa: B008
) -> dict[str, str]:
    context = _require_ops(actor)
    result = await db.execute(
        text(
            "select p.publication_state, "
            "(select count(*) from private.practitioner_publication_approval a "
            " where a.practitioner_id = p.id and a.decision = 'approved') as approvals, "
            "(select count(*) from private.practitioner_credential c "
            " where c.practitioner_id = p.id and c.status = 'verified' "
            " and c.expires_at > now() and c.indemnity_expires_at > now()) as credentials "
            "from private.practitioner_profile p where p.id = :id"
        ),
        {"id": practitioner_id},
    )
    row = result.mappings().first()
    if (
        not row
        or row["publication_state"] != "unpublished"
        or row["approvals"] < 2
        or row["credentials"] < 1
    ):
        raise HTTPException(status_code=403, detail="Publication requirements not met")
    await db.execute(
        text(
            "update private.practitioner_profile "
            "set publication_state = 'published', updated_at = now() "
            "where id = :id"
        ),
        {"id": practitioner_id},
    )
    await emit_audit(
        db,
        context,
        action="practitioner.publish",
        resource_type="practitioner",
        outcome="success",
        resource_id=str(practitioner_id),
    )
    return {"status": "published"}


@router.post("/operations/practitioners/{practitioner_id}/approval")
async def record_approval(
    practitioner_id: UUID,
    payload: ApprovalCreate,
    actor: dict[str, str] = Depends(require_actor),  # noqa: B008
    db: AsyncSession = Depends(get_db),  # noqa: B008
) -> dict[str, str]:
    context = _require_ops(actor)
    try:
        await db.execute(
            text(
                "insert into private.practitioner_publication_approval "
                "(practitioner_id, approver_actor_id, decision) "
                "values (:id, cast(:actor as uuid), :decision)"
            ),
            {"id": practitioner_id, "actor": context.actor_id, **payload.model_dump()},
        )
        await emit_audit(
            db,
            context,
            action="practitioner.approval.record",
            resource_type="publication_approval",
            outcome="success",
        )
    except IntegrityError as exc:
        await db.rollback()
        raise HTTPException(status_code=409, detail="Approval could not be recorded") from exc
    return {"status": payload.decision}


@router.post("/operations/practitioners/{practitioner_id}/suspend")
async def suspend_practitioner(
    practitioner_id: UUID,
    actor: dict[str, str] = Depends(require_actor),  # noqa: B008
    db: AsyncSession = Depends(get_db),  # noqa: B008
) -> dict[str, str]:
    context = _require_ops(actor)
    result = await db.execute(
        text(
            "update private.practitioner_profile "
            "set publication_state = 'suspended', updated_at = now() "
            "where id = :id returning id"
        ),
        {"id": practitioner_id},
    )
    if result.scalar_one_or_none() is None:
        raise HTTPException(status_code=404, detail="Practitioner not found")
    await emit_audit(
        db,
        context,
        action="practitioner.suspend",
        resource_type="practitioner",
        outcome="success",
        resource_id=str(practitioner_id),
    )
    return {"status": "suspended"}
