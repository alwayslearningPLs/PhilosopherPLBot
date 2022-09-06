import discord, logging
from discord.ext import commands 

class Event(commands.Cog):
    def __init__(self, bot: commands.Bot) -> None:
        self.bot = bot 
        self.logs = logging.getLogger(__name__)

    @commands.Cog.listener()
    async def on_ready(self) -> logging:
        if not hasattr(self.bot, 'uptime'):
            self.bot.uptime = discord.utils.utcnow()
        await self.bot.change_presence(
            activity = discord.Activity(
                type = discord.ActivityType.watching,
                name = f"📰  |  Filosofeando..."
            )
        )
        self.logs.info(f"Bot: {self.bot.user} | (ID: {self.bot.user.id}) | (Shards: {self.bot.shard_count})")

    @commands.Cog.listener()
    async def on_command_error(self, ctx: commands.Context, error: commands.CommandError) -> None:
        if isinstance(error, commands.CommandNotFound):
            await ctx.reply(f"> **Upss**, parece que el comando: `{ctx.invoked_with}` no existe.")  
                  

async def setup(bot: commands.Bot) -> None:
    await bot.add_cog(Event(bot))