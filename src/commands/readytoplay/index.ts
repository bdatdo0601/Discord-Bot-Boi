import debug from "debug";
import { Client, Guild, Message, Role } from "discord.js";
import firebase from "firebase";
import { getGuildStore, updateGuildStore } from "../../lib/db/firebase";
import { GuildStore } from "../../lib/db/firebase/firebase.interface";
import { Command } from "../command.interface";
import {
  ReadyToPlayCommandKeyList,
  ReadyToPlayCommandList,
} from "./readytoplay.interface";

const debugLog = debug("BotBoi:ReadyToPlay");

const addUserToRDPCommand: Command = {
  commandCallback: async (
    client: Client,
    db: firebase.database.Database,
    query: string,
    message: Message,
  ) => {
    debugLog("adding users to RDP");
    const readyToPlayRoleID = ((await getGuildStore(
      message.guild.id,
      db,
    )) as GuildStore).data.readyToPlayStore.readyToPlayRoleID;
    const readyToPlayRole = message.guild.roles.find(
      (role) => role.id === readyToPlayRoleID,
    );
    if (!readyToPlayRole) {
      message.channel.send(
        `You need to activate Ready To Play feature (\`${
          readyToPlayCommandKeyList.ACTIVATE_RDP_FEATURE
        }\`) for me to add you to the role!`,
      );
    } else {
      try {
        const usersAdded: string[] = [];
        if (query) {
          for (const userObj of message.mentions.members) {
            const [_, user] = userObj;
            await user.addRole(readyToPlayRole);
            usersAdded.push(user.id);
          }
        } else {
          await message.member.addRole(readyToPlayRole);
          usersAdded.push(message.member.id);
        }
        message.channel.send(
          `${usersAdded.map((userID) => `<@${userID}>`).join(" ")} ${
            usersAdded.length > 1 ? "are" : "is"
          } now <@&${readyToPlayRoleID}>`,
        );
      } catch (err) {
        debugLog(err);
        await message.channel
          .send(`Did not have permission to add you to <@&${readyToPlayRoleID}>
        *give me permission by place me in a role that is higher in the list from that role*`);
      }
    }
  },
  commandDescription: "add a mentioned users to Ready To Play role",
};

const removeUserFromRDPCommand: Command = {
  commandCallback: async (
    client: Client,
    db: firebase.database.Database,
    query: string,
    message: Message,
  ) => {
    debugLog("removing users from RDP");
    const readyToPlayRoleID = ((await getGuildStore(
      message.guild.id,
      db,
    )) as GuildStore).data.readyToPlayStore.readyToPlayRoleID;
    const readyToPlayRole = message.guild.roles.find(
      (role) => role.id === readyToPlayRoleID,
    );
    if (!readyToPlayRole) {
      message.channel.send(
        `You need to activate Ready To Play feature (\`${
          readyToPlayCommandKeyList.ACTIVATE_RDP_FEATURE
        }\`) for me to remove you from the role!`,
      );
    } else {
      try {
        const usersAdded: string[] = [];
        if (query) {
          for (const userObj of message.mentions.members) {
            const [_, user] = userObj;
            await user.removeRole(readyToPlayRole);
            usersAdded.push(user.displayName);
          }
        } else {
          await message.member.removeRole(readyToPlayRole);
          usersAdded.push(message.member.displayName);
        }
        message.channel.send(
          `${usersAdded.join(" ")} ${
            usersAdded.length > 1 ? "are" : "is"
          } now not <@&${readyToPlayRoleID}>`,
        );
      } catch (err) {
        debugLog(err);
        await message.channel
          .send(`Did not have permission to remove you to <@&${readyToPlayRoleID}>
        *give me permission by place me in a role that is higher in the list from that role*`);
      }
    }
  },
  commandDescription: "delete mentioned users from Ready To Play role",
};

const activateReadyToPlayFeature: Command = {
  commandCallback: async (
    client: Client,
    db: firebase.database.Database,
    query: string,
    message: Message,
  ) => {
    debugLog("enable RDP function");
    // check if Ready To Play role have existed or not
    let readyToPlayRole: Role = message.guild.roles.find(
      (role) => role.name === "Ready To Play",
    );
    // if not, create the role
    if (!readyToPlayRole) {
      readyToPlayRole = await message.guild.createRole({
        mentionable: true,
        name: "Ready To Play",
      });
    }
    readyToPlayRole.setHoist(true);
    readyToPlayRole.setPermissions("SEND_MESSAGES");
    // update the role ID to database
    await updateGuildStore(
      {
        data: {
          readyToPlayStore: {
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
      `<@&${
        readyToPlayRole.id
      }> feature is activated! users will be added on and taken off automatically
      *you can also manually put yourself in and out manually*`,
    );
    debugLog("Finished Activation");
  },
  commandDescription:
    "allow me to put members in channel on and off ReadyToPlay role",
};

export const readyToPlayCommandKeyList: ReadyToPlayCommandKeyList = {
  ACTIVATE_RDP_FEATURE: "~activateRDPFeature",
  ADD_USER_TO_RDP: "~addUsersToRDP",
  REMOVE_USER_FROM_RDP: "~removeUsersFromRDP",
};

export default {
  [readyToPlayCommandKeyList.ACTIVATE_RDP_FEATURE]: activateReadyToPlayFeature,
  [readyToPlayCommandKeyList.ADD_USER_TO_RDP]: addUserToRDPCommand,
  [readyToPlayCommandKeyList.REMOVE_USER_FROM_RDP]: removeUserFromRDPCommand,
} as ReadyToPlayCommandList;
