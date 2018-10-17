/// <reference path="../node_modules/discord.js/typings/index.d.ts" />
import { Client } from "discord.js";
// https://discordapp.com/oauth2/authorize?client_id=482244091518779402&scope=bot&permissions=8

import * as dotenv from "dotenv";
dotenv.config();

import { getLewlImages } from "./functionalities";
import requestCommand from "./command";

const client = new Client();
const token = process.env.BOT_TOKEN;

client.on("ready", async () => {
    console.log("Me Me Ready");
    client.guilds.array().forEach(guild => {
        // guild.channels
        //     .array()
        //     .find(channel => channel.type === "text")
        //     .send("Me Me Alive & Ready");
    });

    await getLewlImages(client);
    setInterval(() => getLewlImages(client), 60000 * 15);
});

client.on("error", error => {
    console.log("I'm ded");
    console.log(error);
});

client.on("message", message => {
    if (message.content[0] === "~") {
        const [command, ...rest] = message.content.split(" ");
        const query = rest.join(" ");
        if (requestCommand[command]) {
            requestCommand[command](message, query);
        }
    }
});

client.login(token);
