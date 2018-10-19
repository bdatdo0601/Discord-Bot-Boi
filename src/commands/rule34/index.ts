import _ from "lodash";
import rule34xxxAPI from "../../lib/api/rule34xxx";
import MyJSONAPI from "../../lib/api/myJson";
import { Command } from "src/commands/command.interface.js";
import { Message, Client, Channel, TextChannel, Guild } from "discord.js";
import { Rule34XXXImage } from "src/lib/api/rule34xxx/rule34xxx.interface.js";
import Util from "../../lib/util";

/**
 *
 * @param query
 * @param amount
 * @param receiver
 */
const getLewlImagesFromRule34XXX = async (
  query: string,
  amount: number = 10,
  receiver: TextChannel,
  showTags: boolean
) => {
  await receiver.send(`The topic is ${query}`);
  const images: Rule34XXXImage[] = await rule34xxxAPI.getRule34XXXImgs(query);
  if (images.length === 0) {
    await receiver.send("I haven't seen any of these in my db");
  } else {
    const dataToSend: Rule34XXXImage[] =
      images.length > amount ? _.shuffle(images).slice(0, amount) : images;
    await dataToSend.forEach(async (image: Rule34XXXImage) => {
      const tags = showTags ? `tags: [ ${image.tags.join(" ")} ]` : "";
      await receiver.send(`${image.url} \n ${tags}`);
    });
  }
};

const getRule34XXXKeywords = async (guildID: string): Promise<string[]> => {
  const guildBaseStore = await MyJSONAPI.getGuildBaseJSONStore(guildID);
  if (!guildBaseStore) return ["naruto"];
  return guildBaseStore.data.rule34Keywords
    .filter(item => item.source === "rule34xxx")
    .map(item => item.word);
};

const rule34Command: Command = {
  commandCallback: async (
    client: Client,
    query?: string,
    message?: Message
  ): Promise<void> => {
    if (!message) {
      await client.guilds.array().forEach(async (guild: Guild) => {
        // TODO: STORE NSFW CHANNEL TO POST RECURRING IN A CHANNEL
        const nsfwChannel: TextChannel = <TextChannel>guild.channels
          .array()
          .filter((channel: Channel) => channel.type === "text")
          .find((channel: TextChannel) => channel.nsfw);
        if (nsfwChannel) {
          const searchString = query
            ? query
            : Util.getRandomElementFromArray(
                await getRule34XXXKeywords(guild.id)
              );
          await getLewlImagesFromRule34XXX(
            searchString,
            10,
            nsfwChannel,
            false
          );
        }
      });
    } else if (!(<TextChannel>message.channel).nsfw) {
      await message.channel.send("Lewd images don't belong here");
    } else {
      const searchString = query
        ? query
        : Util.getRandomElementFromArray(
            await getRule34XXXKeywords(message.guild.id)
          );
      await getLewlImagesFromRule34XXX(
        searchString,
        1,
        <TextChannel>message.channel,
        true
      );
    }
  }
};

export default rule34Command;
