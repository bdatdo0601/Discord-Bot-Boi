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
      const mockSentence = MockCommandHelper.toMockSentence(query);
      const attachment = new Attachment(
        await getMockImage(mockSentence),
        "mocking.jpg",
      );
      await message.channel.send(
        MOCK_RESPONSE.MOCKING(message.author.id, mockSentence),
        attachment,
      );
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
        } else if (user.lastMessage) {
          const mockMessage = MockCommandHelper.toMockSentence(
            user.lastMessage.cleanContent,
          );
          const imageData = await getMockImage(mockMessage);
          const attachment = new Attachment(imageData, "mocking.jpg");
          await message.channel.send(
            MOCK_RESPONSE.MOCKING(user.id, mockMessage),
            attachment,
          );
        } else {
          await message.channel.send(
            MOCK_RESPONSE.PREV_MESSAGE_NOT_FOUND(user.id),
          );
        }
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
