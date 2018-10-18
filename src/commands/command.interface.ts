import { Client, Message } from "discord.js";

export interface Command {
    commandCallback: (client: Client, query?: string, message?: Message) => void | Promise<void>;
}
