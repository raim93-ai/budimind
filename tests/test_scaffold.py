from pathlib import Path

ROOT = Path(__file__).parents[1]


def test_local_compose_keeps_mysql_boundaries_separate() -> None:
    compose = (ROOT / "compose.yaml").read_text(encoding="utf-8")

    assert "budimind_corporate" in compose
    assert "budimind_clinical" in compose
    assert "mysql:8.4.6" in compose
    assert "3306:3306" in compose
    assert "3307:3306" in compose
    assert "corporate-network" in compose
    assert "clinical-network" in compose
    assert "internal: true" in compose
