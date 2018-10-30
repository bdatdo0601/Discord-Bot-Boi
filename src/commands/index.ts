import debug from "debug";
import { Client, Message } from "discord.js";
import _ from "lodash";
import { Command } from "./command.interface";
import mockCommandList, { mockCommandKeyList } from "./mock";
import readyToPlayCommandList, {
  readyToPlayCommandKeyList,
} from "./readytoplay";
import rule34CommandList, { rule34CommandKeyList } from "./rule34";
import witAICommandList, { witAICommandKeyList } from "./witai";

const debugLog = debug("BotBoi:Commands");

const generalCommandKeyList = {
  LIST_COMMAND: "~help",
};

const getCommandsCommand: Command = {
  commandCallback: async (
    client: Client,
    db: firebase.database.Database,
    query: string,
    message: Message,
  ) => {
    const response: string[] = [];
    for (const commandType of Object.keys(COMMANDS)) {
      response.push(`**${_.capitalize(commandType)}**`);
      for (const command of Object.keys(COMMANDS[commandType])) {
        response.push(
          ` \`${COMMANDS[commandType][command]}\`:   ${
            commandList[COMMANDS[commandType][command]].commandDescription
          }`,
        );
      }
    }
    await message.channel.send(response.join("\n"));
  },
  commandDescription: "list all command",
};

const generalCommandList = {
  [generalCommandKeyList.LIST_COMMAND]: getCommandsCommand,
};

export const COMMANDS = {
  GENERAL: generalCommandKeyList,
  MOCK: mockCommandKeyList,
  READY_TO_PLAY: readyToPlayCommandKeyList,
  RULE34: rule34CommandKeyList,
  WIT_AI: witAICommandKeyList,
};

const commandList = {
  ...generalCommandList,
  ...mockCommandList,
  ...rule34CommandList,
  ...witAICommandList,
  ...readyToPlayCommandList,
};

export default commandList;
