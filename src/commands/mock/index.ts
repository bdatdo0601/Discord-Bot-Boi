import { Client, Message, User } from "discord.js";
import _ from "lodash";
import { Command } from "../command.interface";
import { MockCommandKeyList } from "./mock.interace";

const toMockSentence = (sentence: string): string => {
  const response: string[] = sentence.split("");
  let lowerCaseToggle = true;
  const mockSentence: string | undefined = _.reduce(
    response,
    (result: string, currentChar: string) => {
      if (!currentChar.match(/[A-Za-z]/)) {
        return result + currentChar;
      }
      if (lowerCaseToggle) {
        lowerCaseToggle = !lowerCaseToggle;
        return result + currentChar.toLocaleLowerCase();
      } else {
        lowerCaseToggle = !lowerCaseToggle;
        return result + currentChar.toLocaleUpperCase();
      }
    },
    ""
  );
  return mockSentence ? mockSentence : "";
};

const sayMockCommand: Command = {
  commandName: "Say Mock",
  commandCallback: (client: Client, query: string, message: Message) => {
    const mockSentence = toMockSentence(query);
    message.channel.send(`<@${message.author.id}>: ${mockSentence}`);
  }
};

const mockCommand: Command = {
  commandName: "Mock",
  commandCallback: (client: Client, query: string, message: Message) => {
    message.mentions.users.array().forEach((user: User) => {
      if (user.lastMessage) {
        const mockMessage = toMockSentence(user.lastMessage.cleanContent);
        message.channel.send(`<@${user.id}>: ${mockMessage}`);
      }
    });
  }
};

export const mockCommandKeyList: MockCommandKeyList = {
  MOCK: "~mock",
  SAY_MOCK: "~sayMock"
};

export default {
  [mockCommandKeyList.MOCK]: mockCommand.commandCallback,
  [mockCommandKeyList.SAY_MOCK]: sayMockCommand.commandCallback
};
