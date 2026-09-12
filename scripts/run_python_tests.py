"""Run Python tests locally or in an ephemeral Docker runner.

Docker Desktop cannot publish ports for containers attached only to internal
networks. When both local database ports are unavailable, keep those networks
isolated and run pytest from a short-lived container attached to each plane.
"""

from __future__ import annotations

import os
import socket
import subprocess
import sys
import uuid
from pathlib import Path
from urllib.parse import urlparse

CORPORATE_LOCAL_URL = (
    "postgresql+asyncpg://corporate_app:corporate_dev@localhost:5432/"
    "budimind_corporate"
)
CLINICAL_LOCAL_URL = (
    "postgresql+asyncpg://clinical_app:clinical_dev@localhost:5433/"
    "budimind_clinical"
)
CONTAINER_DATABASE_URLS = {
    "CORPORATE_DATABASE_URL": (
        "postgresql+asyncpg://corporate_app:corporate_dev@corporate-db:5432/"
        "budimind_corporate"
    ),
    "CLINICAL_DATABASE_URL": (
        "postgresql+asyncpg://clinical_app:clinical_dev@clinical-db:5432/"
        "budimind_clinical"
    ),
}
LOCAL_DATABASE_URLS = {
    "CORPORATE_DATABASE_URL": CORPORATE_LOCAL_URL,
    "CLINICAL_DATABASE_URL": CLINICAL_LOCAL_URL,
}
INTERNAL_NETWORKS = ("budimind_corporate-network", "budimind_clinical-network")
TEST_IMAGE = (
    "ghcr.io/astral-sh/uv@"
    "sha256:531f855bda2c73cd6ef67d56b733b357cea384185b3022bd09f05e002cd144ca"
)


def _is_reachable(url: str) -> bool:
    parsed = urlparse(url)
    if parsed.hostname is None or parsed.port is None:
        return False
    try:
        with socket.create_connection((parsed.hostname, parsed.port), timeout=0.5):
            return True
    except OSError:
        return False


def _run_local(pytest_args: list[str]) -> int:
    return subprocess.run(
        [sys.executable, "-m", "pytest", *pytest_args], check=False
    ).returncode


def _run_in_docker(pytest_args: list[str]) -> int:
    repository = Path(__file__).resolve().parents[1]
    container_name = f"budimind-python-tests-{uuid.uuid4().hex[:12]}"
    image = os.getenv("BUDIMIND_PYTHON_TEST_IMAGE", TEST_IMAGE)
    command = [
        "docker",
        "create",
        "--name",
        container_name,
        "--network",
        "bridge",
        "--mount",
        f"type=bind,source={repository},target=/workspace,readonly",
        "--mount",
        "type=volume,source=budimind-python-test-venv,target=/workspace/.venv",
        "--mount",
        "type=volume,source=budimind-python-test-cache,target=/root/.cache/uv",
        "--workdir",
        "/workspace",
        "--env",
        "ENVIRONMENT=test",
        "--env",
        "UV_LINK_MODE=copy",
    ]
    for name, value in CONTAINER_DATABASE_URLS.items():
        command.extend(["--env", f"{name}={value}"])
    command.extend(
        [
            image,
            "uv",
            "run",
            "--frozen",
            "python",
            "-m",
            "pytest",
            "-p",
            "no:cacheprovider",
        ]
    )
    command.extend(pytest_args)

    created = False
    try:
        subprocess.run(command, check=True, stdout=subprocess.DEVNULL)
        created = True
        for network in INTERNAL_NETWORKS:
            subprocess.run(
                ["docker", "network", "connect", network, container_name], check=True
            )
        return subprocess.run(
            ["docker", "start", "--attach", container_name], check=False
        ).returncode
    finally:
        if created:
            subprocess.run(
                ["docker", "rm", "--force", container_name],
                check=False,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
            )


def main() -> int:
    urls = {
        name: os.getenv(name, default) for name, default in LOCAL_DATABASE_URLS.items()
    }
    if urls != LOCAL_DATABASE_URLS:
        return _run_local(sys.argv[1:])
    if all(_is_reachable(url) for url in urls.values()):
        return _run_local(sys.argv[1:])

    print(
        "Local test database ports are unavailable; using an ephemeral Docker "
        "runner on the isolated corporate and clinical networks.",
        flush=True,
    )
    return _run_in_docker(sys.argv[1:])


if __name__ == "__main__":
    raise SystemExit(main())
