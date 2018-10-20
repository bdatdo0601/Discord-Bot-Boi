import { expect } from "chai";
import readyEvent, { RULE34_INTERVAL } from "../../../src/events/ready";
import { Client, Collection, Guild } from "discord.js";
import lolex from "lolex";

// import dotenv from "dotenv";
// dotenv.config();

describe("Ready Event", () => {
  const client: Client = new Client();
  let clock;
  before(() => {
    clock = lolex.install({ shouldAdvanceTime: true, target: global });
  });
  it("should trigger when ready event got emitted", done => {
    client.on(readyEvent.eventName, () => {
      client.guilds = new Collection<string, Guild>().set(
        "1",
        new Guild(client, { emojis: new Collection() })
      );
      readyEvent.eventActionCallback(client)();
      clock.tick(RULE34_INTERVAL);
      setTimeout(() => {
        done();
      }, 1);
    });
    client.emit(readyEvent.eventName);
  });
  after(() => {
    clock.uninstall();
    client.destroy();
  });
});
