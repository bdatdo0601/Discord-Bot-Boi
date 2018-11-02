/**
 * src/index.ts
 *
 * Entry point of application, handle initializing global context
 */

import { Client } from "discord.js";
// https://discordapp.com/oauth2/authorize?client_id=482244091518779402&scope=bot&permissions=8

import { DISCORD_CONFIG, FIREBASE_CONFIG } from "@config";
import botEventList from "@events";
import { getBaseStore } from "@lib/db/firebase";
import debug from "debug";
import firebase from "firebase";

// debug logger
const debugLog = debug("BotBoi:Main");

/**
 * function wrapper to start the application
 *
 * @param {string} token token acquired from discord developer app
 */
const main = async (token: string): Promise<Client> => {
  debugLog("Initializing Bot Boi");
  // firebase initialization
  firebase.initializeApp(FIREBASE_CONFIG);
  const db = firebase.database();
  await getBaseStore(db);
  // discord initialization
  const client: Client = new Client();
  // setup events
  botEventList.forEach((event) => {
    client.on(event.eventName, event.eventActionCallback({ client, db }));
  });
  // start the bot
  await client.login(token);
  debugLog("Bot Boi Initialized");
  return client;
};

main(DISCORD_CONFIG.BOT_TOKEN).catch((error: Error) => {
  debugLog(error);
  process.exit(1);
});
