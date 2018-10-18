import axios from "axios";
import _ from "lodash";
import { BaseJSONStore, BaseJSONStoreInput } from "./myJson.interface";

const { NODE_ENV, BASE_MY_JSON_STORE, BASE_MY_JSON_STORE_TEST } = process.env;

const MYJSON_BASE_STORE = `https://api.myjson.com/bins/${
  NODE_ENV === "development" ? BASE_MY_JSON_STORE : BASE_MY_JSON_STORE_TEST
}`;

const configOptions = {
  headers: {
    "Content-type": "application/json"
  }
};

const initBaseStore = async (): Promise<BaseJSONStore> => {
  const initData: BaseJSONStore = {
    guildStores: []
  };
  const response = await axios.put<BaseJSONStore>(
    MYJSON_BASE_STORE,
    initData,
    configOptions
  );
  return response.data;
};

const getBaseStore = async (): Promise<BaseJSONStore> => {
  const response = await axios.get<BaseJSONStore>(
    MYJSON_BASE_STORE,
    configOptions
  );
  const data = response.data;
  if (!data || _.isEmpty(data)) {
    return await initBaseStore();
  }
  return response.data;
};

const setBaseStore = async (
  updatedData: BaseJSONStoreInput
): Promise<BaseJSONStore> => {
  const oldData = await getBaseStore();
  const newData = {
    ...oldData,
    ...updatedData
  };
  const response = await axios.put<BaseJSONStore>(
    MYJSON_BASE_STORE,
    newData,
    configOptions
  );
  return response.data;
};

// const getGuildStoreFromBaseStore = async (guildID: string): Promise<string> => {
//     const baseStore = await getBaseStore();
//     const baseStore.guildStores.find(item => item.guildID === guildID);
// }
