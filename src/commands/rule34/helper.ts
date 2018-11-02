import rule34xxxAPI from "@lib/api/rule34xxx";
import { Rule34XXXImage } from "@lib/api/rule34xxx/rule34xxx.interface.js";
import { getGuildStore, updateGuildStore } from "@lib/db/firebase";
import { GuildStore } from "@lib/db/firebase/firebase.interface";
import { TextChannel } from "discord.js";
import _ from "lodash";
import RULE34_RESPONSES from "./response";
import { Rule34Keyword, Rule34KeywordList } from "./rule34.interface";

/**
 * get lewd images from rule 34 API
 *
 * @param {string} query keyword to be searched
 * @param {number} amount maximum images to be returned
 *
 * @returns {Promise<Rule34XXXImage[]>} evenetually return a list of rule34xxx images found
 */
const getLewlImagesFromRule34XXX = async (
  query: string,
  amount: number,
): Promise<Rule34XXXImage[]> => {
  const images: Rule34XXXImage[] = await rule34xxxAPI.getRule34XXXImgs(query);
  if (images.length === 0) {
    return [];
  }
  const dataToSend: Rule34XXXImage[] =
    images.length > amount ? _.shuffle(images).slice(0, amount) : images;
  return dataToSend;
};

/**
 * get currently stored rule34 keywords from a guild store
 *
 * @param {string} guildID id of the guild
 * @param {firebase.database.Database} db database that contains the guild
 *
 * @returns {Promise<Rule34KeywordList>} eventually return rule34 keywords grouped by its source
 */
const getRule34Keywords = async (
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

/**
 * Get the current rule34 recurring channel of a guild from database
 * @param {string} guildID id of the guild
 * @param {firebase.database.Database} db database that contains the guild
 *
 * @returns {Promise<string | null>} eventually return the nsfw recurring channel
 * id of the guild (or null if it does not exist)
 */
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

/**
 * Set the rule34 recurring channel of a guild into database
 * @param {string} guildID id of the guild
 * @param {TextChannel} channel channel to be set to rule34 recurring channel
 * @param {firebase.database.Database} db database that contains the guild
 *
 * @returns {Promise<string | null>} eventually return the new nsfw recurring channel
 * id of the guild
 */
const setRule34RecurringChannel = async (
  guildID: string,
  channel: TextChannel,
  db: firebase.database.Database,
): Promise<string | null> => {
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

/**
 * delete the current rule34 recurring channel of a guild from database
 * @param {string} guildID id of the guild
 * @param {firebase.database.Database} db database that contains the guild
 *
 */
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

/**
 * add a keyword into rule34 database of a guild
 *
 * @param {string} guildID id of the guild
 * @param {string} keyword keyword to be added
 * @param {firebase.database.Database} db database that contains the guild
 * @param {string[] | undefined} sources (optional) source for keyword
 *
 * @returns {Promise<Rule34KeywordList>} eventually return updated keyword list
 */
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
  return await getRule34Keywords(guildID, db);
};

/**
 * delete a keyword into rule34 database of a guild
 *
 * @param {string} guildID id of the guild
 * @param {string} keyword keyword to be added
 * @param {firebase.database.Database} db database that contains the guild
 *
 * @returns {Promise<Rule34KeywordList>} eventually return updated keyword list
 */
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
  return await getRule34Keywords(guildID, db);
};

/**
 * convert a keyword list into a string response
 * @param {Rule34KeywordList} keywordList rule34 keyword list
 *
 * @returns {string} string response
 */
const getRule34UpdatedListResponse = (
  keywordList: Rule34KeywordList,
): string => {
  const result: string[] = [];
  if (Object.keys(keywordList).length === 0) {
    result.push(RULE34_RESPONSES.NO_KEYWORD_FOUND());
    return result.join("\n");
  }
  result.push("Updated List");
  for (const source of Object.keys(keywordList)) {
    result.push(`${source}: [ ${keywordList[source].join(" ")} ]`);
  }
  return result.join("\n");
};

/**
 * convert a list of image result into a string response
 * @param {string} topic topic of the images
 * @param {Rule34XXXImage[]} images list of image
 * @param {boolean} withTag determine whether or not to include tags to response
 *
 * @returns {string} string response
 */
const getRule34ImagesResponse = (
  topic: string,
  images: Rule34XXXImage[],
  withTag: boolean,
): string => {
  const result: string[] = [];
  if (images.length === 0) {
    result.push(RULE34_RESPONSES.TOPIC_NOT_FOUND(topic));
    return result.join("\n");
  }
  result.push(`The topic is ${topic}`);
  images.forEach((image) => {
    result.push(image.url);
    if (withTag) {
      result.push(`tags: [ ${image.tags.join(" ")} ]`);
    }
  });
  return result.join("\n");
};

export default {
  addRule34Keyword,
  deleteRule34Keyword,
  deleteRule34RecurringChannel,
  getLewlImagesFromRule34XXX,
  getRule34ImagesResponse,
  getRule34Keywords,
  getRule34RecurringChannel,
  getRule34UpdatedListResponse,
  setRule34RecurringChannel,
};
