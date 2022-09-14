import { configuration } from "../settings";
import CustomError from "../structures/Error";

export default function validDev(id: string) {
  if (!configuration.devs.includes(id))
    return Promise.reject(
      new CustomError({
        error: "Dev command",
        description:
          "Este comando es solo para desarrolladores, no estas autorizado a usarlo.",
      })
    );
  return Promise.resolve();
}
