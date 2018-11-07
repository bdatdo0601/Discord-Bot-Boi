/**
 * lib/db/firebase/firebase.interface.ts
 *
 * Interface for firebase data
 */
import {
  ReadyToPlayStore,
  ReadyToPlayStoreInput,
} from "@commands/readytoplay/readytoplay.interface";
import {
  Rule34Store,
  Rule34StoreInput,
} from "@commands/rule34/rule34.interface";
import {
  GoogleAPIStore,
  GoogleAPIStoreInput,
} from "@lib/api/googleapis/googleapis.interface";

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
  readyToPlayStore?: ReadyToPlayStoreInput;
  googleStore?: GoogleAPIStoreInput;
}

export interface GuildStoreData {
  rule34Store: Rule34Store;
  readyToPlayStore: ReadyToPlayStore;
  googleStore: GoogleAPIStore;
}

export interface GuildStore {
  guildMetadata: GuildStoreMetadata;
  data: GuildStoreData;
}
