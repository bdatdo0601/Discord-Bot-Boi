import { Client } from "discord.js";

export interface Event {
  eventName: string;
  eventActionCallback: (
    client: Client,
    db: firebase.database.Database,
  ) => (...args: any[]) => Promise<void>;
}
