import { Event } from "../event.interface";
import { Client } from "discord.js";
import lolex, { Clock } from "lolex";

import commandList, { COMMANDS } from "../../commands";
import MyJSONAPI from "../../lib/api/myJson";

export const RULE34_INTERVAL = 60000 * 15;

const debug = require("debug")("BotBoi:onReadyEvent");

export const setUpMockClock = () => {
  const clock = lolex.install();
  return clock;
};

export const tearDownMockClock = (clock: Clock) => {
  clock.uninstall();
};

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
    client.setInterval(() => {
      commandList[COMMANDS.RULE34.RULE34_SEARCH](client);
    }, RULE34_INTERVAL);
    debug("Me Me Ready");
  }
};

export default ready;
