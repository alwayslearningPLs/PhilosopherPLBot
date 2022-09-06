import logging, coloredlogs, asyncio, contextlib
from typing import Any
from bot import Filosofo

@contextlib.contextmanager
def logger() -> Any:
    (bot, dbot) = (logging.getLogger("Bot"), logging.getLogger("Discord"))
    __LOG_FORMAT = "%(asctime)s | %(name)s [%(levelname)s] : %(message)s"
    
    logging.basicConfig(
        format = __LOG_FORMAT,
        level = logging.INFO,
        datefmt = "%m/%d/%Y, %H:%M%S"
    )

    try:
        # __enter__
        coloredlogs.install(level = logging.INFO, logger = bot, fmt = __LOG_FORMAT)
        coloredlogs.install(level = logging.INFO, logger = dbot, fmt = __LOG_FORMAT)    
        yield
    finally: 
        # __exit__
        pass

async def runBot() -> None:
    async with Filosofo() as bot:
        await bot.start()

if __name__ == "__main__":
    with logger():
        asyncio.run(runBot())