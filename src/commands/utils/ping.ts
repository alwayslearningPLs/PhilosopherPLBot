import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { Command } from "../../structures/Command";

export default class Ping extends Command {
  static emojis = (ping: number) => {
    if (ping <= 100) return "🟢";
    if (ping <= 200) return "🟡";
    if (ping >= 200) return "🔴";
  };

  constructor() {
    super({
      category: "Utils",
      userPerms: ["SendMessages", "UseApplicationCommands"],
      clientPerms: ["SendMessages"],
      data: new SlashCommandBuilder().setName("ping").setDescription("Pong!"),

      run: async ({ client, interaction }) => {
        const embed = new EmbedBuilder()
          .setTitle(`\`${Ping.emojis(client.ws.ping)}\`  |  Ping...`)
          .setColor(client.colors.Invisible);
        const reply = await interaction.reply({
          embeds: [embed],
          fetchReply: true,
        });

        const ping = reply.createdTimestamp - Date.now();

        embed.setTitle(`\`${Ping.emojis(client.ws.ping)}\`  |  Pong...`);
        embed.setColor(client.colors.Success);
        embed.setDescription(
          `> **Latencia:** \`${ping}ms\`\n> **API:** \`${client.ws.ping}ms\``
        );
        await reply.edit({ embeds: [embed] });
      },
    });
  }
}
