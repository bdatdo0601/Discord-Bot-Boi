import { CommandResponse } from "@commands/command.interface";

export default {
  INVALID_PERMISSIONS: () => `Did not have permission to add users to roles
  *give me permission by place me in a role that is higher in the list from that role*`,
  R2P_ACTIVATED: (roleID) => `<@&${roleID}> feature is activated! users will be added on and taken off automatically
  *you can also manually put yourself in and out manually*`,
  R2P_ROLE_NOT_FOUND: () =>
    `You need to activate Ready To Play feature bitch (\`~activateRDPFeature\`)`,
} as CommandResponse;
