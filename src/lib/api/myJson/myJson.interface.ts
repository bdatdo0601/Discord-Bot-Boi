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

export interface Rule34Keyword {
  source: "rule34xxx";
  word: string;
}

export interface GuildBaseJSONStoreInput {
  rule34Keywords?: Rule34Keyword[];
}

export interface GuildBaseJSONStoreData {
  rule34Keywords: Rule34Keyword[];
}

export interface GuildBaseJSONStore {
  guildStore: GuildStoreObject;
  data: GuildBaseJSONStoreData;
}
