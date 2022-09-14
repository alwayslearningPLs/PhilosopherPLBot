import { Bot } from "./src/structures/Client";

const client = new Bot();
client.start();

(() => {
  /** Errors: */

  process.on("unhandledRejection", (error: any) => {
    client.logger.error(error.stack);
  });
  process.on("uncaughtException", (error: any) => {
    client.logger.error(error.stack);
  });
})();
