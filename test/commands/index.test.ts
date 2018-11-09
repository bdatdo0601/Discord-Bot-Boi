import { expect } from "chai";
import { Client, ClientUser, Message } from "discord.js";
import firebase, { ServiceAccount } from "firebase-admin";
import _ from "lodash";
import commandList, { COMMANDS, processCommand } from "../../src/commands";
import { FIREBASE_CONFIG, GOOGLE_CONFIG } from "../../src/config";
import { EventContext } from "../../src/events/event.interface";

describe("Command List Wrapper", () => {
  // firebase initialization
  const app = firebase.initializeApp(
    {
      credential: firebase.credential.cert(GOOGLE_CONFIG as ServiceAccount),
      databaseURL: FIREBASE_CONFIG.databaseURL,
    },
    "GeneralCommandsTestEnv",
  );
  const FireDB = app.database();
  let client: Client;
  beforeEach(() => {
    client = new Client();
  });
  before(async () => {
    await FireDB.goOnline();
  });
  describe("General Command", () => {
    const response: string[] = [];
    for (const commandType of Object.keys(COMMANDS)) {
      response.push(`**${_.capitalize(commandType)}**`);
      for (const command of Object.keys(COMMANDS[commandType])) {
        response.push(
          ` \`${COMMANDS[commandType][command]}\`:   ${
            commandList[COMMANDS[commandType][command]].commandDescription
          }`,
        );
      }
    }
    it("~help should return a list of all available command", async () => {
      const mockMessage = {
        channel: {
          send: (result) => {
            expect(result).to.be.eql(response.join("\n"));
          },
        },
      };
      commandList[COMMANDS.GENERAL.LIST_COMMAND].commandCallback(
        ({} as unknown) as EventContext,
        (mockMessage as unknown) as Message,
      );
    });
    it("should do nothing if an error occur", async () => {
      commandList[COMMANDS.GENERAL.LIST_COMMAND].commandCallback(
        ({} as unknown) as EventContext,
        ({} as unknown) as Message,
      );
    });
  });
  describe("processCommand Function", () => {
    it("should process command when a command arrive", async () => {
      const mockMessage = {
        author: {
          bot: false,
        },
        content: "~sayMock test",
        send: (result) => {
          expect(result).to.be.a("string");
        },
      };
      await processCommand(
        ({
          client,
          db: FireDB,
        } as unknown) as EventContext,
        (mockMessage as unknown) as Message,
      );
    });
    it("should ignore command when invalid command arrive", async () => {
      const mockMessage = {
        author: {
          bot: false,
        },
        content: "~sayMsafasock test",
        send: (result) => {
          expect(result).to.be.a("string");
        },
      };
      await processCommand(
        ({
          client,
          db: FireDB,
        } as unknown) as EventContext,
        (mockMessage as unknown) as Message,
      );
    });
  });
  it("should return an object", () => {
    expect(COMMANDS).to.be.an("object");
    expect(commandList).to.be.an("object");
  });
  afterEach(async () => {
    await client.destroy();
  });
  after(async () => {
    await FireDB.goOffline();
    await app.delete();
  });
});
