import debug from "debug";
import dotenv from "dotenv";
import firebase from "firebase";
import {
  BaseStore,
  BaseStoreInput,
  GuildStore,
  GuildStoreInput,
} from "./firebase.interface";
dotenv.config();

// firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: `${process.env.FIREBASE_AUTH_DOMAIN}.firebaseapp.com`,
  databaseURL: `https://${process.env.FIREBASE_DB_NAME}.firebaseio.com`,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: `${process.env.FIREBASE_STORAGE_BUCKET}.appspot.com`,
};

// firebase initialization
firebase.initializeApp(firebaseConfig);

const debugLog = debug("BotBoi:Firebase");

// firebase realtime db instance
const db = firebase.database();

// default base store
export const DEFAULT_BASE_STORE = Object.freeze<BaseStore>({
  guilds: {},
});

// default guild store
export const DEFAULT_GUILD_STORE = Object.freeze<GuildStore>({
  data: {
    rule34Store: {
      recurringNSFWChannelID: "undefined",
      rule34Keywords: [],
    },
  },
  guildMetadata: {
    guildID: "undefined",
  },
});

// format base store data
const formatBaseStore = (data: BaseStore): BaseStore =>
  Object.freeze({
    guilds: data.guilds || {},
  });

// format guild store data
const formatGuildStore = (data: GuildStore): GuildStore =>
  Object.freeze({
    data: {
      rule34Store: {
        recurringNSFWChannelID: data.data.rule34Store.recurringNSFWChannelID,
        rule34Keywords: data.data.rule34Store.rule34Keywords || [],
      },
    },
    guildMetadata: {
      guildID: data.guildMetadata.guildID,
    },
  });

/**
 * get current base store
 *
 * @returns {Promise<BaseStore} eventually return updated store
 */
export const getBaseStore = async (): Promise<BaseStore> => {
  try {
    debugLog("Getting most updated base store data");
    const dataSnapshot = await db.ref("/").once("value");
    const data: BaseStore = dataSnapshot.val();
    if (!data) {
      await db.ref("/").set(DEFAULT_BASE_STORE);
      return DEFAULT_BASE_STORE;
    }
    return formatBaseStore(data);
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

/**
 * Get Guild Store from the guild ID
 *
 * @param {string} guildID ID of the intersted guild
 * @returns {Promise<GuildStore | null>} eventually return guild store data (or null if it does not exist)
 */
export const getGuildStore = async (
  guildID: string,
): Promise<GuildStore | null> => {
  try {
    debugLog("getting specific guild store based on ID");
    const dataSnapshot = await db.ref(`/guilds/${guildID}`).once("value");
    const data: GuildStore = dataSnapshot.val();
    if (!data) {
      return null;
    }
    return formatGuildStore(data);
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

/**
 * Initialize a new guild
 *
 * @param {string} guildID ID of the interested guild
 * @returns {Promise<GuildStore>} eventually return guild store data
 */
export const initGuildStore = async (guildID: string): Promise<GuildStore> => {
  try {
    debugLog("Initializing Guild Store");
    await db.ref(`/guilds/${guildID}`).set({
      ...DEFAULT_GUILD_STORE,
      guildMetadata: {
        guildID,
      },
    });
    return (await getGuildStore(guildID)) as GuildStore;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

/**
 * Update guild data
 *
 * @param {string} guildID ID of the interested guild
 * @param {Promise<GuildStore>} updatedData eventually return guild store data
 */
export const updateGuildStore = async (
  updatedData: GuildStoreInput,
): Promise<GuildStore> => {
  try {
    debugLog("Updating Guild Store");
    await db
      .ref(`/guilds/${updatedData.guildMetadata.guildID}`)
      .update(updatedData);
    return (await getGuildStore(
      updatedData.guildMetadata.guildID,
    )) as GuildStore;
  } catch (error) {
    debugLog(error);
    throw error;
  }
};

export default db;
