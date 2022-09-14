import {
  EmbedBuilder,
  SlashCommandBuilder,
  ActionRowBuilder,
  MessageActionRowComponentBuilder,
  SelectMenuBuilder,
  ComponentType,
} from "discord.js";
import { categorys } from "../../settings";
import { Command } from "../../structures/Command";

export default class help extends Command {
  constructor() {
    super({
      category: "Utils",
      userPerms: ["SendMessages"],
      clientPerms: ["SendMessages"],
      data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Lista todos los comandos"),

      async run({ client, interaction }) {
        const embeds: EmbedBuilder[] = [];

        embeds.push(
          new EmbedBuilder()
            .setTitle("Comandos...")
            .setDescription(
              `${categorys
                .map((category) => `> ✨ \`${category}\``)
                .join("\n")}`
            )
            .setColor(client.colors.Default)
        );

        for (const category of categorys) {
          const commands = client.commands.filter((c) => {
            const cmd = new c.default();
            return cmd.options.category === category;
          });
          const embed = new EmbedBuilder()
            .setTitle(`${category}`)
            .setDescription(
              `${commands
                .map((c) => {
                  const cmd = new c.default();
                  return `> \✨ \`${cmd.options.data.name}\``;
                })
                .join("\n")}`
            )
            .setColor(client.colors.Default)
            .setFooter({ text: `${commands.size} comandos` });
          embeds.push(embed);
        }

        const menu = new SelectMenuBuilder()
          .setPlaceholder("Mira mis categorias!")
          .setCustomId("menu")
          .addOptions([
            {
              label: "🔧 Utils",
              description: "Categoria de utilidades",
              value: "0",
            },
            { label: "Dev", description: "Dev", value: "1" },
            {
              label: "Dev",
              description: "Dev",
              value: "2",
            },
            { label: "🏠 Menu", description: "Regresar al menu", value: "3" },
          ]);

        const row =
          new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
            [menu]
          );

        const rep = await interaction.reply({
          embeds: [embeds[0]],
          components: [row],
          fetchReply: true,
        });

        const collector = rep.createMessageComponentCollector({
          componentType: ComponentType.SelectMenu,
          time: 60000,
          filter: (i) => i.user.id === interaction.user.id,
        });

        collector.on("collect", async (i) => {
          i.deferUpdate();
          const index = i.values[0];
          if (index === "3") {
            await interaction.editReply({ embeds: [embeds[0]] });
          } else {
            await interaction.editReply({
              embeds: [embeds[Number(index) + 1]],
            });
          }
        });

        collector.on("end", async (_collected, reason) => {
          if (reason === "time") {
            await interaction.editReply({
              content: "Menu Expired",
              components: [],
            });
          }
        });
      },
    });
  }
}
