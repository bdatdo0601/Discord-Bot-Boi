import { EventContext } from "@events/event.interface";
import { Client, Message } from "discord.js";

export interface Command {
  commandDescription: string;
  commandCallback: (
    context: EventContext,
    message?: Message,
    query?: string,
  ) => Promise<void>;
}

export interface CommandResponse {
  [key: string]: (...args: string[]) => string;
}

export interface CommandList {
  [key: string]: Command;
}
