import { Command, CommandList } from "@commands/command.interface";
import { getGuildStore, updateGuildStore } from "@lib/db/firebase";
import { GuildStore } from "@lib/db/firebase/firebase.interface";
import debug from "debug";
import { Message, Role } from "discord.js";
import firebase from "firebase-admin";
import R2PCommandHelper from "./helper";
import { ReadyToPlayCommandKeyList } from "./readytoplay.interface";
import R2P_RESPONSES from "./response";

const debugLog = debug("BotBoi:ReadyToPlay");

const r2pValidation = async (
  message: Message,
  db: firebase.database.Database,
): Promise<Role> => {
  const guildStore = (await getGuildStore(message.guild.id, db)) as GuildStore;
  if (!guildStore.data.readyToPlayStore.isActivated) {
    throw new Error(R2P_RESPONSES.R2P_ROLE_NOT_FOUND());
  }
  const r2pRoleID = guildStore.data.readyToPlayStore.readyToPlayRoleID;
  const r2pRole = message.guild.roles.find((role) => role.id === r2pRoleID);
  if (!r2pRole) {
    throw new Error(R2P_RESPONSES.R2P_ROLE_NOT_FOUND());
  }
  return r2pRole;
};

const addUserToRDPCommand: Command = {
  commandCallback: async (context, message: Message, query: string) => {
    try {
      const { db } = context;
      const r2pRole = await r2pValidation(message, db);
      const usersAdded: string[] = [];
      if (query) {
        for (const userObj of message.mentions.members) {
          const [_, user] = userObj;
          await user.addRole(r2pRole);
          usersAdded.push(user.id);
        }
      } else {
        await message.member.addRole(r2pRole);
        usersAdded.push(message.member.id);
      }
      message.channel.send(
        `${usersAdded.map((userID) => `<@${userID}>`).join(" ")} ${
          usersAdded.length > 1 ? "are" : "is"
        } now ${r2pRole}`,
      );
    } catch (err) {
      debugLog(err);
      await message.channel.send(
        R2PCommandHelper.errMessageResponse(err.message),
      );
    }
  },
  commandDescription: "add a mentioned users to Ready To Play role",
};

const removeUserFromRDPCommand: Command = {
  commandCallback: async (context, message: Message, query: string) => {
    try {
      const { db } = context;
      const r2pRole = await r2pValidation(message, db);
      const usersRemoved: string[] = [];
      if (query) {
        const removingMembers = message.mentions.members.filter(
          (member) => r2pRole.members.get(member.id) !== null,
        );
        for (const userObj of removingMembers) {
          const [_, user] = userObj;
          await user.removeRole(r2pRole);
          usersRemoved.push(user.displayName);
        }
      } else if (r2pRole.members.get(message.member.id)) {
        await message.member.removeRole(r2pRole);
        usersRemoved.push(message.member.displayName);
      }
      if (usersRemoved.length === 0) {
        return;
      }
      await message.channel.send(
        `${usersRemoved.join(" ")} ${
          usersRemoved.length > 1 ? "are" : "is"
        } now not Ready To Play`,
      );
    } catch (err) {
      debugLog(err);
      await message.channel.send(
        R2PCommandHelper.errMessageResponse(err.message),
      );
    }
  },
  commandDescription: "delete mentioned users from Ready To Play role",
};

const activateReadyToPlayFeature: Command = {
  commandCallback: async (context, message: Message) => {
    try {
      const { db } = context;
      // check if Ready To Play role have existed or not
      let readyToPlayRole: Role = message.guild.roles.find(
        (role) => role.name === "Ready To Play",
      );
      // if not, create the role
      if (!readyToPlayRole) {
        readyToPlayRole = await message.guild.createRole({
          name: "Ready To Play",
        });
      }
      readyToPlayRole.setMentionable(true);
      readyToPlayRole.setHoist(true);
      readyToPlayRole.setPermissions("SEND_MESSAGES");
      // update the role ID to database
      await updateGuildStore(
        {
          data: {
            readyToPlayStore: {
              isActivated: true,
              readyToPlayRoleID: readyToPlayRole.id,
            },
          },
          guildMetadata: {
            guildID: message.guild.id,
          },
        },
        db,
      );
      await message.channel.send(
        R2P_RESPONSES.R2P_ACTIVATED(readyToPlayRole.id),
      );
    } catch (err) {
      debugLog(err);
    }
  },
  commandDescription:
    "allow me to put members in channel on and off ReadyToPlay role",
};

export const r2pCommandKeyList: ReadyToPlayCommandKeyList = {
  ACTIVATE_RDP_FEATURE: "~activateRDPFeature",
  ADD_USER_TO_RDP: "~addUsersToRDP",
  REMOVE_USER_FROM_RDP: "~removeUsersFromRDP",
};

export default {
  [r2pCommandKeyList.ACTIVATE_RDP_FEATURE]: activateReadyToPlayFeature,
  [r2pCommandKeyList.ADD_USER_TO_RDP]: addUserToRDPCommand,
  [r2pCommandKeyList.REMOVE_USER_FROM_RDP]: removeUserFromRDPCommand,
} as CommandList;
