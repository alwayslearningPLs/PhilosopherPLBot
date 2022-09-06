from discord.ext import commands 

class Docs(commands.Cog):
    def __init__(self, bot: commands.Bot) -> None:
        self.bot = bot 

    @commands.command(
        name = "docs",
        aliases = ["doc", "documentation", "documentacion"],
        description = "Muestra documentacion y utilidades de cierto lenguaje",
        usage = "<prefix>docs [post/get/delete] [language] (text) (url)"
    )
    @commands.cooldown(1, 5, commands.BucketType.user)
    async def docs(self, ctx: commands.Context, method: str, language: str, *, text: str = None) -> None:
        """
        Configurando...
        """
        ...

async def setup(bot: commands.Bot) -> None:
    await bot.add_cog(Docs(bot))