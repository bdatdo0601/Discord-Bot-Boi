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
  ACTIVATE_RDP_FEATURE: "~activateR2PFeature";
  ADD_USER_TO_RDP: "~r2p";
  REMOVE_USER_FROM_RDP: "~!r2p";
}
