import { Interaction } from "discord.js";
import CustomError from "../structures/Error";

export default function isOwner(interaction: Interaction) {
  if (interaction.guild?.ownerId !== interaction.user.id)
    return Promise.reject(
      new CustomError({
        error: "Permisos insuficientes",
        description:
          "Para usar este comando necesitas ser el Owner del servidor",
      })
    );
  else return Promise.resolve();
}
