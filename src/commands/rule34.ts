import _ from "lodash";
import rule34Keywords from "../res/rule34Keywords.json";
import rule34xxxAPI from "../lib/api/rule34xxx";
import { Command } from "src/commands/command.interface.js";
import { Message, Client, Channel, TextChannel, Guild } from "discord.js";
import { Rule34XXXImage } from "src/lib/api/rule34xxx.interface.js";

/**
 *
 * @param query
 * @param amount
 * @param receiver
 */
const getLewlImages = async (
    query: string = rule34Keywords[Math.floor(Math.random() * rule34Keywords.length)],
    amount: number = 10,
    receiver: TextChannel,
    showTags: boolean
) => {
    await receiver.send(`The topic is ${query}`);
    const images: Rule34XXXImage[] = await rule34xxxAPI.getRule34XXXImgs(query);
    if (images.length === 0) {
        await receiver.send("I haven't seen any of these in my db");
    } else {
        const dataToSend: Rule34XXXImage[] = images.length > amount ? _.shuffle(images).slice(0, amount) : images;
        await dataToSend.forEach(async (image: Rule34XXXImage) => {
            const tags = showTags ? `tags: [ ${image.tags.join(" ")} ]` : "";
            await receiver.send(`${image.url} \n ${tags}`);
        });
    }
};

const rule34Command: Command = {
    commandCallback: async (client: Client, query?: string, message?: Message): Promise<void> => {
        if (!message) {
            await client.guilds.array().forEach(async (guild: Guild) => {
                // TODO: STORE NSFW CHANNEL TO POST RECURRING IN A CHANNEL
                const nsfwChannel: TextChannel = <TextChannel>guild.channels
                    .array()
                    .filter((channel: Channel) => channel.type === "text")
                    .find((channel: TextChannel) => channel.nsfw);
                if (nsfwChannel) {
                    await getLewlImages(query, 10, nsfwChannel, false);
                }
            });
        } else if (!(<TextChannel>message.channel).nsfw) {
            await message.channel.send("Lewd images don't belong here");
        } else {
            await getLewlImages(query, 1, <TextChannel>message.channel, true);
        }
    },
};

export default rule34Command;
