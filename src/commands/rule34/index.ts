import { Channel, Client, Guild, Message, TextChannel } from "discord.js";
import _ from "lodash";
import { Command } from "src/commands/command.interface.js";
import { Rule34XXXImage } from "src/lib/api/rule34xxx/rule34xxx.interface.js";
import MyJSONAPI from "../../lib/api/myJson";
import rule34xxxAPI from "../../lib/api/rule34xxx";
import Util from "../../lib/util";
import {
  Rule34CommandKeyList,
  Rule34Keyword,
  Rule34KeywordList,
} from "./rule34.interface";

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
  showTags: boolean,
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

const getRule34XXXKeywords = async (
  guildID: string,
): Promise<Rule34KeywordList> => {
  const guildBaseStore = await MyJSONAPI.getGuildBaseJSONStore(guildID);
  const result: Rule34KeywordList = {
    rule34xxx: [""],
  };
  if (!guildBaseStore) {
    return result;
  }
  const { rule34Store } = guildBaseStore.data;
  const groupedKeywords = _.groupBy(
    rule34Store.rule34Keywords,
    (item) => item.source,
  );

  Object.keys(groupedKeywords).forEach((key) => {
    result[key] = groupedKeywords[key].map((item) => item.word);
  });
  return result;
};

const getRule34RecurringChannel = async (
  guildID: string,
): Promise<String | null> => {
  const guildBaseStore = await MyJSONAPI.getGuildBaseJSONStore(guildID);
  if (
    !guildBaseStore ||
    !guildBaseStore.data.rule34Store.recurringNSFWChannelID
  ) {
    return null;
  }
  return guildBaseStore.data.rule34Store.recurringNSFWChannelID;
};

const setRule34RecurringChannel = async (
  guildID: string,
  channel: TextChannel,
): Promise<string | null> => {
  if (!channel.nsfw) {
    return null;
  }
  await MyJSONAPI.updateGuildBaseJSONStore(guildID, {
    rule34Store: {
      recurringNSFWChannelID: channel.id,
    },
  });
  return channel.id;
};

const deleteRule34RecurringChannel = async (guildID: string): Promise<void> => {
  await MyJSONAPI.updateGuildBaseJSONStore(guildID, {
    rule34Store: {
      recurringNSFWChannelID: undefined,
    },
  });
};

const rule34SetRecurringChannelCommand: Command = {
  commandName: "Rule 34 Set Recurring Channel",
  commandCallback: async (
    client: Client,
    query: string,
    message: Message,
  ): Promise<void> => {
    const channelID = await setRule34RecurringChannel(
      message.guild.id,
      message.channel as TextChannel,
    );
    if (!channelID) {
      message.channel.send("Lewd stuff don't belong here");
    } else {
      message.channel.send("Rule34 Recurring Images will now be posted here");
    }
  },
};

const rule34GetRecurringChannelCommand: Command = {
  commandName: "Rule 34 Get Recurring Channel",
  commandCallback: async (
    client: Client,
    query: string,
    message: Message,
  ): Promise<void> => {
    const recurringChannelID = await getRule34RecurringChannel(
      message.guild.id,
    );
    if (recurringChannelID) {
      message.channel.send(
        `The current Rule 34 recurring channel is <#${recurringChannelID}>`,
      );
    } else {
      message.channel.send("I can't find any recurring channel for rule 34");
    }
  },
};

const rule34DeleteRecurringChannelCommand: Command = {
  commandName: "rule 34 delete recurring channel",
  commandCallback: async (client: Client, query: string, message: Message) => {
    await deleteRule34RecurringChannel(message.guild.id);
    message.channel.send("Recurring Channel is now deleted");
  },
};

const rule34ListCommand: Command = {
  commandName: "rule 34 list",
  commandCallback: async (
    client: Client,
    query: string,
    message: Message,
  ): Promise<void> => {
    if (!(message.channel as TextChannel).nsfw) {
      await message.channel.send("Lewd stuff don't belong here");
    } else {
      const rule34KeywordList = await getRule34XXXKeywords(message.guild.id);
      Object.keys(rule34KeywordList).forEach((source) => {
        message.channel.send(
          `${source}: [ ${rule34KeywordList[source].join(" ")} ]`,
        );
      });
    }
  },
};

const rule34SearchCommand: Command = {
  commandName: "rule 34 search",
  commandCallback: async (
    client: Client,
    query?: string,
    message?: Message,
  ): Promise<void> => {
    if (!message) {
      await client.guilds.array().forEach(async (guild: Guild) => {
        const nsfwRecurringChannelID = await getRule34RecurringChannel(
          guild.id,
        );
        if (nsfwRecurringChannelID) {
          const nsfwRecurringChannel: TextChannel = guild.channels.get(
            nsfwRecurringChannelID.toString(),
          ) as TextChannel;
          const searchString = query
            ? query
            : Util.getRandomElementFromArray(
                (await getRule34XXXKeywords(guild.id)).rule34xxx,
              );
          await getLewlImagesFromRule34XXX(
            searchString,
            10,
            nsfwRecurringChannel,
            false,
          );
        }
      });
    } else if (!(message.channel as TextChannel).nsfw) {
      await message.channel.send("Lewd images don't belong here");
    } else {
      const searchString = query
        ? query
        : Util.getRandomElementFromArray(
            (await getRule34XXXKeywords(message.guild.id)).rule34xxx,
          );
      await getLewlImagesFromRule34XXX(
        searchString,
        1,
        message.channel as TextChannel,
        true,
      );
    }
  },
};

export const rule34CommandKeyList: Rule34CommandKeyList = {
  RULE34_SEARCH: "~rule34",
  RULE34_LIST: "~rule34list",
  RULE34_SET_RECURRING: "~rule34setRecurring",
  RULE34_GET_RECURRING: "~rule34getRecurring",
  RULE34_DELETE_RECURRING: "~rule34deleteRecurring",
};

export default {
  [rule34CommandKeyList.RULE34_SEARCH]: rule34SearchCommand.commandCallback,
  [rule34CommandKeyList.RULE34_LIST]: rule34ListCommand.commandCallback,
  [rule34CommandKeyList.RULE34_SET_RECURRING]:
    rule34SetRecurringChannelCommand.commandCallback,
  [rule34CommandKeyList.RULE34_GET_RECURRING]:
    rule34GetRecurringChannelCommand.commandCallback,
  [rule34CommandKeyList.RULE34_DELETE_RECURRING]:
    rule34DeleteRecurringChannelCommand.commandCallback,
};
