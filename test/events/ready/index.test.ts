import { expect } from "chai";
import readyEvent, {
  RULE34_INTERVAL,
  setUpMockClock,
  tearDownMockClock
} from "../../../src/events/ready";
import { Client, Collection, Guild } from "discord.js";
import lolex from "lolex";

describe("Ready Event", () => {
  const client: Client = new Client();
  const clock = setUpMockClock();
  it("should trigger when ready event got emitted", done => {
    client.on(readyEvent.eventName, () => {
      client.guilds = new Collection<string, Guild>().set(
        "1",
        new Guild(client, { emojis: new Collection() })
      );
      readyEvent.eventActionCallback(client)();
      setTimeout(() => {
        done();
      }, RULE34_INTERVAL + 1);
    });
    client.emit(readyEvent.eventName);
    clock.tick(RULE34_INTERVAL + 10);
  });
  after(() => {
    setTimeout(() => {
      tearDownMockClock(clock);
    }, RULE34_INTERVAL);
    clock.tick(RULE34_INTERVAL + 10);
    client.destroy();
  });
});
