import pytest

from python.budimind_auth import (
    DeterministicFakeIdentityAdapter,
    IdentityProviderUnavailable,
    InvalidIdentity,
    SupabaseIdentityAdapter,
    build_identity_adapter,
    csrf_matches,
    token_hash,
)


@pytest.mark.asyncio
async def test_fake_identity_is_deterministic_and_requires_verified_email() -> None:
    adapter = DeterministicFakeIdentityAdapter()

    verified = await adapter.introspect("fake-verified-token")
    assert verified.subject == "fake-verified-user"
    assert verified.email_verified is True

    unverified = await adapter.introspect("fake-unverified-token")
    assert unverified.email_verified is False

    with pytest.raises(InvalidIdentity):
        await adapter.introspect("not-a-test-token")


@pytest.mark.asyncio
async def test_unconfigured_supabase_fails_closed_at_request_time() -> None:
    with pytest.raises(IdentityProviderUnavailable):
        await SupabaseIdentityAdapter("", "").introspect("access-token")


@pytest.mark.asyncio
async def test_supabase_adapter_accepts_realistic_jwt_length() -> None:
    adapter = SupabaseIdentityAdapter("", "")
    realistic_jwt = ".".join(["a" * 300, "b" * 300, "c" * 86])
    with pytest.raises(IdentityProviderUnavailable):
        await adapter.introspect(realistic_jwt)


def test_fake_identity_cannot_be_enabled_outside_local_environments() -> None:
    with pytest.raises(ValueError, match="only available in development or test"):
        build_identity_adapter(provider="fake", environment="production", url="", api_key="")


def test_csrf_requires_exact_constant_time_double_submit_value() -> None:
    assert csrf_matches("csrf-value", "csrf-value")
    assert not csrf_matches("csrf-value", "different")
    assert not csrf_matches(None, "csrf-value")


def test_session_tokens_are_hashed_before_storage() -> None:
    digest = token_hash("a-secure-opaque-session-token-value")
    assert len(digest) == 32
    assert digest != b"a-secure-opaque-session-token-value"
