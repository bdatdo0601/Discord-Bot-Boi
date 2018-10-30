import { expect } from "chai";
import {
  Channel,
  Client,
  Collection,
  GuildMember,
  Role,
  TextChannel,
} from "discord.js";
import dotenv from "dotenv";
import firebase from "firebase";
import presenceUpdateEvent from "../../../src/events/presenceUpdate";
import { initGuildStore, updateGuildStore } from "../../../src/lib/db/firebase";
dotenv.config();

// firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: `${process.env.FIREBASE_AUTH_DOMAIN}.firebaseapp.com`,
  databaseURL: `https://${process.env.FIREBASE_DB_NAME}.firebaseio.com`,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: `${process.env.FIREBASE_STORAGE_BUCKET}.appspot.com`,
};

describe("PresenceUpdate Event", () => {
  // firebase initialization
  const app = firebase.initializeApp(
    firebaseConfig,
    "PresenceUpdateEventTestEnv",
  );
  const FireDB = app.database();
  const client = new Client();
  const mockGuildID = "1123";
  before(async () => {
    await FireDB.goOnline();
  });
  beforeEach(async () => {
    await FireDB.ref("/").remove();
  });
  it("should do nothing if new presence of user is online", async () => {
    await presenceUpdateEvent.eventActionCallback(client, FireDB)(
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
    await presenceUpdateEvent.eventActionCallback(client, FireDB)(
      ({} as unknown) as GuildMember,
      {
        guild: {
          id: mockGuildID,
        },
        presence: { status: "idle" },
      },
    );
  });
  it("should remove user from RDP if user become idle/offline/dnd and RDP feature is activated", async () => {
    const mockRDPID = "f1231234";
    const mockRDPRole = {
      id: mockRDPID,
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
    await presenceUpdateEvent.eventActionCallback(client, FireDB)(
      ({} as unknown) as GuildMember,
      mockNewMember,
    );
  });
  after(async () => {
    await FireDB.goOffline();
    await app.delete();
    await client.destroy();
  });
});
