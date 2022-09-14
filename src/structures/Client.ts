import {
  ActivityType,
  Client,
  Collection,
  Interaction,
  User,
  GatewayIntentBits,
  Partials,
} from "discord.js";
import { Token, configuration, Colors } from "../settings";
import Logger from "./ConsoleColors";
import Database from "./Database";
import { readdirSync } from "fs";
import { Command } from "./Command";
import CustomError from "./Error";

export class Bot extends Client {
  owner: User | null;
  token = Token;
  commands: Collection<string, any> = new Collection();
  colors: typeof Colors = Colors;
  logger = new Logger();
  database: any;

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildPresences,
      ],
      failIfNotExists: false,
      partials: [Partials.Channel, Partials.GuildMember, Partials.User],
      allowedMentions: {
        parse: ["everyone", "roles", "users"],
      },
      sweepers: {
        messages: { interval: 60000, lifetime: 60000 },
      },
      presence: {
        status: "online",
        activities: [
          {
            name: "📚 |  Filosofeando...",
            type: ActivityType.Watching,
          },
        ],
      },
      ws: {
        properties: {
          browser: "Discord Android",
        },
      },
    });
    this.colors = Colors;
    this.database = new Database(configuration.mongoData.uri);
    this.owner = this.application?.owner as User;
  }

  public async start() {
    await this.runCommands();
    await this.runEvents();

    this.database
      .init()
      .then(() => this.logger.success("Conectado a la base de datos"))
      .catch((_: any) =>
        this.logger.warn(`Error al conectar a la base de datos`)
      );
    super.login(this.token);
  }

  private async runCommands(): Promise<void> {
    const cmd: Array<any> = [];
    readdirSync("./src/commands").forEach(async (dir) => {
      const commands = readdirSync(`./src/commands/${dir}`).filter((file) =>
        file.endsWith(".ts")
      );
      for (const file of commands) {
        const command = await import(`../commands/${dir}/${file}`);
        const commandInstance = new command.default(this);

        if (commandInstance.options.data.name !== undefined) {
          this.commands.set(commandInstance.options.data.name, command);
          cmd.push(JSON.parse(JSON.stringify(commandInstance.options.data)));
          this.logger.info(
            `Comando ${commandInstance.options.data.name} cargado con exito`
          );
        } else {
          this.logger.error(
            `El comando ${commandInstance.options.data.name} no se pudo cargar`
          );
        }
      }
    });

    this.on("ready", () => {
      if (configuration.testing === true)
        this.guilds.cache.get(configuration.serverID)?.commands.set(cmd);
      else this.application?.commands.set(cmd);
    });
  }

  private async runEvents(): Promise<void> {
    readdirSync("./src/events").forEach(async (dir) => {
      const events = readdirSync(`./src/events/${dir}`).filter((file) =>
        file.endsWith(".ts")
      );
      for (const file of events) {
        const event = await import(`../events/${dir}/${file}`);
        const eventInstance = new event.default(this);
        if (event.once)
          this.once(eventInstance.name, (...args: any[]) =>
            eventInstance.run(...args)
          );
        else
          this.on(eventInstance.name, (...args: any[]) =>
            eventInstance.run(...args)
          );
      }
    });
  }

  public handleError({
    error,
    description,
  }: {
    error: string;
    description: string;
  }) {
    return Promise.reject(new CustomError({ error, description }));
  }

  public async checkPermissionsForUser({
    interaction,
    cmd,
  }: {
    interaction: Interaction<"cached">;
    cmd: any;
  }) {
    const command: Command = cmd;
    if (interaction.member.permissions.has(command.options.userPerms))
      return Promise.resolve();
    else
      return Promise.reject(
        new CustomError({
          error: "Permisos insuficientes",
          description: `Requieres de los siguientes permisos: \`${command.options.userPerms
            .filter((perm) => interaction.member.permissions.missing(perm))
            .join(", ")}\``,
        })
      );
  }

  public async checkPermissionsForMe({
    interaction,
    cmd,
  }: {
    interaction: Interaction<"cached">;
    cmd: any;
  }) {
    const command: Command = cmd;
    if (
      interaction.guild.members.me?.permissions.has(command.options.clientPerms)
    )
      return Promise.resolve();
    else
      return Promise.reject(
        new CustomError({
          error: "Missing Permissions",
          description: `Requiero de los siguientes permisos: \`${command.options.clientPerms
            .filter((perm) =>
              interaction.guild.members.me?.permissions.missing(perm)
            )
            .join(", ")}\``,
        })
      );
  }
}
