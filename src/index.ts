/**
 * src/index.ts
 *
 * Entry point of application, handle initializing global context
 */

import { Client } from "discord.js";
// https://discordapp.com/oauth2/authorize?client_id=482244091518779402&scope=bot&permissions=8

import { DISCORD_CONFIG, FIREBASE_CONFIG, GOOGLE_CONFIG } from "@config";
import botEventList from "@events";
import { initGoogleAPIS } from "@lib/api/googleapis";
import { getBaseStore } from "@lib/db/firebase";
import debug from "debug";
import firebase, { ServiceAccount } from "firebase-admin";
import { JWT } from "google-auth-library";

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
  firebase.initializeApp({
    credential: firebase.credential.cert(GOOGLE_CONFIG as ServiceAccount),
    databaseURL: FIREBASE_CONFIG.databaseURL,
  });
  // googleapi initialization
  const googleAPIJWTClient = (await initGoogleAPIS()) as JWT;
  const db = firebase.database();
  await getBaseStore(db);
  // discord initialization
  const client: Client = new Client();
  // setup events
  botEventList.forEach((event) => {
    client.on(
      event.eventName,
      event.eventActionCallback({ client, db, googleAPIJWTClient }),
    );
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
