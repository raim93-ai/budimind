"""Small, explicit authorization and audit primitives shared by both planes."""

from __future__ import annotations

from dataclasses import dataclass, field
from uuid import UUID, uuid4

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession


class AuthorizationDenied(Exception):
    """Raised for every protected-resource denial without revealing resource state."""


@dataclass(frozen=True, slots=True)
class PolicyContext:
    actor_id: str
    role: str
    plane: str
    tenant_id: str | None = None
    purpose: str | None = None
    relationship: bool = False
    correlation_id: UUID = field(default_factory=uuid4)


def authorize(
    context: PolicyContext,
    *,
    plane: str,
    roles: frozenset[str],
    tenant_id: str | None = None,
    purpose_required: bool = False,
    relationship_required: bool = False,
) -> None:
    """Deny by default when any required scope is absent or mismatched."""

    if context.plane != plane or context.role not in roles:
        raise AuthorizationDenied
    if tenant_id is not None and context.tenant_id != tenant_id:
        raise AuthorizationDenied
    if purpose_required and not context.purpose:
        raise AuthorizationDenied
    if relationship_required and not context.relationship:
        raise AuthorizationDenied


async def emit_audit(
    db: AsyncSession,
    context: PolicyContext,
    *,
    action: str,
    resource_type: str,
    outcome: str,
    resource_id: str | None = None,
) -> None:
    """Write only allow-listed identifiers and decisions to the append-only log."""

    if outcome not in {"success", "denied", "failure"}:
        raise ValueError("Invalid audit outcome")
    await db.execute(
        text(
            "insert into private.audit_event "
            "(actor_id, action, resource_type, resource_id, purpose, correlation_id, outcome) "
            "values (cast(:actor_id as uuid), :action, :resource_type, :resource_id, "
            ":purpose, :correlation_id, :outcome)"
        ),
        {
            "actor_id": context.actor_id,
            "action": action,
            "resource_type": resource_type,
            "resource_id": resource_id,
            "purpose": context.purpose or "unspecified",
            "correlation_id": context.correlation_id,
            "outcome": outcome,
        },
    )
    await db.commit()
