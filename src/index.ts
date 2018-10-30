import { Client } from "discord.js";
// https://discordapp.com/oauth2/authorize?client_id=482244091518779402&scope=bot&permissions=8

import debug from "debug";
import dotenv from "dotenv";
import firebase from "firebase";
import botEventList from "./events";
import { Event } from "./events/event.interface";
import { getMockImage } from "./lib/api/spongeBobMock";
import { getBaseStore } from "./lib/db/firebase";

dotenv.config();
const debugLog = debug("BotBoi:Main");
const TOKEN: string = process.env.BOT_TOKEN as string;

// firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: `${process.env.FIREBASE_AUTH_DOMAIN}.firebaseapp.com`,
  databaseURL: `https://${process.env.FIREBASE_DB_NAME}.firebaseio.com`,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: `${process.env.FIREBASE_STORAGE_BUCKET}.appspot.com`,
};

// firebase initialization
firebase.initializeApp(firebaseConfig);

const main = async (token: string): Promise<Client> => {
  debugLog("Initializing Bot Boi");
  const db = firebase.database();
  await getBaseStore(db);
  const client: Client = new Client();
  botEventList.forEach((event: Event) => {
    client.on(event.eventName, event.eventActionCallback(client, db));
  });
  await client.login(token);
  return client;
};

main(TOKEN).catch((error: Error) => {
  debugLog(error);
  process.exit(1);
});
