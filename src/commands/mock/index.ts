import { Client, Message, User } from "discord.js";
import { Command } from "../command.interface";
import MockCommandHelper from "./helper";
import { MockCommandKeyList } from "./mock.interace";

const sayMockCommand: Command = {
  commandCallback: (client: Client, query: string, message: Message) => {
    const mockSentence = MockCommandHelper.toMockSentence(query);
    message.channel.send(`<@${message.author.id}>: ${mockSentence}`);
  },
  commandName: "Say Mock",
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
  commandName: "Mock",
};

export const mockCommandKeyList: MockCommandKeyList = {
  MOCK: "~mock",
  SAY_MOCK: "~sayMock",
};

export default {
  [mockCommandKeyList.MOCK]: mockCommand.commandCallback,
  [mockCommandKeyList.SAY_MOCK]: sayMockCommand.commandCallback,
};
