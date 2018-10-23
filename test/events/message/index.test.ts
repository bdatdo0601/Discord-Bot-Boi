import { expect } from "chai";
import {
  Client,
  Collection,
  Guild,
  Message,
  TextChannel,
  User,
} from "discord.js";
import messageEvent from "../../../src/events/message";

describe("Message Event", () => {
  let client: Client;
  beforeEach(() => {
    client = new Client();
  });
  it("should trigger when a message event arrive", (done) => {
    const testUser = new User(client, { id: 1, bot: false });
    const testMessage = new Message(
      new TextChannel(new Guild(client, { emojis: new Collection() }), {}),
      {
        attachments: new Collection(),
        author: testUser,
        content: "test yolo",
        embeds: [],
      },
      client,
    );
    client.on(messageEvent.eventName, (message) => {
      messageEvent.eventActionCallback(client)(message);
      done();
    });
    client.emit(messageEvent.eventName, testMessage);
  });
  it("should process command when a command arrive", (done) => {
    const testUser = new User(client, { id: 1 });
    const testValidCommandMessage = new Message(
      new TextChannel(new Guild(client, { emojis: new Collection() }), {}),
      {
        attachments: new Collection(),
        author: testUser,
        content: "~mock",
        embeds: [],
      },
      client,
    );
    client.on(messageEvent.eventName, (message) => {
      messageEvent.eventActionCallback(client)(message);
      done();
    });
    client.emit(messageEvent.eventName, testValidCommandMessage);
  });
  it("should ignore bot message when invalid command arrive", (done) => {
    const testUser = new User(client, { id: 1, bot: true });
    const testInvalidCommandMessage = new Message(
      new TextChannel(new Guild(client, { emojis: new Collection() }), {}),
      {
        attachments: new Collection(),
        author: { ...testUser, bot: true },
        content: "~mocasfk",
        embeds: [],
      },
      client,
    );
    client.on(messageEvent.eventName, (message) => {
      messageEvent.eventActionCallback(client)(message);
      done();
    });
    client.emit(messageEvent.eventName, testInvalidCommandMessage);
  });
  afterEach(() => {
    client.destroy();
  });
});
