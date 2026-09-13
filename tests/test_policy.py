import pytest

from python.budimind_auth import AuthorizationDenied, PolicyContext, authorize


def context(**changes: object) -> PolicyContext:
    values: dict[str, object] = {
        "actor_id": "00000000-0000-0000-0000-000000000001",
        "role": "sponsor_admin",
        "plane": "corporate",
        "tenant_id": "tenant-a",
        "purpose": "campaign-review",
        "relationship": True,
    }
    values.update(changes)
    return PolicyContext(**values)  # type: ignore[arg-type]


def test_policy_allows_matching_scope() -> None:
    authorize(
        context(), plane="corporate", roles=frozenset({"sponsor_admin"}), tenant_id="tenant-a"
    )


@pytest.mark.parametrize(
    "changes, kwargs",
    [
        ({"role": "client"}, {"roles": frozenset({"sponsor_admin"})}),
        (
            {"tenant_id": "tenant-b"},
            {"roles": frozenset({"sponsor_admin"}), "tenant_id": "tenant-a"},
        ),
        ({"plane": "clinical"}, {"roles": frozenset({"sponsor_admin"})}),
        (
            {"purpose": None},
            {"roles": frozenset({"sponsor_admin"}), "purpose_required": True},
        ),
        (
            {"relationship": False},
            {"roles": frozenset({"sponsor_admin"}), "relationship_required": True},
        ),
    ],
)
def test_policy_denies_wrong_role_tenant_plane_or_missing_scope(
    changes: dict[str, object], kwargs: dict[str, object]
) -> None:
    with pytest.raises(AuthorizationDenied):
        authorize(context(**changes), plane="corporate", **kwargs)
