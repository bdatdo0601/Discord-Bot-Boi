import { Client, Guild, Message, TextChannel } from "discord.js";
import _ from "lodash";
import { Command } from "src/commands/command.interface.js";
import Util from "../../lib/util";
import Rule34CommandHelper from "./helper";
import { Rule34CommandKeyList } from "./rule34.interface";

const rule34SetRecurringChannelCommand: Command = {
  commandCallback: async (
    client: Client,
    query: string,
    message: Message,
  ): Promise<void> => {
    const channelID = await Rule34CommandHelper.setRule34RecurringChannel(
      message.guild.id,
      message.channel as TextChannel,
    );
    if (!channelID) {
      message.channel.send("Lewd stuff don't belong here");
    } else {
      message.channel.send("Rule34 Recurring Images will now be posted here");
    }
  },
  commandName: "Rule 34 Set Recurring Channel",
};

const rule34GetRecurringChannelCommand: Command = {
  commandCallback: async (
    client: Client,
    query: string,
    message: Message,
  ): Promise<void> => {
    const recurringChannelID = await Rule34CommandHelper.getRule34RecurringChannel(
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
  commandName: "Rule 34 Get Recurring Channel",
};

const rule34DeleteRecurringChannelCommand: Command = {
  commandCallback: async (client: Client, query: string, message: Message) => {
    await Rule34CommandHelper.deleteRule34RecurringChannel(message.guild.id);
    message.channel.send("Recurring Channel is now deleted");
  },
  commandName: "rule 34 delete recurring channel",
};

const rule34ListCommand: Command = {
  commandCallback: async (
    client: Client,
    query: string,
    message: Message,
  ): Promise<void> => {
    if (!(message.channel as TextChannel).nsfw) {
      await message.channel.send("Lewd stuff don't belong here");
    } else {
      const rule34KeywordList = await Rule34CommandHelper.getRule34XXXKeywords(
        message.guild.id,
      );
      Object.keys(rule34KeywordList).forEach((source) => {
        message.channel.send(
          `${source}: [ ${rule34KeywordList[source].join(" ")} ]`,
        );
      });
    }
  },
  commandName: "rule 34 list",
};

const rule34SearchCommand: Command = {
  commandCallback: async (
    client: Client,
    query?: string,
    message?: Message,
  ): Promise<void> => {
    if (!message) {
      await client.guilds.array().forEach(async (guild: Guild) => {
        const nsfwRecurringChannelID = await Rule34CommandHelper.getRule34RecurringChannel(
          guild.id,
        );
        if (nsfwRecurringChannelID) {
          const nsfwRecurringChannel: TextChannel = guild.channels.get(
            nsfwRecurringChannelID.toString(),
          ) as TextChannel;
          const searchString = query
            ? query
            : Util.getRandomElementFromArray(
                (await Rule34CommandHelper.getRule34XXXKeywords(guild.id))
                  .rule34xxx,
              );
          await Rule34CommandHelper.getLewlImagesFromRule34XXX(
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
            (await Rule34CommandHelper.getRule34XXXKeywords(message.guild.id))
              .rule34xxx,
          );
      await Rule34CommandHelper.getLewlImagesFromRule34XXX(
        searchString,
        1,
        message.channel as TextChannel,
        true,
      );
    }
  },
  commandName: "rule 34 search",
};

const rule34addKeywordCommand: Command = {
  commandCallback: async (
    client: Client,
    query: string,
    message: Message,
  ): Promise<void> => {
    if (!(message.channel as TextChannel).nsfw) {
      await message.channel.send("Lewd stuff don't belong here");
    } else if (!query.match(/w+/)) {
      await message.channel.send("You didn't give any word :[");
    } else {
      const newKeywordsList = await Rule34CommandHelper.addRule34Keyword(
        message.guild.id,
        query,
      );
      message.channel.send("Updated List");
      Object.keys(newKeywordsList).forEach((source) => {
        message.channel.send(
          `${source}: [ ${newKeywordsList[source].join(" ")} ]`,
        );
      });
    }
  },
  commandName: "rule 34 add keyword command",
};

const rule34deleteKeywordCommand: Command = {
  commandCallback: async (
    client: Client,
    query: string,
    message: Message,
  ): Promise<void> => {
    if (!(message.channel as TextChannel).nsfw) {
      await message.channel.send("Lewd stuff don't belong here");
    } else {
      const newKeywordsList = await Rule34CommandHelper.deleteRule34Keyword(
        message.guild.id,
        query,
      );
      message.channel.send("Updated List");
      Object.keys(newKeywordsList).forEach((source) => {
        message.channel.send(
          `${source}: [ ${newKeywordsList[source].join(" ")} ]`,
        );
      });
    }
  },
  commandName: "Rule 34 delete keyword command",
};

export const rule34CommandKeyList: Rule34CommandKeyList = {
  RULE34_ADD_KEYWORD: "~rule34addKeyword",
  RULE34_DELETE_KEYWORD: "~rule34deleteKeyword",
  RULE34_DELETE_RECURRING: "~rule34deleteRecurring",
  RULE34_GET_RECURRING: "~rule34getRecurring",
  RULE34_LIST: "~rule34list",
  RULE34_SEARCH: "~rule34",
  RULE34_SET_RECURRING: "~rule34setRecurring",
};

export default {
  [rule34CommandKeyList.RULE34_DELETE_KEYWORD]:
    rule34deleteKeywordCommand.commandCallback,
  [rule34CommandKeyList.RULE34_ADD_KEYWORD]:
    rule34addKeywordCommand.commandCallback,
  [rule34CommandKeyList.RULE34_SEARCH]: rule34SearchCommand.commandCallback,
  [rule34CommandKeyList.RULE34_LIST]: rule34ListCommand.commandCallback,
  [rule34CommandKeyList.RULE34_SET_RECURRING]:
    rule34SetRecurringChannelCommand.commandCallback,
  [rule34CommandKeyList.RULE34_GET_RECURRING]:
    rule34GetRecurringChannelCommand.commandCallback,
  [rule34CommandKeyList.RULE34_DELETE_RECURRING]:
    rule34DeleteRecurringChannelCommand.commandCallback,
};
