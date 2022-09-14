import {
  ButtonStyle,
  ChatInputCommandInteraction,
  ComponentType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  MessageActionRowComponentBuilder,
} from "discord.js";

export class NavEmbedBuilder {
  private embeds: EmbedBuilder[] = [];
  private currentPage: number = 0;

  constructor(embeds: EmbedBuilder[]) {
    if (embeds.length < 2)
      throw new Error("[NavEmbedBuilder] requiere de al menos 2 embeds");
    this.embeds = embeds;
  }

  public async start(interaction: ChatInputCommandInteraction<"cached">) {
    const leftButton = new ButtonBuilder()
      .setLabel("◀️")
      .setCustomId(`left-${interaction.id}`)
      .setStyle(ButtonStyle.Primary)
      .setDisabled(true);

    const rightButton = new ButtonBuilder()
      .setLabel("▶️")
      .setCustomId(`right-${interaction.id}`)
      .setStyle(ButtonStyle.Primary);

    const midButton = new ButtonBuilder()
      .setLabel("🗑️")
      .setCustomId(`mid-${interaction.id}`)
      .setStyle(ButtonStyle.Danger);

    const buttons = [leftButton, midButton, rightButton];
    const row =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        buttons
      );
    const reply = await interaction.reply({
      embeds: [
        this.embeds[0].setFooter({
          text: `Página ${this.currentPage + 1} de ${this.embeds.length}`,
        }),
      ],
      components: [row],
      fetchReply: true,
    });
    const collector = (await reply).createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 60000,
      filter: (i) => i.user.id === interaction.user.id,
    });

    collector?.on("collect", async (i) => {
      i.deferUpdate();
      if (i.customId == `mid-${interaction.id}`) {
        collector.stop("Paginación terminada");
        return;
      }
      if (i.customId == `left-${interaction.id}`) {
        this.currentPage--;
        if (this.currentPage < 0) this.currentPage = 0;
      } else if (i.customId == `right-${interaction.id}`) {
        this.currentPage++;
        if (this.currentPage >= this.embeds.length)
          this.currentPage = this.embeds.length - 1;
      }

      if (this.currentPage === 0) {
        leftButton.setDisabled(true);
        rightButton.setDisabled(false);
      }
      if (this.currentPage === this.embeds.length - 1) {
        leftButton.setDisabled(false);
        rightButton.setDisabled(true);
      }
      if (this.currentPage > 0 && this.currentPage < this.embeds.length - 1) {
        leftButton.setDisabled(false);
        rightButton.setDisabled(false);
      }

      const buttons = [leftButton, midButton, rightButton];
      const row =
        new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
          buttons
        );
      if (interaction.id === interaction.id)
        (await reply).edit({
          embeds: [
            this.embeds[this.currentPage].setFooter({
              text: `Página ${this.currentPage + 1} de ${this.embeds.length}`,
            }),
          ],
          components: [row],
        });
    });

    collector?.on("end", async (_, reason) => {
      if (reason == "pressed mid button") {
        interaction.deleteReply();
        return;
      }
      if (reason != "pressed mid button")
        interaction.editReply({
          content: "La paginación ha terminado",
          components: [],
        });
      return;
    });
  }
}
