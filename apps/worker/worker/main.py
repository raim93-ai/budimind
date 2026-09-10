"""BudiMind Worker - Durable job consumers for corporate and clinical domains."""

import asyncio
import logging
import signal

from worker.core.logging import setup_logging

logger = logging.getLogger(__name__)


class WorkerManager:
    """Manages corporate and clinical job consumers."""

    def __init__(self) -> None:
        self.running = False
        self.tasks: list[asyncio.Task[None]] = []

    async def start(self) -> None:
        """Start all consumers."""
        self.running = True
        logger.info("Starting BudiMind Worker")

        # Corporate consumers are introduced with the corporate job stage.
        # self.tasks.append(asyncio.create_task(self._run_corporate_consumer()))

        # Clinical consumers are introduced with the clinical job stage.
        # self.tasks.append(asyncio.create_task(self._run_clinical_consumer()))

        # For now, just run a health check loop
        self.tasks.append(asyncio.create_task(self._health_loop()))

        try:
            await asyncio.gather(*self.tasks)
        except asyncio.CancelledError:
            logger.info("Worker tasks cancelled")

    async def stop(self) -> None:
        """Stop all consumers gracefully."""
        self.running = False
        logger.info("Stopping BudiMind Worker")

        for task in self.tasks:
            task.cancel()

        if self.tasks:
            await asyncio.gather(*self.tasks, return_exceptions=True)

        logger.info("Worker stopped")

    async def _health_loop(self) -> None:
        """Periodic health logging."""
        while self.running:
            logger.info("Worker healthy - corporate and clinical consumers ready")
            await asyncio.sleep(30)

    # async def _run_corporate_consumer(self):
    #     """Run corporate job consumer."""
    #     pass
    #
    # async def _run_clinical_consumer(self):
    #     """Run clinical job consumer."""
    #     pass


async def main() -> None:
    """Main entry point."""
    setup_logging()

    manager = WorkerManager()

    # Handle shutdown signals
    loop = asyncio.get_running_loop()
    for sig in (signal.SIGTERM, signal.SIGINT):
        loop.add_signal_handler(sig, lambda: asyncio.create_task(manager.stop()))

    await manager.start()


if __name__ == "__main__":
    asyncio.run(main())
