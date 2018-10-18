import { Event } from "../typings/interfaces/event";
import { Client } from "discord.js";

const debug = require("debug")("BotBoi:onErrorEvent");

const error: Event = {
    eventName: "error",
    eventActionCallback: (client: Client) => async (error: Error) => {
        console.log("Sum ting wong! I'm ded");
        console.error(error.message);
        debug(error);
    },
};

export default error;
