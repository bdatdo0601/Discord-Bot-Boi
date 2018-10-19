import { Event } from "../event.interface";
import { Client } from "discord.js";

import commandList, { COMMANDS } from "../../commands";
import MyJSONAPI from "../../lib/api/myJson";

const debug = require("debug")("BotBoi:onReadyEvent");

const ready: Event = {
  eventName: "ready",
  eventActionCallback: (client: Client) => async (): Promise<void> => {
    debug("Ready Event triggered");
    // add guild to baseStore if guild does not exist
    await client.guilds.array().forEach(
      async (guild): Promise<void> => {
        await MyJSONAPI.getGuildBaseJSONStore(guild.id);
      }
    );
    // recurring
    setInterval(() => commandList[COMMANDS.RULE34](client), 60000 * 15);
    debug("Me Me Ready");
  }
};

export default ready;
