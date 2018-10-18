import _ from "lodash";
import { Command } from "./command.interface";
import { Client, Message } from "discord.js";

export const toMockSentence = (sentence: string): string => {
    const response: string[] = sentence.split("");
    let lowerCaseToggle = true;
    const mockSentence: string | undefined = _.reduce(
        response,
        (result: string, currentChar: string) => {
            if (!currentChar.match(/[A-Za-z]/)) {
                return result + currentChar;
            }
            if (lowerCaseToggle) {
                lowerCaseToggle = !lowerCaseToggle;
                return result + currentChar.toLocaleLowerCase();
            } else {
                lowerCaseToggle = !lowerCaseToggle;
                return result + currentChar.toLocaleUpperCase();
            }
        },
        ""
    );
    return mockSentence ? mockSentence : "";
};

const sayMockCommand: Command = {
    commandCallback: (client: Client, query: string, message: Message) => {
        const mockSentence = toMockSentence(query);
        message.channel.send(`<@${message.author.id}>: ${mockSentence}`);
    },
};

export default sayMockCommand;
