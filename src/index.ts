import { Client } from "discord.js";
// https://discordapp.com/oauth2/authorize?client_id=482244091518779402&scope=bot&permissions=8

import debug from "debug";
import dotenv from "dotenv";
import botEventList from "./events";
import { Event } from "./events/event.interface";
import MyJSONAPI from "./lib/api/myJson";

dotenv.config();
const debugLog = debug("BotBoi:Main");
const TOKEN: string = process.env.BOT_TOKEN as string;

const main = async (token: string): Promise<Client> => {
  debug("Initializing Bot Boi");
  await MyJSONAPI.getBaseStore();
  const client: Client = new Client();
  botEventList.forEach((event: Event) => {
    client.on(event.eventName, event.eventActionCallback(client));
  });
  await client.login(token);
  return client;
};

main(TOKEN).catch((error: Error) => {
  debugLog(error);
});
