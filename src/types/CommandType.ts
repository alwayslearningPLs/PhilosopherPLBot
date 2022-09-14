import {
  ChatInputCommandInteraction,
  PermissionFlags,
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";
import { Bot } from "../structures/Client";
import {
  categories,
  cooldownSuggest,
  Conditions,
} from "./InternalCommandTypes";

interface CommandType {
  userPerms: Array<keyof PermissionFlags>;
  clientPerms: Array<keyof PermissionFlags>;
  category: categories;
  cooldown?: cooldownSuggest;
  data:
    | SlashCommandSubcommandsOnlyBuilder
    | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
  conditions?: Array<Conditions>;

  run({
    client,
    interaction,
  }: {
    client: Bot;
    interaction: ChatInputCommandInteraction<"cached">;
  }): Promise<void>;
}

export default CommandType;
