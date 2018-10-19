import { Event } from "../event.interface";
import { Client } from "discord.js";

import commandList, { COMMANDS } from "../../commands";
import MyJSONAPI from "../../lib/api/myJson";
import {
  Rule34Keyword,
  GuildBaseJSONStoreInput
} from "src/lib/api/myJson/myJson.interface";
import rule34xxxKeywords from "../../res/rule34Keywords.json";

const debug = require("debug")("BotBoi:onReadyEvent");

const rule34Keywords: Rule34Keyword[] = rule34xxxKeywords.map<Rule34Keyword>(
  item => ({
    source: "rule34xxx",
    word: item
  })
);

const ready: Event = {
  eventName: "ready",
  eventActionCallback: (client: Client) => async (): Promise<void> => {
    debug("Ready Event triggered");
    // add guild to baseStore if guild does not exist
    await client.guilds.array().forEach(
      async (guild): Promise<void> => {
        const input: GuildBaseJSONStoreInput = {
          rule34Keywords: rule34Keywords
        };
        await MyJSONAPI.updateGuildBaseJSONStore(guild.id, input);
      }
    );
    // recurring
    setInterval(() => commandList[COMMANDS.RULE34](client), 60000 * 15);
    console.log("Me Me Ready");
  }
};

export default ready;
