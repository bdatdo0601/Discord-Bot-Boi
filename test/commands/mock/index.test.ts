import { expect } from "chai";
import {
  Client,
  Collection,
  Guild,
  Message,
  TextChannel,
  User,
} from "discord.js";
import dotenv from "dotenv";
import firebase from "firebase";
import mockCommandList, {
  mockCommandKeyList,
} from "../../../src/commands/mock";
dotenv.config();

// firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: `${process.env.FIREBASE_AUTH_DOMAIN}.firebaseapp.com`,
  databaseURL: `https://${process.env.FIREBASE_DB_NAME}.firebaseio.com`,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: `${process.env.FIREBASE_STORAGE_BUCKET}.appspot.com`,
};

describe("Mock Commands", () => {
  // firebase initialization
  const app = firebase.initializeApp(firebaseConfig, "MockCommandTestEnv");
  const FireDB = app.database();
  before(async () => {
    await FireDB.goOnline();
  });
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
        FireDB,
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
        FireDB,
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
        FireDB,
        input.content,
        (input as unknown) as Message,
      );
    });
  });
  after(async () => {
    await FireDB.goOffline();
    await app.delete();
  });
});
