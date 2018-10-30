import { Command } from "../command.interface";

export interface ReadyToPlayStore {
  readyToPlayRoleID: string;
}

export interface ReadyToPlayStoreInput {
  readyToPlayRoleID?: string;
}

export interface ReadyToPlayCommandKeyList {
  ACTIVATE_RDP_FEATURE: "~activateRDPFeature";
  ADD_USER_TO_RDP: "~addUsersToRDP";
  REMOVE_USER_FROM_RDP: "~removeUsersFromRDP";
}

export interface ReadyToPlayCommandList {
  [key: string]: Command;
}
