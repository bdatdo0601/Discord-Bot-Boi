import debug from "debug";
import { Client, Message } from "discord.js";
import dotenv from "dotenv";
import { Wit } from "node-wit";
import { Command } from "../command.interface";
import commandList from "../index";
import helperWitAIFunctions from "./helper";
import { WitAICommandKeyList } from "./witai.interface";
dotenv.config();

const debugLog = debug("BotBoi:WitAI");

const { WIT_AI_CLIENT_ACCESS_TOKEN } = process.env as {
  WIT_AI_CLIENT_ACCESS_TOKEN: string;
};

const CONFIDENCE_RATE = 0.7;

const witClient = new Wit({
  accessToken: WIT_AI_CLIENT_ACCESS_TOKEN,
});
const evalCommand: Command = {
  commandCallback: async (
    client: Client,
    db: firebase.database.Database,
    query: string,
    message: Message,
  ): Promise<void> => {
    const response = await witClient.message(query, {});
    for (const entityKey of Object.keys(response.entities)) {
      const value = response.entities[entityKey].value;
      if (entityKey.includes("_")) {
        const command = entityKey.replace("_", "~");
        await commandList[command].commandCallback(client, db, value, message);
      } else {
        if (helperWitAIFunctions[entityKey]) {
          const messageToSend = await helperWitAIFunctions[entityKey](message);
          await message.channel.send(messageToSend);
        }
      }
    }
  },
  commandDescription: "Evaluate based on user natural response",
};

export const witAICommandKeyList: WitAICommandKeyList = {
  EVAL: "~EVAL",
};

export default {
  [witAICommandKeyList.EVAL]: evalCommand,
};
