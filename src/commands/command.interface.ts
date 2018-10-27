import { Client, Message } from "discord.js";

export interface Command {
  commandDescription: string;
  commandCallback: (
    client: Client,
    db: firebase.database.Database,
    query?: string,
    message?: Message,
  ) => void | Promise<void>;
}
