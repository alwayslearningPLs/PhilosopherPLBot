import { ClientEvents } from "discord.js";
import { Bot } from "./Client";

export abstract class Event {
  constructor(
    public client: Bot,
    public name: keyof ClientEvents,
    public once: boolean = false
  ) {}
  public abstract run(...args: any[]): any;
}
