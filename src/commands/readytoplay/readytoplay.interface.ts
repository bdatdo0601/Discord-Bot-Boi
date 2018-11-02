import { Command } from "../command.interface";

export interface ReadyToPlayStore {
  readyToPlayRoleID: string;
  isActivated: boolean;
}

export interface ReadyToPlayStoreInput {
  readyToPlayRoleID?: string;
  isActivated?: boolean;
}

export interface ReadyToPlayCommandKeyList {
  ACTIVATE_RDP_FEATURE: "~activateRDPFeature";
  ADD_USER_TO_RDP: "~addUsersToRDP";
  REMOVE_USER_FROM_RDP: "~removeUsersFromRDP";
}
