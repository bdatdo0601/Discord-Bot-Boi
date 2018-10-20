import { expect } from "chai";
import messageEvent from "../../../src/events/message";
import {
  Client,
  Message,
  TextChannel,
  User,
  Guild,
  Collection
} from "discord.js";

describe("Message Event", () => {
  let client: Client;
  beforeEach(() => {
    client = new Client();
  });
  it("should trigger when a message event arrive", done => {
    const testUser = new User(client, { id: 1 });
    const testMessage = new Message(
      new TextChannel(new Guild(client, { emojis: new Collection() }), {}),
      {
        content: "test yolo",
        author: testUser,
        embeds: [],
        attachments: new Collection()
      },
      client
    );
    client.on(messageEvent.eventName, message => {
      messageEvent.eventActionCallback(client)(message);
      done();
    });
    client.emit(messageEvent.eventName, testMessage);
  });
  it("should process command when a command arrive", done => {
    const testUser = new User(client, { id: 1 });
    const testValidCommandMessage = new Message(
      new TextChannel(new Guild(client, { emojis: new Collection() }), {}),
      {
        content: "~mock",
        author: testUser,
        embeds: [],
        attachments: new Collection()
      },
      client
    );
    client.on(messageEvent.eventName, message => {
      messageEvent.eventActionCallback(client)(message);
      done();
    });
    client.emit(messageEvent.eventName, testValidCommandMessage);
  });
  it("should ignore command when invalid command arrive", done => {
    const testUser = new User(client, { id: 1 });
    const testInvalidCommandMessage = new Message(
      new TextChannel(new Guild(client, { emojis: new Collection() }), {}),
      {
        content: "~mocasfk",
        author: testUser,
        embeds: [],
        attachments: new Collection()
      },
      client
    );
    client.on(messageEvent.eventName, message => {
      messageEvent.eventActionCallback(client)(message);
      done();
    });
    client.emit(messageEvent.eventName, testInvalidCommandMessage);
  });
  afterEach(() => {
    client.destroy();
  });
});
