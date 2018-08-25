import { getLewlImages } from "./functionalities";

export default {
    "~rule34": (message, query) => {
        if (!message.channel.nsfw) {
            message.channel.send("Lewd images don't belong here");
            return;
        }
        getLewlImages(null, query, 1, message.channel);
    },
    "~say": (message, query) => {
        const response = query
            .split("")
            .map((letter, index) => (index % 2 === 0 ? letter.toLowerCase() : letter.toUpperCase()));
        message.channel.send(`<@${message.author.id}>: ${response.join("")}`);
    },
    "~mock": (message, query) => {
        message.mentions.users.array().forEach(user => {
            if (user.lastMessage) {
                const mockMessage = user.lastMessage.content
                    .split("")
                    .map((letter, index) => (index % 2 === 0 ? letter.toLowerCase() : letter.toUpperCase()))
                    .join("");
                message.channel.send(`<@${user.id}>: ${mockMessage}`);
            }
        });
    },
};
