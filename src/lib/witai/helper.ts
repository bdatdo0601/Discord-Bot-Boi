import { Message } from "discord.js";
import util from "../../lib/util";

const getGreetings = (message: Message) => {
  return util.getRandomElementFromArray([
    `What's good <@${message.author.id}>?`,
    `<@${message.author.id}> What's up my glip glops`,
    `Me me welcome boi`,
  ]);
};

export default {
  greetings: getGreetings,
};
