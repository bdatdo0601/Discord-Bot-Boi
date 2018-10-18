import { Event } from "./event.interface";
import { Message, Client } from "discord.js";

import commandList from "../commands";

const debug = require("debug")("BotBoi:onMessageEvent");

const message: Event = {
    eventName: "message",
    eventActionCallback: (client: Client) => async (message: Message) => {
        if (message.content[0] === "~") {
            const [command, ...rest] = message.content.split(" ");
            const query: string = rest.join(" ");
            if (commandList[command]) {
                commandList[command](client, query, message);
            }
        }
    },
};

export default message;
