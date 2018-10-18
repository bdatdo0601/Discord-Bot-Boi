/// <reference path="../node_modules/discord.js/typings/index.d.ts" />
import { Client } from "discord.js";
// https://discordapp.com/oauth2/authorize?client_id=482244091518779402&scope=bot&permissions=8

import dotenv from "dotenv";
import { Event } from "./events/event.interface";
import botEventList from "./events";

dotenv.config();
const debug = require("debug")("BotBoi:Main");
const TOKEN: string = <string>process.env.BOT_TOKEN;

const main = async (token: string): Promise<Client> => {
    debug("Initializing Bot Boi");
    const client: Client = new Client();
    botEventList.forEach((event: Event) => {
        client.on(event.eventName, event.eventActionCallback(client));
    });
    await client.login(token);
    return client;
};

main(TOKEN).catch(error => {
    debug(error);
});