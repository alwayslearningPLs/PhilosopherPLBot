from __future__ import annotations
from typing import Any
from discord.ext import commands 
import discord, logging, collections, datetime, json, aiohttp

logs = logging.getLogger(__name__)
initial_extensions = [
    "src.event",
    "src.commands.docs"
    #...
]

class Filosofo(commands.AutoShardedBot):
    def __init__(self, **kwargs):
        super().__init__(
            command_prefix = commands.when_mentioned_or(self.settings['Prefix']),
            allowed_mentions = discord.AllowedMentions(roles = False, everyone = False, users = True),
            case_insensitive = True,
            intents = discord.Intents.all(),
            enable_debug_events = True,
            **kwargs
        )

        self.resumes: collections.defaultdict[int, list[datetime.datetime]] = collections.defaultdict(list)
        self.uptime: datetime.datetime = datetime.datetime.utcnow()

    async def setup_hook(self) -> None:
        self.session = aiohttp.ClientSession()
        await self.runCogs()

    async def runCogs(self) -> logging:
        for extension in initial_extensions:
            try: 
                await self.load_extension(extension)
                logs.info(f"Extension: {extension} cargada con exito.")
            except (Exception) as e:
                logs.error(f"Error al cargar la extension: {extension}", exc_info = e)     

    async def on_shard_resumed(self, shardID: int) -> logging:
        logs.info(f"Shard {shardID}, reconectado con exito.")
        self.resumes[shardID].append(datetime.datetime.utcnow())

    async def on_message(self, message: discord.Message) -> None:
        if message.author.bot: return
        await self.process_commands(message)

    async def close(self) -> None:
        await self.session.close()
        await super().close()

    async def start(self) -> None:
        await super().start(self.settings["Token"], reconnect = True)

    @property
    def settings(self) -> dict[str, Any]:
        with open("assets/settings.json", "r") as f:
            return json.load(f)['Auth']
