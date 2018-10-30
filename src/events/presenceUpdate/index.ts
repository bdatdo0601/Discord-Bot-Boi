import debug from "debug";
import { Client, GuildMember, TextChannel } from "discord.js";
import commandList, { COMMANDS } from "../../commands";
import { getGuildStore } from "../../lib/db/firebase";
import { GuildStore } from "../../lib/db/firebase/firebase.interface";
import { Event } from "../event.interface";

const debugLog = debug("BotBoi:onPresenceUpdateEvent");

const presenceUpdateEvent: Event = {
  eventActionCallback: (
    client: Client,
    db: firebase.database.Database,
  ) => async (oldMember: GuildMember, newMember: GuildMember) => {
    debugLog("Presence Update triggered");
    if (newMember.presence.status !== "online") {
      const guildStore = (await getGuildStore(
        newMember.guild.id,
        db,
      )) as GuildStore;
      if (guildStore.data.readyToPlayStore.isActivated) {
        await commandList[
          COMMANDS.READY_TO_PLAY.REMOVE_USER_FROM_RDP
        ].commandCallback(client, db, "", {
          channel: newMember.guild.channels
            .filter((channel) => channel.type === "text")
            .array()[0] as TextChannel,
          guild: newMember.guild,
          member: newMember,
        });
      }
    }
  },
  eventName: "presenceUpdate",
};

export default presenceUpdateEvent;
