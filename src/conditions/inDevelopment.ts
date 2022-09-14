import { configuration } from "../settings";
import CustomError from "../structures/Error";

export default function validDev(id: string) {
  if (!configuration.devs.includes(id))
    return Promise.reject(
      new CustomError({
        error: "Comando en desarrollo",
        description: "El comando que intentas usar está en desarrollo",
      })
    );
  return Promise.resolve();
}
