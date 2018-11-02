import { expect } from "chai";
import {
  Channel,
  Client,
  Collection,
  GuildMember,
  Role,
  TextChannel,
} from "discord.js";
import firebase from "firebase";
import fb from "firebase-admin";
import { FIREBASE_CONFIG } from "../../../src/config";
import presenceUpdateEvent from "../../../src/events/presenceUpdate";
import { initGuildStore, updateGuildStore } from "../../../src/lib/db/firebase";

describe("PresenceUpdate Event", () => {
  // firebase initialization
  const app = firebase.initializeApp(
    FIREBASE_CONFIG,
    "PresenceUpdateEventTestEnv",
  );
  const FireDB = (app.database() as unknown) as fb.database.Database;
  const client = new Client();
  const mockGuildID = "1123";
  before(async () => {
    await FireDB.goOnline();
  });
  beforeEach(async () => {
    await FireDB.ref("/").remove();
  });
  it("should do nothing if new presence of user is online", async () => {
    await presenceUpdateEvent.eventActionCallback({ client, db: FireDB })(
      ({} as unknown) as GuildMember,
      {
        presence: { status: "online" },
      },
    );
  });
  it("should do nothing when user become idle/offline/dnd but RDP feature is not activated", async () => {
    await initGuildStore(mockGuildID, FireDB);
    await updateGuildStore(
      {
        data: {
          readyToPlayStore: {
            isActivated: false,
          },
        },
        guildMetadata: {
          guildID: mockGuildID,
        },
      },
      FireDB,
    );
    await presenceUpdateEvent.eventActionCallback({ client, db: FireDB })(
      ({} as unknown) as GuildMember,
      {
        guild: {
          id: mockGuildID,
        },
        presence: { status: "idle" },
      },
    );
  });
  it("should remove try to user from RDP if user become idle/offline/dnd and RDP feature is activated", async () => {
    const mockRDPID = "f1231234";
    const mockRDPRole = {
      id: mockRDPID,
      members: new Collection<string, GuildMember>(),
    };
    const mockDefaultChannel = {
      id: "12-49012",
      send: (result) => {
        expect(result).to.include(mockNewMember.displayName);
      },
      type: "text",
    };
    await initGuildStore(mockGuildID, FireDB);
    await updateGuildStore(
      {
        data: {
          readyToPlayStore: {
            isActivated: true,
            readyToPlayRoleID: mockRDPID,
          },
        },
        guildMetadata: {
          guildID: mockGuildID,
        },
      },
      FireDB,
    );
    const existedRoles = new Collection<string, Role>();
    existedRoles.set(mockRDPRole.id, (mockRDPRole as unknown) as Role);
    const channels = new Collection<string, Channel>();
    channels.set(
      mockDefaultChannel.id,
      (mockDefaultChannel as unknown) as TextChannel,
    );
    const mockNewMember = {
      displayName: "foos",
      guild: {
        channels,
        id: mockGuildID,
        roles: existedRoles,
      },
      id: "bars",
      presence: { status: "idle" },
      removeRole: (role) => {
        expect(role).to.eql(mockRDPRole);
      },
    };
    mockRDPRole.members.set(
      mockNewMember.id,
      (mockNewMember as unknown) as GuildMember,
    );
    await presenceUpdateEvent.eventActionCallback({ client, db: FireDB })(
      ({} as unknown) as GuildMember,
      mockNewMember,
    );
  });
  it("should do nothing if an error occured", async () => {
    await presenceUpdateEvent.eventActionCallback({ client, db: FireDB })(
      ({} as unknown) as GuildMember,
      ({} as unknown) as GuildMember,
    );
  });
  after(async () => {
    await FireDB.goOffline();
    await app.delete();
    await client.destroy();
  });
});
