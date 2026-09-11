from pathlib import Path

ROOT = Path(__file__).parents[1]


def test_local_compose_keeps_postgres_boundaries_separate() -> None:
    compose = (ROOT / "compose.yaml").read_text(encoding="utf-8")

    assert "budimind_corporate" in compose
    assert "budimind_clinical" in compose
    assert "postgres:15.8-bookworm" in compose
    assert "5432:5432" in compose
    assert "5433:5432" in compose
    assert "corporate-network" in compose
    assert "clinical-network" in compose
    assert "internal: true" in compose


def test_vercel_supabase_configuration_keeps_secrets_server_side() -> None:
    env = (ROOT / ".env.example").read_text(encoding="utf-8")

    assert '"regions": ["sin1"]' in (
        ROOT / "apps" / "corporate-web" / "vercel.json"
    ).read_text(encoding="utf-8")
    assert '"regions": ["sin1"]' in (
        ROOT / "apps" / "clinic-web" / "vercel.json"
    ).read_text(encoding="utf-8")
    assert "NEXT_PUBLIC_CORPORATE_SUPABASE_PUBLISHABLE_KEY=" in env
    assert "NEXT_PUBLIC_CLINICAL_SUPABASE_PUBLISHABLE_KEY=" in env
    assert "NEXT_PUBLIC_CORPORATE_SUPABASE_SECRET_KEY" not in env
    assert "NEXT_PUBLIC_CLINICAL_SUPABASE_SECRET_KEY" not in env
