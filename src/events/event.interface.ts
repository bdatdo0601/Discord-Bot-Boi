import { Client } from "discord.js";
import firebase from "firebase";

export interface Context {
  client: Client;
  db: firebase.database.Database;
}

export interface Event {
  eventName: string;
  eventActionCallback: (context: Context) => (...args: any[]) => Promise<void>;
}
