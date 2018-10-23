import axios from "axios";
import dotenv from "dotenv";
import _ from "lodash";
import {
  BaseJSONStore,
  BaseJSONStoreInput,
  GuildBaseJSONStore,
  GuildBaseJSONStoreData,
  GuildBaseJSONStoreInput,
  GuildStoreObject,
  InitGuildBaseJSONStoreResponse,
} from "./myJson.interface";

dotenv.config();

const MYJSON_URL = "https://api.myjson.com/bins";

let MYJSON_BASE_STORE = `${MYJSON_URL}/${process.env.BASE_MY_JSON_STORE}`;

const configOptions = {
  headers: {
    "Content-type": "application/json",
  },
};

const setNewBaseStoreID = (baseStoreID: string) => {
  MYJSON_BASE_STORE = `${MYJSON_URL}/${baseStoreID}`;
};

const initBaseStore = async (): Promise<BaseJSONStore> => {
  const initData: BaseJSONStore = {
    guildStores: [],
  };
  const response = await axios.put<BaseJSONStore>(
    MYJSON_BASE_STORE,
    initData,
    configOptions,
  );
  return response.data;
};

const getBaseStore = async (): Promise<BaseJSONStore> => {
  const response = await axios.get<BaseJSONStore>(
    MYJSON_BASE_STORE,
    configOptions,
  );
  const data = response.data;
  if (!data || _.isEmpty(data)) {
    return await initBaseStore();
  }
  return response.data;
};

const updateBaseStore = async (
  updatedData: BaseJSONStoreInput,
): Promise<BaseJSONStore> => {
  const oldData = await getBaseStore();
  const newData = {
    ...oldData,
    ...updatedData,
  };
  const response = await axios.put<BaseJSONStore>(
    MYJSON_BASE_STORE,
    newData,
    configOptions,
  );
  return response.data;
};

const getGuildBaseJSONStore = async (
  guildID: string,
): Promise<GuildBaseJSONStore | undefined> => {
  const baseStore: BaseJSONStore = await getBaseStore();
  const guildStoreObj = baseStore.guildStores.find(
    (item: GuildStoreObject) => item.guildID === guildID,
  );
  if (!guildStoreObj) {
    return undefined;
  }
  const response = await axios.get<GuildBaseJSONStoreData>(
    guildStoreObj.storeURL,
    configOptions,
  );
  const result: GuildBaseJSONStore = {
    data: {
      ...response.data,
      rule34Store: {
        ...response.data.rule34Store,
        rule34Keywords: response.data.rule34Store.rule34Keywords
          ? response.data.rule34Store.rule34Keywords
          : [],
      },
    },
    guildStore: guildStoreObj,
  };
  return result;
};

const initGuildBaseJSONStore = async (
  guildID: string,
  guildStoreData?: GuildBaseJSONStoreInput,
): Promise<GuildBaseJSONStore | undefined> => {
  const initData: GuildBaseJSONStoreInput = {
    rule34Store: {
      recurringNSFWChannelID: undefined,
      rule34Keywords: [],
    },
    ...(guildStoreData ? guildStoreData : {}),
  };
  const response = await axios.post<InitGuildBaseJSONStoreResponse>(
    MYJSON_URL,
    initData,
    configOptions,
  );
  const { uri } = response.data;
  const baseStore = await getBaseStore();
  const newGuildStoreObj: GuildStoreObject = {
    guildID,
    storeURL: uri,
  };
  const updatedGuildStore: GuildStoreObject[] = baseStore.guildStores.find(
    (item) => item.guildID === guildID,
  )
    ? baseStore.guildStores.map(
        (item) => (item.guildID === guildID ? newGuildStoreObj : item),
      )
    : [...baseStore.guildStores, newGuildStoreObj];
  const updatedBaseStore: BaseJSONStore = {
    ...baseStore,
    guildStores: updatedGuildStore,
  };
  await updateBaseStore(updatedBaseStore);
  return await getGuildBaseJSONStore(guildID);
};

const updateGuildBaseJSONStore = async (
  guildID: string,
  updatedGuildStoreData: GuildBaseJSONStoreInput,
): Promise<GuildBaseJSONStore | undefined> => {
  const guildBaseJSONStore = await getGuildBaseJSONStore(guildID);
  if (guildBaseJSONStore) {
    const updatedData: GuildBaseJSONStoreInput = {
      ...guildBaseJSONStore.data,
      rule34Store: {
        ...guildBaseJSONStore.data.rule34Store,
        ...updatedGuildStoreData.rule34Store,
      },
    };
    const response = await axios.put<GuildBaseJSONStoreData>(
      guildBaseJSONStore.guildStore.storeURL,
      updatedData,
      configOptions,
    );
    const newGuildBaseJSONStore: GuildBaseJSONStore = {
      data: response.data,
      guildStore: guildBaseJSONStore.guildStore,
    };
    return newGuildBaseJSONStore;
  } else {
    return await initGuildBaseJSONStore(guildID, updatedGuildStoreData);
  }
};

export default {
  getBaseStore,
  getGuildBaseJSONStore,
  initBaseStore,
  initGuildBaseJSONStore,
  setNewBaseStoreID,
  updateBaseStore,
  updateGuildBaseJSONStore,
};
