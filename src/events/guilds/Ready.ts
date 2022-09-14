import { Event } from "../../structures/Events";
import { Bot } from "../../structures/Client";

export default class Ready extends Event {
  constructor(client: Bot) {
    super(client, "ready");
  }

  async run() {
    this.client.logger.success(
      `Conectado con exito a: ${this.client.user?.username} (ID: ${this.client.user?.id}) | (Users: ${this.client.users.cache.size})`
    );
  }
}
