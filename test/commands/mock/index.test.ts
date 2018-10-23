import { expect } from "chai";
import {
  Client,
  Collection,
  Guild,
  Message,
  TextChannel,
  User,
} from "discord.js";
import mockCommandList, {
  mockCommandKeyList,
} from "../../../src/commands/mock";

describe("Mock Commands", () => {
  describe("Mock Command", () => {
    const client: Client = new Client();

    it("should send a mock message based on mentioned user last message", (done) => {
      const users = new Collection<string, User>();
      const newUser = new User(client, { id: 1 });
      newUser.lastMessage = new Message(
        new TextChannel(new Guild(client, { emojis: new Collection() }), {}),
        {
          attachments: new Collection(),
          author: newUser,
          content: "test yolo",
          embeds: [],
        },
        client,
      );
      users.set("foo", newUser);
      const input = {
        channel: {
          send: (result) => {
            expect(result).to.equal("<@1>: tEsT yOlO");
            done();
          },
        },
        mentions: {
          users,
        },
      };
      mockCommandList[mockCommandKeyList.MOCK].commandCallback(
        client,
        "",
        input as Message,
      );
    });
    it("should send a warning message if mentions user does not have last message", (done) => {
      const users = new Collection<string, User>();
      const newUser = new User(client, { id: 1 });
      users.set("foo", newUser);
      const input = {
        channel: {
          send: (result) => {
            expect(result).to.equal("I don't see any previous message of <@1>");
            done();
          },
        },
        mentions: {
          users,
        },
      };
      mockCommandList[mockCommandKeyList.MOCK].commandCallback(
        client,
        "",
        input as Message,
      );
    });
  });
  describe("sayMock Command", () => {
    const client: Client = new Client();
    it("should send a mock version of the query", (done) => {
      const input = {
        author: {
          id: 1,
        },
        channel: {
          send: (result) => {
            expect(result).to.equal("<@1>: fOo BaR");
            done();
          },
        },
        content: "foo bar",
      };
      mockCommandList[mockCommandKeyList.SAY_MOCK].commandCallback(
        client,
        input.content,
        (input as unknown) as Message,
      );
    });
  });
});
