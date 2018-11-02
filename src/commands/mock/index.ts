import { getMockImage } from "@lib/api/spongeBobMock";
import debug from "debug";
import { Attachment, Message } from "discord.js";
import { Command, CommandList } from "../command.interface";
import MockCommandHelper from "./helper";
import { MockCommandKeyList } from "./mock.interace";
import MOCK_RESPONSE from "./response";

const debugLog = debug("BotBoi:MockCommands");

const sayMockCommand: Command = {
  commandCallback: async (context, message: Message, query: string) => {
    try {
      const mockResponse = await MockCommandHelper.getMockResponse(
        message.author.id,
        MockCommandHelper.toMockSentence(query),
      );
      await message.channel.send(mockResponse.message, mockResponse.attachment);
    } catch (err) {
      debugLog(err);
    }
  },
  commandDescription: "create a mocking version of what author said",
};

const mockCommand: Command = {
  commandCallback: async (context, message: Message) => {
    try {
      const { client } = context;
      for (const user of message.mentions.users.array()) {
        if (client.user.id === user.id) {
          await message.channel.send(
            MOCK_RESPONSE.ATTACK_AUTHOR(message.author.id),
          );
          continue;
        }
        if (!user.lastMessage) {
          await message.channel.send(
            MOCK_RESPONSE.PREV_MESSAGE_NOT_FOUND(user.id),
          );
          continue;
        }
        await sayMockCommand.commandCallback(
          context,
          message,
          user.lastMessage.cleanContent,
        );
      }
    } catch (err) {
      debugLog(err);
    }
  },
  commandDescription: "mock mentioned users",
};

export const mockCommandKeyList: MockCommandKeyList = {
  MOCK: "~mock",
  SAY_MOCK: "~sayMock",
};

export default {
  [mockCommandKeyList.MOCK]: mockCommand,
  [mockCommandKeyList.SAY_MOCK]: sayMockCommand,
} as CommandList;
