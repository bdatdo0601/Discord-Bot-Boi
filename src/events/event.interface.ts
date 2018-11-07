import { Client } from "discord.js";
import firebase from "firebase-admin";
import { JWT } from "google-auth-library";

export interface Context {
  client: Client;
  db: firebase.database.Database;
  googleAPIJWTClient: JWT;
}

export interface Event {
  eventName: string;
  eventActionCallback: (context: Context) => (...args: any[]) => Promise<void>;
}
