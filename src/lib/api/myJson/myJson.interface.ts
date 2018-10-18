export interface GuildStoreObject {
  guildID: string;
  storeID: string;
}

export interface BaseJSONStoreInput {
  guildStores?: GuildStoreObject[];
}

export interface BaseJSONStore {
  guildStores: GuildStoreObject[];
}

export interface GuildBaseJSONStore {
  rule34Keywords: string[];
}
