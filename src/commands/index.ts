import debug from "debug";
import { Message } from "discord.js";
import _ from "lodash";
import calendarCommandList, { calendarCommandKeyList } from "./calendar";
import { Command, CommandList } from "./command.interface";
import mockCommandList, { mockCommandKeyList } from "./mock";
import readyToPlayCommandList, { r2pCommandKeyList } from "./readytoplay";
import referendumCommandList, { referendumCommandKeyList } from "./referendum";
import rule34CommandList, { rule34CommandKeyList } from "./rule34";

const debugLog = debug("BotBoi:Commands");

const generalCommandKeyList = {
  LIST_COMMAND: "~help",
};

const getCommandsCommand: Command = {
  commandCallback: async (context, message: Message) => {
    try {
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
    } catch (err) {
      debugLog(err);
    }
  },
  commandDescription: "list all command",
};

const generalCommandList = {
  [generalCommandKeyList.LIST_COMMAND]: getCommandsCommand,
};

export const COMMANDS = {
  CALENDAR: calendarCommandKeyList,
  GENERAL: generalCommandKeyList,
  MOCK: mockCommandKeyList,
  READY_TO_PLAY: r2pCommandKeyList,
  REFERNDUM: referendumCommandKeyList,
  RULE34: rule34CommandKeyList,
};

const commandList: CommandList = {
  ...generalCommandList,
  ...mockCommandList,
  ...rule34CommandList,
  ...readyToPlayCommandList,
  ...referendumCommandList,
  ...calendarCommandList,
};

export default commandList;
