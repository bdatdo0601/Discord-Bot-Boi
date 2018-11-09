import DialogFlow from "@dialogflow";
import { Client } from "discord.js";
import firebase from "firebase-admin";
import { JWT } from "google-auth-library";

export interface EventContext {
  client: Client;
  db: firebase.database.Database;
  googleAPIJWTClient: JWT;
  dialogFlow: DialogFlow;
}

export interface Event {
  eventName: string;
  eventActionCallback: (
    context: EventContext,
  ) => (...args: any[]) => Promise<void>;
}
