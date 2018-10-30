import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { Client, Collection, GuildMember, Message, Role } from "discord.js";
import dotenv from "dotenv";
import firebase from "firebase";
import readyToPlayCommand, {
  readyToPlayCommandKeyList,
} from "../../../src/commands/readytoplay";
import {
  getGuildStore,
  initGuildStore,
  updateGuildStore,
} from "../../../src/lib/db/firebase";
import { GuildStore } from "../../../src/lib/db/firebase/firebase.interface";

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

describe("Ready To Play Commands", () => {
  // firebase initialization
  const app = firebase.initializeApp(
    firebaseConfig,
    "ReadyToPlayCommandTestEnv",
  );
  const FireDB = app.database();
  before(async () => {
    await FireDB.goOnline();
  });
  describe("ActivateRDPFeature Command", () => {
    const client = new Client();
    it("should create role, configure and save that roleID to store if role is not existed", async () => {
      const mockRDPRoleID = "1";
      const mockGuildID = "12";
      const mockMessage = {
        channel: {
          send: (message) => {
            expect(message).to.be.a("string");
            expect(message).to.include(mockRDPRoleID);
          },
        },
        guild: {
          createRole: ({ name }) => ({
            id: mockRDPRoleID,
            name,
            setHoist: (isHoist) => {
              expect(isHoist).to.be.true;
            },
            setMentionable: (isMentionable) => {
              expect(isMentionable).to.be.true;
            },
            setPermissions: (permission) => {
              expect(permission).to.eql("SEND_MESSAGES");
            },
          }),
          id: mockGuildID,
          roles: new Collection(),
        },
      };
      await readyToPlayCommand[
        readyToPlayCommandKeyList.ACTIVATE_RDP_FEATURE
      ].commandCallback(
        client,
        FireDB,
        "",
        (mockMessage as unknown) as Message,
      );
      const guildStore = (await getGuildStore(
        mockGuildID,
        FireDB,
      )) as GuildStore;
      expect(guildStore.data.readyToPlayStore.readyToPlayRoleID).to.eql(
        mockRDPRoleID,
      );
    });
    it("should find role, reconfigure and save that roleID to store if role is already existed", async () => {
      const mockGuildID = "123124";
      const existedRole = {
        id: "12",
        name: "Ready To Play",
        setHoist: (isHoist) => {
          expect(isHoist).to.be.true;
        },
        setMentionable: (isMentionable) => {
          expect(isMentionable).to.be.true;
        },
        setPermissions: (permission) => {
          expect(permission).to.eql("SEND_MESSAGES");
        },
      };
      const existedRoles = new Collection<string, Role>();
      existedRoles.set(existedRole.id, (existedRole as unknown) as Role);
      const mockMessage = {
        channel: {
          send: (message) => {
            expect(message).to.be.a("string");
            expect(message).to.include(existedRole.id);
          },
        },
        guild: {
          id: mockGuildID,
          roles: existedRoles,
        },
      };
      await readyToPlayCommand[
        readyToPlayCommandKeyList.ACTIVATE_RDP_FEATURE
      ].commandCallback(
        client,
        FireDB,
        "",
        (mockMessage as unknown) as Message,
      );
      const guildStore = (await getGuildStore(
        mockGuildID,
        FireDB,
      )) as GuildStore;
      expect(guildStore).to.exist;
      expect(guildStore.data.readyToPlayStore.readyToPlayRoleID).to.eql(
        existedRole.id,
      );
    });
  });
  describe("addUsersToRDP Command", () => {
    const client = new Client();
    const mockGuildID = "123";
    const mockRDPID = "1234";
    beforeEach(async () => {
      await FireDB.ref("/").remove();
      await initGuildStore(mockGuildID, FireDB);
      await updateGuildStore(
        {
          data: {
            readyToPlayStore: {
              readyToPlayRoleID: mockRDPID,
            },
          },
          guildMetadata: {
            guildID: mockGuildID,
          },
        },
        FireDB,
      );
    });
    it("should ask activation if it could not find RDP role", async () => {
      const mockMessage = {
        channel: {
          send: (result) => {
            expect(result).to.eql(
              `You need to activate Ready To Play feature (\`${
                readyToPlayCommandKeyList.ACTIVATE_RDP_FEATURE
              }\`) for me to add you to the role!`,
            );
          },
        },
        guild: {
          id: mockGuildID,
          roles: new Collection(),
        },
      };
      await readyToPlayCommand[
        readyToPlayCommandKeyList.ADD_USER_TO_RDP
      ].commandCallback(
        client,
        FireDB,
        "",
        (mockMessage as unknown) as Message,
      );
    });
    it("should add mentioned users if query is not empty", async () => {
      const existedRoles = new Collection<string, Role>();
      const mockRDPRole = {
        id: mockRDPID,
      };
      existedRoles.set(mockRDPID, (mockRDPRole as unknown) as Role);
      const firstMentionedUser = {
        addRole: (role) => {
          expect(role).to.eql(mockRDPRole);
        },
        id: "123",
      };
      const secondMentionedUser = {
        addRole: (role) => {
          expect(role).to.eql(mockRDPRole);
        },
        id: "1234",
      };
      const members = new Collection<string, GuildMember>();
      members.set(
        firstMentionedUser.id,
        (firstMentionedUser as unknown) as GuildMember,
      );
      members.set(
        secondMentionedUser.id,
        (secondMentionedUser as unknown) as GuildMember,
      );
      const mockMessage = {
        channel: {
          send: (result) => {
            expect(result).to.be.a("string");
            expect(result).to.include(firstMentionedUser.id);
            expect(result).to.include(secondMentionedUser.id);
          },
        },
        guild: {
          id: mockGuildID,
          roles: existedRoles,
        },
        mentions: {
          members,
        },
      };
      await readyToPlayCommand[
        readyToPlayCommandKeyList.ADD_USER_TO_RDP
      ].commandCallback(
        client,
        FireDB,
        "foos",
        (mockMessage as unknown) as Message,
      );
    });
    it("should add message author if query is empty", async () => {
      const existedRoles = new Collection<string, Role>();
      const mockRDPRole = {
        id: mockRDPID,
      };
      existedRoles.set(mockRDPID, (mockRDPRole as unknown) as Role);
      const mentionedUser = {
        addRole: (role) => {
          expect(role).to.eql(mockRDPRole);
        },
        id: "123",
      };
      const mockMessage = {
        channel: {
          send: (result) => {
            expect(result).to.be.a("string");
            expect(result).to.include(mentionedUser.id);
          },
        },
        guild: {
          id: mockGuildID,
          roles: existedRoles,
        },
        member: mentionedUser,
      };
      await readyToPlayCommand[
        readyToPlayCommandKeyList.ADD_USER_TO_RDP
      ].commandCallback(
        client,
        FireDB,
        "",
        (mockMessage as unknown) as Message,
      );
    });
    it("should ask for permission if it can't assign users to query", async () => {
      const existedRoles = new Collection<string, Role>();
      const mockRDPRole = {
        id: mockRDPID,
      };
      existedRoles.set(mockRDPID, (mockRDPRole as unknown) as Role);
      const mentionedUser = {
        addRole: (role) => {
          throw new Error();
        },
        id: "123",
      };
      const mockMessage = {
        channel: {
          send: (result) => {
            expect(result).to.be.a("string");
            expect(result).to.include("Did not have permission");
          },
        },
        guild: {
          id: mockGuildID,
          roles: existedRoles,
        },
        member: mentionedUser,
      };
      await readyToPlayCommand[
        readyToPlayCommandKeyList.ADD_USER_TO_RDP
      ].commandCallback(
        client,
        FireDB,
        "",
        (mockMessage as unknown) as Message,
      );
    });
  });
  describe("removeUsersFromRDP Command", () => {
    const client = new Client();
    const mockGuildID = "123";
    const mockRDPID = "1234";
    beforeEach(async () => {
      await FireDB.ref("/").remove();
      await initGuildStore(mockGuildID, FireDB);
      await updateGuildStore(
        {
          data: {
            readyToPlayStore: {
              readyToPlayRoleID: mockRDPID,
            },
          },
          guildMetadata: {
            guildID: mockGuildID,
          },
        },
        FireDB,
      );
    });
    it("should ask activation if it could not find RDP role", async () => {
      const mockMessage = {
        channel: {
          send: (result) => {
            expect(result).to.eql(
              `You need to activate Ready To Play feature (\`${
                readyToPlayCommandKeyList.ACTIVATE_RDP_FEATURE
              }\`) for me to remove you from the role!`,
            );
          },
        },
        guild: {
          id: mockGuildID,
          roles: new Collection(),
        },
      };
      await readyToPlayCommand[
        readyToPlayCommandKeyList.REMOVE_USER_FROM_RDP
      ].commandCallback(
        client,
        FireDB,
        "",
        (mockMessage as unknown) as Message,
      );
    });
    it("should remove mentioned users if query is not empty", async () => {
      const existedRoles = new Collection<string, Role>();
      const mockRDPRole = {
        id: mockRDPID,
      };
      existedRoles.set(mockRDPID, (mockRDPRole as unknown) as Role);
      const firstMentionedUser = {
        displayName: "fus-ro-dah",
        id: "123",
        removeRole: (role) => {
          expect(role).to.eql(mockRDPRole);
        },
      };
      const secondMentionedUser = {
        displayName: "fus-ro-dah-2",
        id: "1234",
        removeRole: (role) => {
          expect(role).to.eql(mockRDPRole);
        },
      };
      const members = new Collection<string, GuildMember>();
      members.set(
        firstMentionedUser.id,
        (firstMentionedUser as unknown) as GuildMember,
      );
      members.set(
        secondMentionedUser.id,
        (secondMentionedUser as unknown) as GuildMember,
      );
      const mockMessage = {
        channel: {
          send: (result) => {
            expect(result).to.be.a("string");
            expect(result).to.include(firstMentionedUser.id);
            expect(result).to.include(secondMentionedUser.id);
          },
        },
        guild: {
          id: mockGuildID,
          roles: existedRoles,
        },
        mentions: {
          members,
        },
      };
      await readyToPlayCommand[
        readyToPlayCommandKeyList.REMOVE_USER_FROM_RDP
      ].commandCallback(
        client,
        FireDB,
        "foos",
        (mockMessage as unknown) as Message,
      );
    });
    it("should remove message author if query is empty", async () => {
      const existedRoles = new Collection<string, Role>();
      const mockRDPRole = {
        id: mockRDPID,
      };
      existedRoles.set(mockRDPID, (mockRDPRole as unknown) as Role);
      const mentionedUser = {
        displayName: "fus-ro-dah",
        id: "123",
        removeRole: (role) => {
          expect(role).to.eql(mockRDPRole);
        },
      };
      const mockMessage = {
        channel: {
          send: (result) => {
            expect(result).to.be.a("string");
            expect(result).to.include(mentionedUser.id);
          },
        },
        guild: {
          id: mockGuildID,
          roles: existedRoles,
        },
        member: mentionedUser,
      };
      await readyToPlayCommand[
        readyToPlayCommandKeyList.REMOVE_USER_FROM_RDP
      ].commandCallback(
        client,
        FireDB,
        "",
        (mockMessage as unknown) as Message,
      );
    });
    it("should ask for permission if it can't assign users to query", async () => {
      const existedRoles = new Collection<string, Role>();
      const mockRDPRole = {
        id: mockRDPID,
      };
      existedRoles.set(mockRDPID, (mockRDPRole as unknown) as Role);
      const mentionedUser = {
        id: "123",
        removeRole: (role) => {
          throw new Error();
        },
      };
      const mockMessage = {
        channel: {
          send: (result) => {
            expect(result).to.be.a("string");
            expect(result).to.include("Did not have permission");
          },
        },
        guild: {
          id: mockGuildID,
          roles: existedRoles,
        },
        member: mentionedUser,
      };
      await readyToPlayCommand[
        readyToPlayCommandKeyList.REMOVE_USER_FROM_RDP
      ].commandCallback(
        client,
        FireDB,
        "",
        (mockMessage as unknown) as Message,
      );
    });
  });
  after(async () => {
    await FireDB.goOffline();
    await app.delete();
  });
});
