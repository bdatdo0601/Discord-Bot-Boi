import { Client, Guild, Message, TextChannel } from "discord.js";
import _ from "lodash";
import { Command } from "src/commands/command.interface.js";
import Util from "../../lib/util";
import Rule34CommandHelper from "./helper";
import { Rule34CommandKeyList } from "./rule34.interface";

const rule34deleteKeywordCommand: Command = {
  commandCallback: async (
    client: Client,
    db: firebase.database.Database,
    query: string,
    message: Message,
  ): Promise<void> => {
    if (!(message.channel as TextChannel).nsfw) {
      await message.channel.send("Lewd stuff don't belong here");
    } else {
      const newKeywordsList = await Rule34CommandHelper.deleteRule34Keyword(
        message.guild.id,
        query,
        db,
      );
      await message.channel.send("Updated List");
      for (const source of Object.keys(newKeywordsList)) {
        await message.channel.send(
          `${source}: [ ${newKeywordsList[source].join(" ")} ]`,
        );
      }
    }
  },
  commandDescription: "Rule 34 delete keyword command",
};

const rule34addKeywordCommand: Command = {
  commandCallback: async (
    client: Client,
    db: firebase.database.Database,
    query: string,
    message: Message,
  ): Promise<void> => {
    if (!(message.channel as TextChannel).nsfw) {
      await message.channel.send("Lewd stuff don't belong here");
    } else if (!query.match(/\w+/)) {
      await message.channel.send("You didn't give any word :[");
    } else {
      const newKeywordsList = await Rule34CommandHelper.addRule34Keyword(
        message.guild.id,
        query,
        db,
      );
      message.channel.send("Updated List");
      for (const source of Object.keys(newKeywordsList)) {
        await message.channel.send(
          `${source}: [ ${newKeywordsList[source].join(" ")} ]`,
        );
      }
    }
  },
  commandDescription: "Rule 34 add keyword command",
};

const rule34SearchCommand: Command = {
  commandCallback: async (
    client: Client,
    db: firebase.database.Database,
    query: string,
    message: Message,
  ): Promise<void> => {
    if (!(message.channel as TextChannel).nsfw) {
      await message.channel.send("Lewd images don't belong here");
    } else {
      const searchString = query
        ? query
        : Util.getRandomElementFromArray(
            (await Rule34CommandHelper.getRule34XXXKeywords(
              message.guild.id,
              db,
            )).rule34xxx,
          );
      const images = await Rule34CommandHelper.getLewlImagesFromRule34XXX(
        searchString,
        1,
      );
      if (images.length > 0) {
        message.channel.send(`The topic is ${searchString}`);
        images.forEach((image) => {
          message.channel.send(
            `${image.url} \n tags: [ ${image.tags.join(" ")} ]`,
          );
        });
      } else {
        message.channel.send(`I could not find ${searchString} in my db`);
      }
    }
  },
  commandDescription: "Rule 34 search",
};

const rule34SearchRecurringCommand: Command = {
  commandCallback: async (
    client: Client,
    db: firebase.database.Database,
    query?: string,
    message?: Message,
  ) => {
    const recurringChannels: TextChannel[] = [];
    if (!message) {
      for (const guild of client.guilds.array()) {
        const nsfwRecurringChannelID = await Rule34CommandHelper.getRule34RecurringChannel(
          guild.id,
          db,
        );
        if (nsfwRecurringChannelID) {
          const nsfwRecurringChannel: TextChannel = guild.channels.get(
            nsfwRecurringChannelID.toString(),
          ) as TextChannel;
          recurringChannels.push(nsfwRecurringChannel);
        }
      }
    } else if ((message.channel as TextChannel).nsfw) {
      recurringChannels.push(message.channel as TextChannel);
    }
    for (const channel of recurringChannels) {
      const searchString = Util.getRandomElementFromArray(
        (await Rule34CommandHelper.getRule34XXXKeywords(channel.guild.id, db))
          .rule34xxx,
      );
      const images = await Rule34CommandHelper.getLewlImagesFromRule34XXX(
        searchString,
        10,
      );
      if (images.length > 0) {
        channel.send(`The topic is ${searchString}`);
        images.forEach((image) => {
          channel.send(image.url);
        });
      } else {
        channel.send(`I could not find ${searchString} in my db`);
      }
    }
  },
  commandDescription: "Rule 34 Recurring Search Command",
};

const rule34ListCommand: Command = {
  commandCallback: async (
    client: Client,
    db: firebase.database.Database,
    query: string,
    message: Message,
  ): Promise<void> => {
    if (!(message.channel as TextChannel).nsfw) {
      await message.channel.send("Lewd stuff don't belong here");
    } else {
      const rule34KeywordList = await Rule34CommandHelper.getRule34XXXKeywords(
        message.guild.id,
        db,
      );
      if (Object.keys(rule34KeywordList).length === 0) {
        await message.channel.send("There are no keyword found");
      } else {
        for (const source of Object.keys(rule34KeywordList)) {
          await message.channel.send(
            `${source}: [ ${rule34KeywordList[source].join(" ")} ]`,
          );
        }
      }
    }
  },
  commandDescription: "Rule 34 list",
};

const rule34SetRecurringChannelCommand: Command = {
  commandCallback: async (
    client: Client,
    db: firebase.database.Database,
    query: string,
    message: Message,
  ): Promise<void> => {
    const channelID = await Rule34CommandHelper.setRule34RecurringChannel(
      message.guild.id,
      message.channel as TextChannel,
      db,
    );
    if (!channelID) {
      message.channel.send("Lewd stuff don't belong here");
    } else {
      message.channel.send("Rule34 Recurring Images will now be posted here");
    }
  },
  commandDescription: "Rule 34 Set Recurring Channel",
};

const rule34GetRecurringChannelCommand: Command = {
  commandCallback: async (
    client: Client,
    db: firebase.database.Database,
    query: string,
    message: Message,
  ): Promise<void> => {
    const recurringChannelID = await Rule34CommandHelper.getRule34RecurringChannel(
      message.guild.id,
      db,
    );
    if (recurringChannelID) {
      message.channel.send(
        `The current Rule 34 recurring channel is <#${recurringChannelID}>`,
      );
    } else {
      message.channel.send("I can't find any recurring channel for rule 34");
    }
  },
  commandDescription: "Rule 34 Get Recurring Channel",
};

const rule34DeleteRecurringChannelCommand: Command = {
  commandCallback: async (
    client: Client,
    db: firebase.database.Database,
    query: string,
    message: Message,
  ) => {
    await Rule34CommandHelper.deleteRule34RecurringChannel(
      message.guild.id,
      db,
    );
    message.channel.send("Recurring Channel is now deleted");
  },
  commandDescription: "Rule 34 delete recurring channel",
};

export const rule34CommandKeyList: Rule34CommandKeyList = {
  RULE34_ADD_KEYWORD: "~rule34addKeyword",
  RULE34_DELETE_KEYWORD: "~rule34deleteKeyword",
  RULE34_DELETE_RECURRING: "~rule34deleteRecurring",
  RULE34_GET_RECURRING: "~rule34getRecurring",
  RULE34_LIST: "~rule34list",
  RULE34_SEARCH: "~rule34",
  RULE34_SEARCH_RECURRING: "~rule34searchRecurring",
  RULE34_SET_RECURRING: "~rule34setRecurring",
};

export default {
  [rule34CommandKeyList.RULE34_DELETE_KEYWORD]: rule34deleteKeywordCommand,
  [rule34CommandKeyList.RULE34_ADD_KEYWORD]: rule34addKeywordCommand,
  [rule34CommandKeyList.RULE34_SEARCH]: rule34SearchCommand,
  [rule34CommandKeyList.RULE34_SEARCH_RECURRING]: rule34SearchRecurringCommand,
  [rule34CommandKeyList.RULE34_LIST]: rule34ListCommand,
  [rule34CommandKeyList.RULE34_SET_RECURRING]: rule34SetRecurringChannelCommand,
  [rule34CommandKeyList.RULE34_GET_RECURRING]: rule34GetRecurringChannelCommand,
  [rule34CommandKeyList.RULE34_DELETE_RECURRING]: rule34DeleteRecurringChannelCommand,
};
