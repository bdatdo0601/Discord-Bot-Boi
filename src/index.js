import Discord from "discord.js";

// https://discordapp.com/oauth2/authorize?client_id=482244091518779402&scope=bot&permissions=8

import dotenv from "dotenv";
dotenv.config();

import { getLewlImages } from "./functionalities";
import requestCommand from "./command";

const client = new Discord.Client();
const token = process.env.BOT_TOKEN;

client.on("ready", async () => {
    console.log("Me Me Ready");
    client.guilds.array().forEach(guild => {
        // guild.channels
        //     .array()
        //     .find(channel => channel.type === "text")
        //     .send("Me Me Alive & Ready");
    });

    await getLewlImages(client);
    setInterval(() => getLewlImages(client), 60000 * 15);
});

client.on("error", error => {
    console.log("I'm ded");
    console.log(error);
});

client.on("message", message => {
    message.mentions.roles.array().forEach(role => {
        const notifyingMembers = role.members
            .array()
            .filter(
                member =>
                    member.user.id !== message.author.id &&
                    (member.presence.status === "online" || member.presence.status === "idle")
            );
        const notifyingMembersToMentions = notifyingMembers.reduce((result, member) => (result += `<@${member.id}> `));
        message.channel.send(`Hey ${notifyingMembersToMentions}! <@${message.author.id}> wanna play some ${role.name}`);
    });
    if (message.content[0] === "~") {
        const [command, ...rest] = message.content.split(" ");
        const query = rest.join(" ");
        if (requestCommand[command]) {
            requestCommand[command](message, query);
        }
    }
});

client.login(token);
