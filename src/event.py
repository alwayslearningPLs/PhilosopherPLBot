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
        embed = discord.Embed(
            title = "Error",
            color = discord.Color.red()
        ).set_footer(
            text = f"Pedido por: {ctx.author} | (ID: {ctx.author.id})", icon_url = ctx.author.display_avatar
        )
        
        if isinstance(error, commands.CommandNotFound):
            embed.description = "El comando que has ingresado no existe."
        elif isinstance(error, commands.MissingRequiredArgument):
            embed.description = "Falta un argumento requerido."
        elif isinstance(error, commands.MissingPermissions):
            embed.description = "No tienes permisos para ejecutar este comando."
        elif isinstance(error, commands.BotMissingPermissions):
            embed.description = "No tengo permisos para ejecutar este comando."

        await ctx.reply(embed = embed)


async def setup(bot: commands.Bot) -> None:
    await bot.add_cog(Event(bot))
