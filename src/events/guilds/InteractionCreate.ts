import {
  EmbedBuilder,
  Interaction,
  ChatInputCommandInteraction,
} from "discord.js";
import { Bot } from "../../structures/Client";
import { Command } from "../../structures/Command";
import CustomError from "../../structures/Error";
import { Event } from "../../structures/Events";

export default class IntCreate extends Event {
  constructor(client: Bot) {
    super(client, "interactionCreate");
  }

  public async run(
    interaction: Interaction<"cached"> | ChatInputCommandInteraction<"cached">
  ) {
    if (interaction.isCommand()) {
      const { commandName: name } = interaction;
      const cmd = new (this.client.commands.get(name).default)() as Command;

      for (const condition of cmd.options.conditions || []) {
        const imported = await import(`../conditions/${condition}.ts`);
        const conditionFunction = imported.default;
        const result = conditionFunction(interaction.user.id).catch(
          (err: any) => {
            if (err instanceof CustomError) {
              return Promise.reject(err);
            }
          }
        );

        try {
          await result;
        } catch (err: any) {
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setTitle("`❌`  |  Error")
                .setDescription(
                  `> \`❌\` **Error:** ${err.message}\n> **Descripción:** ${err.description}`
                )
                .setColor(this.client.colors.Error),
            ],
            ephemeral: true,
          });
        }
      }

      try {
        await this.client.checkPermissionsForUser({ interaction, cmd });
        await this.client.checkPermissionsForUser({ interaction, cmd });
      } catch (err: any) {
        if (err instanceof CustomError)
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setTitle("`❌`  |  Error")
                .setDescription(
                  `> \`❌\` **Error:** ${err.message}\n> **Descripción:** ${err.description}`
                )
                .setColor(this.client.colors.Error),
            ],
            ephemeral: true,
          });
      }

      if (interaction.isChatInputCommand() && interaction.inCachedGuild()) {
        cmd.run({ client: this.client, interaction }).catch((err: any) => {
          if (err instanceof CustomError)
            return interaction.reply({
              embeds: [
                new EmbedBuilder()
                  .setTitle("`❌`  |  Error")
                  .setDescription(
                    `> \`❌\` **Error:** ${err.message}\n> **Descripción:** ${err.description}`
                  )
                  .setColor(this.client.colors.Error),
              ],
              ephemeral: true,
            });
          else this.client.logger.warn(`[${this.name}] -> ${err.stack}`);
        });
      }
    }
  }
}
