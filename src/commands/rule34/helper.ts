import { TextChannel } from "discord.js";
import _ from "lodash";
import { GuildBaseJSONStore } from "src/lib/api/myJson/myJson.interface";
import { Rule34XXXImage } from "src/lib/api/rule34xxx/rule34xxx.interface.js";
import MyJSONAPI from "../../lib/api/myJson";
import rule34xxxAPI from "../../lib/api/rule34xxx";
import { Rule34Keyword, Rule34KeywordList } from "./rule34.interface";

/**
 *
 * @param query
 * @param amount
 * @param receiver
 */
const getLewlImagesFromRule34XXX = async (
  query: string,
  amount: number,
): Promise<Rule34XXXImage[]> => {
  const images: Rule34XXXImage[] = await rule34xxxAPI.getRule34XXXImgs(query);
  if (images.length === 0) {
    return [];
  } else {
    const dataToSend: Rule34XXXImage[] =
      images.length > amount ? _.shuffle(images).slice(0, amount) : images;
    return dataToSend;
  }
};

const getRule34XXXKeywords = async (
  guildID: string,
): Promise<Rule34KeywordList> => {
  const guildBaseStore = (await MyJSONAPI.getGuildBaseJSONStore(
    guildID,
  )) as GuildBaseJSONStore;
  const result: Rule34KeywordList = {} as Rule34KeywordList;

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
): Promise<string | null> => {
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

const addRule34Keyword = async (
  guildID: string,
  keyword: string,
  sources?: string[],
): Promise<Rule34KeywordList> => {
  const guildBase = (await MyJSONAPI.getGuildBaseJSONStore(
    guildID,
  )) as GuildBaseJSONStore;
  const addedKeywords: Rule34Keyword[] = sources
    ? sources.map<Rule34Keyword>((source) => ({ source, word: keyword }))
    : [
        {
          source: "rule34xxx",
          word: keyword,
        },
      ];
  const updatedKeywords = [
    ...guildBase.data.rule34Store.rule34Keywords,
    ...addedKeywords,
  ];
  await MyJSONAPI.updateGuildBaseJSONStore(guildID, {
    rule34Store: {
      rule34Keywords: updatedKeywords,
    },
  });
  return await getRule34XXXKeywords(guildID);
};

const deleteRule34Keyword = async (
  guildID: string,
  keyword: string,
): Promise<Rule34KeywordList> => {
  const guildBase = (await MyJSONAPI.getGuildBaseJSONStore(
    guildID,
  )) as GuildBaseJSONStore;
  const updatedKeywordsList: Rule34Keyword[] = guildBase.data.rule34Store.rule34Keywords.filter(
    (item) => item.word !== keyword,
  );
  await MyJSONAPI.updateGuildBaseJSONStore(guildID, {
    rule34Store: {
      rule34Keywords: updatedKeywordsList,
    },
  });
  return await getRule34XXXKeywords(guildID);
};

export default {
  addRule34Keyword,
  deleteRule34Keyword,
  deleteRule34RecurringChannel,
  getLewlImagesFromRule34XXX,
  getRule34RecurringChannel,
  getRule34XXXKeywords,
  setRule34RecurringChannel,
};