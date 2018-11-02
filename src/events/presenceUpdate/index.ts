import debug from "debug";
import { GuildMember, Message, TextChannel } from "discord.js";
import commandList, { COMMANDS } from "../../commands";
import { getGuildStore } from "../../lib/db/firebase";
import { GuildStore } from "../../lib/db/firebase/firebase.interface";
import { Event } from "../event.interface";

const debugLog = debug("BotBoi:onPresenceUpdateEvent");

const presenceUpdateEvent: Event = {
  eventActionCallback: (context) => async (
    _: GuildMember,
    newMember: GuildMember,
  ) => {
    debugLog("Presence Update triggered");
    try {
      const { db } = context;
      if (newMember.presence.status === "online") {
        return;
      }
      const guildStore = (await getGuildStore(
        newMember.guild.id,
        db,
      )) as GuildStore;
      if (!guildStore.data.readyToPlayStore.isActivated) {
        return;
      }
      await commandList[
        COMMANDS.READY_TO_PLAY.REMOVE_USER_FROM_RDP
      ].commandCallback(context, ({
        channel: newMember.guild.channels
          .filter((channel) => channel.type === "text")
          .array()[0] as TextChannel,
        guild: newMember.guild,
        member: newMember,
      } as unknown) as Message);
    } catch (err) {
      debugLog(err);
    }
  },
  eventName: "presenceUpdate",
};

export default presenceUpdateEvent;
