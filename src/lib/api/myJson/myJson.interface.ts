import {
  Rule34StoreInput,
  Rule34Store
} from "src/commands/rule34/rule34.interface";

export interface GuildStoreObject {
  guildID: string;
  storeURL: string;
}

export interface BaseJSONStoreInput {
  guildStores?: GuildStoreObject[];
}

export interface BaseJSONStore {
  guildStores: GuildStoreObject[];
}

export interface InitGuildBaseJSONStoreResponse {
  uri: string;
}

export interface GuildBaseJSONStoreInput {
  rule34Store: Rule34StoreInput;
}

export interface GuildBaseJSONStoreData {
  rule34Store: Rule34Store;
}

export interface GuildBaseJSONStore {
  guildStore: GuildStoreObject;
  data: GuildBaseJSONStoreData;
}
