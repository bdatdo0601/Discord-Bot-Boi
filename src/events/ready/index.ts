import debug from "debug";
import { Client, TextChannel } from "discord.js";
import dotenv from "dotenv";
import moment from "moment";
import { Event } from "../event.interface";
dotenv.config();

import commandList, { COMMANDS } from "../../commands";
import { getBaseStore, initGuildStore } from "../../lib/db/firebase";

export const RULE34_INTERVAL = 60000 * 15;

const {
  HEROKU_APP_NAME,
  HEROKU_RELEASE_VERSION,
  HEROKU_RELEASE_CREATED_AT,
} = process.env;

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
        const channelToSendIntroMessages = guild.channels
          .filter((channel) => channel.type === "text")
          .array()[0] as TextChannel;
        await channelToSendIntroMessages.send(
          `\n\nHello I am **${HEROKU_APP_NAME} ${HEROKU_RELEASE_VERSION}**! I was born on ${moment(
            HEROKU_RELEASE_CREATED_AT,
          ).format("dddd[,] Do MMMM YYYY")} \n\nBelow is what I can do\n\n`,
        );
        await commandList[COMMANDS.GENERAL.LIST_COMMAND].commandCallback(
          client,
          db,
          "",
          { channel: channelToSendIntroMessages },
        );
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
