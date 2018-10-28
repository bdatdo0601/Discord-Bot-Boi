import { TextChannel } from "discord.js";
import _ from "lodash";
import { Rule34XXXImage } from "src/lib/api/rule34xxx/rule34xxx.interface.js";
import { GuildStore } from "src/lib/db/firebase/firebase.interface";
import rule34xxxAPI from "../../lib/api/rule34xxx";
import { getGuildStore, updateGuildStore } from "../../lib/db/firebase";
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
  db: firebase.database.Database,
): Promise<Rule34KeywordList> => {
  const guildStore = await getGuildStore(guildID, db);
  const result: Rule34KeywordList = {} as Rule34KeywordList;
  if (!guildStore) {
    return result;
  }
  const { rule34Keywords } = guildStore.data.rule34Store;
  const groupedKeywords = _.groupBy(rule34Keywords, (item) => item.source);

  Object.keys(groupedKeywords).forEach((key) => {
    result[key] = groupedKeywords[key].map((item) => item.word);
  });
  return result;
};

const getRule34RecurringChannel = async (
  guildID: string,
  db: firebase.database.Database,
): Promise<string | null> => {
  const guildStore = await getGuildStore(guildID, db);
  if (!guildStore || !guildStore.data.rule34Store.recurringNSFWChannelID) {
    return null;
  }
  return guildStore.data.rule34Store.recurringNSFWChannelID;
};

const setRule34RecurringChannel = async (
  guildID: string,
  channel: TextChannel,
  db: firebase.database.Database,
): Promise<string | null> => {
  if (!channel.nsfw) {
    return null;
  }
  const updatedGuildStore = await updateGuildStore(
    {
      data: {
        rule34Store: {
          recurringNSFWChannelID: channel.id,
        },
      },
      guildMetadata: {
        guildID,
      },
    },
    db,
  );
  return updatedGuildStore.data.rule34Store.recurringNSFWChannelID;
};

const deleteRule34RecurringChannel = async (
  guildID: string,
  db,
): Promise<void> => {
  await updateGuildStore(
    {
      data: {
        rule34Store: {
          recurringNSFWChannelID: "",
        },
      },
      guildMetadata: {
        guildID,
      },
    },
    db,
  );
};

const addRule34Keyword = async (
  guildID: string,
  keyword: string,
  db: firebase.database.Database,
  sources?: string[],
): Promise<Rule34KeywordList> => {
  const guildStore = (await getGuildStore(guildID, db)) as GuildStore;
  const addedKeywords: Rule34Keyword[] = sources
    ? sources.map<Rule34Keyword>((source) => ({ source, word: keyword }))
    : [
        {
          source: "rule34xxx",
          word: keyword,
        },
      ];
  const updatedKeywords = [
    ...guildStore.data.rule34Store.rule34Keywords,
    ...addedKeywords,
  ];
  await updateGuildStore(
    {
      data: {
        rule34Store: {
          rule34Keywords: updatedKeywords,
        },
      },
      guildMetadata: {
        guildID,
      },
    },
    db,
  );
  return await getRule34XXXKeywords(guildID, db);
};

const deleteRule34Keyword = async (
  guildID: string,
  keyword: string,
  db: firebase.database.Database,
): Promise<Rule34KeywordList> => {
  const guildStore = (await getGuildStore(guildID, db)) as GuildStore;
  const updatedKeywordsList: Rule34Keyword[] = guildStore.data.rule34Store.rule34Keywords.filter(
    (item) => item.word !== keyword,
  );
  await updateGuildStore(
    {
      data: {
        rule34Store: {
          rule34Keywords: updatedKeywordsList,
        },
      },
      guildMetadata: {
        guildID,
      },
    },
    db,
  );
  return await getRule34XXXKeywords(guildID, db);
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
