import debug from "debug";
import { Client } from "discord.js";
import { Event } from "../event.interface";

import commandList, { COMMANDS } from "../../commands";
import { getBaseStore, initGuildStore } from "../../lib/db/firebase";

export const RULE34_INTERVAL = 60000 * 15;

const debugLog = debug("BotBoi:onReadyEvent");

const readyEvent: Event = {
  eventActionCallback: (
    client: Client,
    db: firebase.database.Database,
  ) => async (): Promise<void> => {
    debugLog("Ready Event triggered");
    // get base guild or init if it does not exist
    const baseStore = await getBaseStore(db);
    // add guild to baseStore if guild does not exist
    await client.guilds.array().forEach(
      async (guild): Promise<void> => {
        if (guild.id && !baseStore.guilds[guild.id]) {
          await initGuildStore(guild.id, db);
        }
      },
    );
    // recurring
    client.setInterval(() => {
      debugLog("Search Recurring Occured");
      commandList[COMMANDS.RULE34.RULE34_SEARCH_RECURRING].commandCallback(
        client,
        db,
      );
    }, RULE34_INTERVAL);
    debugLog("Me Me Ready");
  },
  eventName: "ready",
};

export default readyEvent;
