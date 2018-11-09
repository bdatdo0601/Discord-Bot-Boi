import { expect } from "chai";
import {
  Client,
  ClientUser,
  Collection,
  Guild,
  Message,
  TextChannel,
  User,
} from "discord.js";
import firebase, { ServiceAccount } from "firebase-admin";
import mockCommandList, {
  mockCommandKeyList,
} from "../../../src/commands/mock";
import { FIREBASE_CONFIG, GOOGLE_CONFIG } from "../../../src/config";
import { EventContext } from "../../../src/events/event.interface";

describe("Mock Commands", () => {
  // firebase initialization
  const app = firebase.initializeApp(
    {
      credential: firebase.credential.cert(GOOGLE_CONFIG as ServiceAccount),
      databaseURL: FIREBASE_CONFIG.databaseURL,
    },
    "MockCommandTestEnv",
  );
  const FireDB = app.database();

  before(async () => {
    await FireDB.goOnline();
  });
  describe("Mock Command", () => {
    const client: Client = new Client();
    client.user = new User(client, { id: 1 }) as ClientUser;
    it("should send a mock message based on mentioned user last message", async () => {
      const response: string[] = [];
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
      const newUser2 = new User(client, { id: 2 });
      newUser.lastMessage = new Message(
        new TextChannel(new Guild(client, { emojis: new Collection() }), {}),
        {
          attachments: new Collection(),
          author: newUser,
          content: "test yolo 2",
          embeds: [],
        },
        client,
      );
      newUser2.lastMessage = newUser.lastMessage;
      users.set("foo", newUser);
      users.set("bar", newUser2);
      const input = {
        author: {
          id: 1,
        },
        channel: {
          send: (result) => {
            response.push(result);
          },
        },
        mentions: {
          users,
        },
      };
      await mockCommandList[mockCommandKeyList.MOCK].commandCallback(
        ({
          client,
          db: FireDB,
        } as unknown) as EventContext,
        (input as unknown) as Message,
      );
      expect(response.length).to.be.greaterThan(0);
    });
    it("should send a warning message if mentions user does not have last message", async () => {
      const users = new Collection<string, User>();
      const newUser = new User(client, { id: 10 });
      users.set("foo", newUser);
      const input = {
        channel: {
          send: (result) => {
            expect(result).to.equal(
              "I don't see any previous message of <@10>",
            );
          },
        },
        mentions: {
          users,
        },
      };
      await mockCommandList[mockCommandKeyList.MOCK].commandCallback(
        ({
          client,
          db: FireDB,
        } as unknown) as EventContext,
        (input as unknown) as Message,
      );
    });
    it("should do nothing if an error occur", async () => {
      mockCommandList[mockCommandKeyList.MOCK].commandCallback(
        ({
          client,
          db: FireDB,
        } as unknown) as EventContext,
        ({} as unknown) as Message,
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
        ({
          client,
          db: FireDB,
        } as unknown) as EventContext,
        (input as unknown) as Message,
        input.content,
      );
    });
  });
  after(async () => {
    await FireDB.goOffline();
    await app.delete();
  });
});
