import debug from "debug";
import { Event } from "../event.interface";

import { createNewCalendar } from "@lib/api/googleapis/calendar";
import commandList, { COMMANDS } from "../../commands";
import { getBaseStore, initGuildStore } from "../../lib/db/firebase";

export const RULE34_INTERVAL = 60000 * 15;

const debugLog = debug("BotBoi:onReadyEvent");

const readyEvent: Event = {
  eventActionCallback: (context) => async (): Promise<void> => {
    debugLog("Ready Event triggered");
    try {
      const { client, db, googleAPIJWTClient } = context;
      // get base guild or init if it does not exist
      const baseStore = await getBaseStore(db);
      // add guild to baseStore if guild does not exist
      await client.guilds.array().forEach(
        async (guild): Promise<void> => {
          if (!baseStore.guilds[guild.id]) {
            await initGuildStore(guild.id, db);
          }
        },
      );
      // recurring
      client.setInterval(() => {
        debugLog("Search Recurring Occured");
        commandList[COMMANDS.RULE34.RULE34_SEARCH_RECURRING].commandCallback(
          context,
        );
      }, RULE34_INTERVAL);
    } catch (err) {
      throw err;
    }
    debugLog("Me Me Ready");
  },
  eventName: "ready",
};

export default readyEvent;
