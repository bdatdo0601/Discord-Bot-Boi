import { Client, Message } from "discord.js";

export interface Command {
  commandName: string;
  commandCallback: (
    client: Client,
    query?: string,
    message?: Message,
  ) => void | Promise<void>;
}
