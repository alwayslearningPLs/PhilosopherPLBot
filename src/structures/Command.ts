import CommandType from "../types/CommandType";
import { Bot } from "./Client";
import { ChatInputCommandInteraction } from "discord.js";

export class Command {
  constructor(options: CommandType) {
    this.options = options;
    this.run = options.run;
  }
  options: CommandType;
  run: ({
    client,
    interaction,
  }: {
    client: Bot;
    interaction: ChatInputCommandInteraction<"cached">;
  }) => Promise<any>;
}
