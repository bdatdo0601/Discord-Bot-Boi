import { Command } from "../command.interface";
import { toMockSentence } from "../sayMock";
import { Client, Message, User } from "discord.js";

const mockCommand: Command = {
    commandCallback: (client: Client, query: string, message: Message) => {
        message.mentions.users.array().forEach((user: User) => {
            if (user.lastMessage) {
                const mockMessage = toMockSentence(user.lastMessage.cleanContent);
                message.channel.send(`<@${user.id}>: ${mockMessage}`);
            }
        });
    },
};

export default mockCommand;
