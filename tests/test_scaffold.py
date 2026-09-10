from pathlib import Path


ROOT = Path(__file__).parents[1]


def test_local_compose_keeps_database_names_separate() -> None:
    compose = (ROOT / "compose.yaml").read_text(encoding="utf-8")

    assert "budimind_corporate" in compose
    assert "budimind_clinical" in compose
    assert "5432:5432" in compose
    assert "5433:5432" in compose
