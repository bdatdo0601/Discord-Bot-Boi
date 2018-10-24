import { expect } from "chai";
import { Client, Message } from "discord.js";
import witAICommand, { witAICommandKeyList } from "../../../src/commands/witai";

describe("WitAI Command", () => {
  describe("Eval Command", () => {
    const client = new Client();
    it("greet user if it detect greetings", async () => {
      await witAICommand[witAICommandKeyList.EVAL].commandCallback(
        client,
        "hello",
        ({
          author: {
            id: "123",
          },
          channel: {
            send: (result) => {
              expect(result).to.be.a("string");
            },
          },
        } as unknown) as Message,
      );
    });
    it("process rule34searchRecurring command", async () => {
      await witAICommand[witAICommandKeyList.EVAL].commandCallback(
        client,
        "show me some good rule34 images",
        ({
          channel: {
            nsfw: false,
          },
        } as unknown) as Message,
      );
    });
    it("pass through the command if it couldn't detect anything", async () => {
      await witAICommand[witAICommandKeyList.EVAL].commandCallback(
        client,
        "LMAO",
        ({} as unknown) as Message,
      );
    });
  });
});
