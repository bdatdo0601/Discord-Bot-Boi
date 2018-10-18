import { Client } from "discord.js";

export interface Event {
    eventName: string;
    eventActionCallback: (client: Client) => (...args: any[]) => Promise<void>;
}
