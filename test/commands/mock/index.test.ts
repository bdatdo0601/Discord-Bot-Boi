import { expect } from "chai";
import {
  Client,
  Message,
  Collection,
  User,
  TextChannel,
  Guild
} from "discord.js";
import mockCommandList, {
  mockCommandKeyList
} from "../../../src/commands/mock";
import { stringify } from "querystring";

describe("Mock Commands", () => {
  describe("Mock Command", () => {
    const client: Client = new Client();
    before(() => {
      client.on("message", (message: Message) => {
        mockCommandList[mockCommandKeyList.MOCK](
          client,
          message.content,
          message
        );
      });
    });

    it("should send a mock version of command with user id attached", done => {
      const users = new Collection<string, User>();
      const newUser = new User(client, { id: 1 });
      newUser.lastMessage = new Message(
        new TextChannel(new Guild(client, { emojis: new Collection() }), {}),
        {
          content: "test yolo",
          author: newUser,
          embeds: [],
          attachments: new Collection()
        },
        client
      );
      users.set("foo", newUser);
      const input = {
        channel: {
          send: result => {
            expect(result).to.equal("<@1>: tEsT yOlO");
            done();
          }
        },
        mentions: {
          users
        }
      };
      client.emit("message", input);
    });
  });
  describe("sayMock Command", () => {
    const client: Client = new Client();
    before(() => {
      client.on("message", (message: Message) => {
        mockCommandList[mockCommandKeyList.SAY_MOCK](
          client,
          message.content,
          message
        );
      });
    });
    it("should send a mock version of the query", done => {
      const input = {
        content: "foo bar",
        channel: {
          send: result => {
            expect(result).to.equal("<@1>: fOo BaR");
            done();
          }
        },
        author: {
          id: 1
        }
      };
      client.emit("message", input);
    });
  });
});
