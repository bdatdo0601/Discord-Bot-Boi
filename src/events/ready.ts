import { Event } from "./event.interface";
import { Client } from "discord.js";

import commandList, { COMMANDS } from "../commands";

const debug = require("debug")("BotBoi:onReadyEvent");

const ready: Event = {
    eventName: "ready",
    eventActionCallback: (client: Client) => async (): Promise<void> => {
        debug("Ready Event triggered");
        console.log("Me Me Ready");
        // recurring
        setInterval(() => commandList[COMMANDS.RULE34](client), 60000 * 15);
    },
};

export default ready;
