import { Attachment, Client, Message, User } from "discord.js";
import firebase from "firebase";
import { Stream } from "stream";
import { getMockImage } from "../../lib/api/spongeBobMock";
import { Command } from "../command.interface";
import MockCommandHelper from "./helper";
import { MockCommandKeyList } from "./mock.interace";

const sayMockCommand: Command = {
  commandCallback: async (
    client: Client,
    db: firebase.database.Database,
    query: string,
    message: Message,
  ) => {
    const mockSentence = MockCommandHelper.toMockSentence(query);
    const attachment = new Attachment(
      await getMockImage(mockSentence),
      "mocking.jpg",
    );
    message.channel.send(
      `<@${message.author.id}>: ${mockSentence}`,
      attachment,
    );
  },
  commandDescription: "create a mocking version of what author said",
};

const mockCommand: Command = {
  commandCallback: async (
    client: Client,
    db: firebase.database.Database,
    query: string,
    message: Message,
  ) => {
    message.mentions.users.array().forEach((user: User) => {
      if (client.user.id === user.id) {
        message.channel.send(
          `<@${message.author.id}> ${MockCommandHelper.toMockSentence(
            message.author.lastMessage
              ? message.author.lastMessage.cleanContent
              : "Cuck yourself",
          )}`,
        );
      } else if (user.lastMessage) {
        const mockMessage = MockCommandHelper.toMockSentence(
          user.lastMessage.cleanContent,
        );
        getMockImage(mockMessage).then((data) => {
          const attachment = new Attachment(data, "mocking.jpg");
          message.channel.send(`<@${user.id}>: ${mockMessage}`, attachment);
        });
      } else {
        message.channel.send(
          `I don't see any previous message of <@${user.id}>`,
        );
      }
    });
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
};
