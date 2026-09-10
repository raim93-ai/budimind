import logging
import sys

from pythonjsonlogger import jsonlogger

from app.core.config import settings


class RedactingFormatter(jsonlogger.JsonFormatter):  # type: ignore[misc, name-defined]
    """JSON log formatter that redacts sensitive fields."""

    SENSITIVE_FIELDS = {
        "password",
        "token",
        "secret",
        "key",
        "authorization",
        "credit_card",
        "ssn",
        "email",
        "phone",
        "address",
    }

    def add_fields(
        self,
        log_record: dict[str, object],
        record: logging.LogRecord,
        message_dict: dict[str, object],
    ) -> None:
        super().add_fields(log_record, record, message_dict)
        # Redact sensitive fields
        for key in list(log_record.keys()):
            if any(sensitive in key.lower() for sensitive in self.SENSITIVE_FIELDS):
                log_record[key] = "[REDACTED]"


def setup_logging() -> None:
    """Configure application logging with JSON output and redaction."""
    log_level = logging.DEBUG if settings.ENVIRONMENT == "development" else logging.INFO

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(
        RedactingFormatter(
            "%(timestamp)s %(level)s %(name)s %(message)s",
            rename_fields={"levelname": "level", "asctime": "timestamp"},
        )
    )

    root_logger = logging.getLogger()
    root_logger.handlers = [handler]
    root_logger.setLevel(log_level)

    # Reduce noise from libraries
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)
