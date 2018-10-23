import { Client, Message, User } from "discord.js";
import { Command } from "../command.interface";
import MockCommandHelper from "./helper";
import { MockCommandKeyList } from "./mock.interace";

const sayMockCommand: Command = {
  commandCallback: (client: Client, query: string, message: Message) => {
    const mockSentence = MockCommandHelper.toMockSentence(query);
    message.channel.send(`<@${message.author.id}>: ${mockSentence}`);
  },
  commandDescription: "Say Mock",
};

const mockCommand: Command = {
  commandCallback: (client: Client, query: string, message: Message) => {
    message.mentions.users.array().forEach((user: User) => {
      if (user.lastMessage) {
        const mockMessage = MockCommandHelper.toMockSentence(
          user.lastMessage.cleanContent,
        );
        message.channel.send(`<@${user.id}>: ${mockMessage}`);
      } else {
        message.channel.send(
          `I don't see any previous message of <@${user.id}>`,
        );
      }
    });
  },
  commandDescription: "Mock",
};

export const mockCommandKeyList: MockCommandKeyList = {
  MOCK: "~mock",
  SAY_MOCK: "~sayMock",
};

export default {
  [mockCommandKeyList.MOCK]: mockCommand,
  [mockCommandKeyList.SAY_MOCK]: sayMockCommand,
};
