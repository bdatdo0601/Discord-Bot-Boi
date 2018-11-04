import { Command, CommandList } from "@commands/command.interface.js";
import Util from "@lib/util";
import debug from "debug";
import { Message, TextChannel } from "discord.js";
import Rule34CommandHelper from "./helper";
import RULE34_RESPONSES from "./response";
import { Rule34CommandKeyList } from "./rule34.interface";

const debugLog = debug("BotBoi:Rule34Commands");

const rule34Validation = async (message: Message): Promise<void> => {
  const channel = message.channel as TextChannel;
  if (!channel.nsfw) {
    await message.channel.send(RULE34_RESPONSES.INVALID_CHANNEL());
    throw new Error(RULE34_RESPONSES.INVALID_CHANNEL());
  }
};

const rule34deleteKeywordCommand: Command = {
  commandCallback: async (context, message: Message, query: string) => {
    try {
      const { db } = context;
      await rule34Validation(message);
      const newKeywordsList = await Rule34CommandHelper.deleteRule34Keyword(
        message.guild.id,
        query,
        db,
      );
      await message.channel.send(
        Rule34CommandHelper.getRule34UpdatedListResponse(newKeywordsList),
      );
    } catch (err) {
      debugLog(err);
    }
  },
  commandDescription: "delete a keyword from rule34 keyword list",
};

const rule34addKeywordCommand: Command = {
  commandCallback: async (context, message: Message, query: string) => {
    try {
      const { db } = context;
      await rule34Validation(message);
      if (!query.match(/\w+/)) {
        await message.channel.send(RULE34_RESPONSES.WORDS_NOT_FOUND());
        return;
      }
      const newKeywordsList = await Rule34CommandHelper.addRule34Keyword(
        message.guild.id,
        query,
        db,
      );
      await message.channel.send(
        Rule34CommandHelper.getRule34UpdatedListResponse(newKeywordsList),
      );
    } catch (err) {
      debugLog(err);
    }
  },
  commandDescription: "add a keyword to rule34 keyword list",
};

const rule34SearchCommand: Command = {
  commandCallback: async (
    context,
    message: Message,
    query: string,
  ): Promise<void> => {
    try {
      const { db } = context;
      await rule34Validation(message);
      const searchString = query
        ? query
        : Util.getRandomElementFromArray(
            (await Rule34CommandHelper.getRule34Keywords(message.guild.id, db))
              .rule34xxx,
          );
      const images = await Rule34CommandHelper.getLewlImagesFromRule34XXX(
        searchString as string,
        1,
      );
      await message.channel.send(
        Rule34CommandHelper.getRule34ImagesResponse(
          searchString as string,
          images,
          true,
        ),
      );
    } catch (err) {
      debugLog(err);
    }
  },
  commandDescription: "search rule34 db",
};

const rule34SearchRecurringCommand: Command = {
  commandCallback: async (context) => {
    const { db, client } = context;
    try {
      for (const guild of client.guilds.array()) {
        const nsfwRecurringChannelID = await Rule34CommandHelper.getRule34RecurringChannel(
          guild.id,
          db,
        );
        if (nsfwRecurringChannelID) {
          const nsfwRecurringChannel: TextChannel = guild.channels.get(
            nsfwRecurringChannelID.toString(),
          ) as TextChannel;
          const searchString = Util.getRandomElementFromArray(
            (await Rule34CommandHelper.getRule34Keywords(
              nsfwRecurringChannel.guild.id,
              db,
            )).rule34xxx,
          );
          const images = await Rule34CommandHelper.getLewlImagesFromRule34XXX(
            searchString as string,
            10,
          );
          await nsfwRecurringChannel.send(
            Rule34CommandHelper.getRule34ImagesResponse(
              searchString as string,
              images,
              false,
            ),
          );
        }
      }
    } catch (err) {
      debugLog(err);
    }
  },
  commandDescription: "<INTERNAL> automatically rule34 images",
};

const rule34ListCommand: Command = {
  commandCallback: async (context, message: Message): Promise<void> => {
    try {
      const { db } = context;
      await rule34Validation(message);
      const rule34KeywordList = await Rule34CommandHelper.getRule34Keywords(
        message.guild.id,
        db,
      );
      await message.channel.send(
        Rule34CommandHelper.getRule34UpdatedListResponse(rule34KeywordList),
      );
    } catch (err) {
      debugLog(err);
    }
  },
  commandDescription: "list all keyword in rule34 keyword list",
};

const rule34SetRecurringChannelCommand: Command = {
  commandCallback: async (context, message: Message): Promise<void> => {
    try {
      const { db } = context;
      await rule34Validation(message);
      await Rule34CommandHelper.setRule34RecurringChannel(
        message.guild.id,
        message.channel as TextChannel,
        db,
      );
      await message.channel.send(RULE34_RESPONSES.RECURRING_CHANNEL_SET());
    } catch (err) {
      debugLog(err);
    }
  },
  commandDescription: "set a channel to receive recurring rule34 images",
};

const rule34GetRecurringChannelCommand: Command = {
  commandCallback: async (context, message: Message): Promise<void> => {
    try {
      const { db } = context;
      const recurringChannelID = await Rule34CommandHelper.getRule34RecurringChannel(
        message.guild.id,
        db,
      );
      if (!recurringChannelID) {
        await message.channel.send(RULE34_RESPONSES.RECURRING_NOT_FOUND());
        return;
      }
      await message.channel.send(
        RULE34_RESPONSES.GET_RECURRING_CHANNEL(recurringChannelID),
      );
    } catch (err) {
      debugLog(err);
    }
  },
  commandDescription: "return the current recurring rule34 channel",
};

const rule34DeleteRecurringChannelCommand: Command = {
  commandCallback: async (context, message: Message) => {
    try {
      const { db } = context;
      await Rule34CommandHelper.deleteRule34RecurringChannel(
        message.guild.id,
        db,
      );
      await message.channel.send(RULE34_RESPONSES.RECURRING_CHANNEL_DELETED());
    } catch (err) {
      debugLog(err);
    }
  },
  commandDescription: "disable sending automated rule34 images",
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
} as CommandList;
