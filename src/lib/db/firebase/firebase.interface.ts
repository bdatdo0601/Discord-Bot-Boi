import {
  Rule34Store,
  Rule34StoreInput,
} from "../../../commands/rule34/rule34.interface";

export interface BaseStoreInput {
  guilds?: GuildStoreInput[];
}

export interface BaseStore {
  guilds: {
    [key: string]: GuildStore;
  };
}

export interface GuildStoreMetadata {
  guildID: string;
}

export interface GuildStoreInput {
  guildMetadata: GuildStoreMetadata;
  data: GuildStoreDataInput;
}

export interface GuildStoreDataInput {
  rule34Store?: Rule34StoreInput;
}

export interface GuildStoreData {
  rule34Store: Rule34Store;
}

export interface GuildStore {
  guildMetadata: GuildStoreMetadata;
  data: GuildStoreData;
}
