import { expect } from "chai";
import { Client, Collection, GuildMember, Message, Role } from "discord.js";
import firebase from "firebase";
import fb from "firebase-admin";
import readyToPlayCommand, {
  r2pCommandKeyList,
} from "../../../src/commands/readytoplay";
import R2P_RESPONSE from "../../../src/commands/readytoplay/response";
import { FIREBASE_CONFIG } from "../../../src/config";
import {
  getGuildStore,
  initGuildStore,
  updateGuildStore,
} from "../../../src/lib/db/firebase";
import { GuildStore } from "../../../src/lib/db/firebase/firebase.interface";

describe("Ready To Play Commands", () => {
  // firebase initialization
  const app = firebase.initializeApp(
    FIREBASE_CONFIG,
    "ReadyToPlayCommandTestEnv",
  );
  const FireDB = (app.database() as unknown) as fb.database.Database;
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
        r2pCommandKeyList.ACTIVATE_RDP_FEATURE
      ].commandCallback(
        {
          client,
          db: FireDB,
        },
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
        r2pCommandKeyList.ACTIVATE_RDP_FEATURE
      ].commandCallback(
        {
          client,
          db: FireDB,
        },
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
    it("should do nothing if an error occur", async () => {
      await readyToPlayCommand[
        r2pCommandKeyList.ACTIVATE_RDP_FEATURE
      ].commandCallback(
        {
          client,
          db: FireDB,
        },
        ({} as unknown) as Message,
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
    });
    it("should ask activation if R2P is not activated", async () => {
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
      const mockMessage = {
        channel: {
          send: (result) => {
            expect(result).to.eql(R2P_RESPONSE.R2P_ROLE_NOT_FOUND());
          },
        },
        guild: {
          id: mockGuildID,
          roles: new Collection(),
        },
      };
      await readyToPlayCommand[
        r2pCommandKeyList.ADD_USER_TO_RDP
      ].commandCallback(
        {
          client,
          db: FireDB,
        },
        (mockMessage as unknown) as Message,
      );
    });
    it("should ask activation if it could not find RDP role", async () => {
      const mockMessage = {
        channel: {
          send: (result) => {
            expect(result).to.eql(R2P_RESPONSE.R2P_ROLE_NOT_FOUND());
          },
        },
        guild: {
          id: mockGuildID,
          roles: new Collection(),
        },
      };
      await readyToPlayCommand[
        r2pCommandKeyList.ADD_USER_TO_RDP
      ].commandCallback(
        {
          client,
          db: FireDB,
        },
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
        r2pCommandKeyList.ADD_USER_TO_RDP
      ].commandCallback(
        {
          client,
          db: FireDB,
        },
        (mockMessage as unknown) as Message,
        "foos",
      );
    });
    it("should add message author if query is empty", async () => {
      const existedRoles = new Collection<string, Role>();
      const mockRDPRole = {
        id: mockRDPID,
        members: new Collection<string, GuildMember>(),
      };
      existedRoles.set(mockRDPID, (mockRDPRole as unknown) as Role);
      const mentionedUser = {
        addRole: (role) => {
          expect(role).to.eql(mockRDPRole);
        },
        id: "123",
      };
      mockRDPRole.members.set(
        mentionedUser.id,
        (mentionedUser as unknown) as GuildMember,
      );
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
        r2pCommandKeyList.ADD_USER_TO_RDP
      ].commandCallback(
        {
          client,
          db: FireDB,
        },
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
          throw new Error("Missing Permissions");
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
        r2pCommandKeyList.ADD_USER_TO_RDP
      ].commandCallback(
        {
          client,
          db: FireDB,
        },
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
    });
    it("should ask activation if R2P is not activated", async () => {
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
      const mockMessage = {
        channel: {
          send: (result) => {
            expect(result).to.eql(R2P_RESPONSE.R2P_ROLE_NOT_FOUND());
          },
        },
        guild: {
          id: mockGuildID,
          roles: new Collection(),
        },
      };
      await readyToPlayCommand[
        r2pCommandKeyList.REMOVE_USER_FROM_RDP
      ].commandCallback(
        {
          client,
          db: FireDB,
        },
        (mockMessage as unknown) as Message,
      );
    });
    it("should ask activation if it could not find RDP role", async () => {
      const mockMessage = {
        channel: {
          send: (result) => {
            expect(result).to.eql(R2P_RESPONSE.R2P_ROLE_NOT_FOUND());
          },
        },
        guild: {
          id: mockGuildID,
          roles: new Collection(),
        },
      };
      await readyToPlayCommand[
        r2pCommandKeyList.REMOVE_USER_FROM_RDP
      ].commandCallback(
        {
          client,
          db: FireDB,
        },
        (mockMessage as unknown) as Message,
      );
    });
    it("should try to remove mentioned users if query is not empty", async () => {
      const existedRoles = new Collection<string, Role>();
      const mockRDPRole = {
        id: mockRDPID,
        members: new Collection<string, GuildMember>(),
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
      mockRDPRole.members.set(
        firstMentionedUser.id,
        (firstMentionedUser as unknown) as GuildMember,
      );
      mockRDPRole.members.set(
        secondMentionedUser.id,
        (secondMentionedUser as unknown) as GuildMember,
      );
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
        r2pCommandKeyList.REMOVE_USER_FROM_RDP
      ].commandCallback(
        {
          client,
          db: FireDB,
        },
        (mockMessage as unknown) as Message,
        "foos",
      );
    });
    it("should remove message author if query is empty", async () => {
      const existedRoles = new Collection<string, Role>();
      const mockRDPRole = {
        id: mockRDPID,
        members: new Collection<string, GuildMember>(),
      };
      existedRoles.set(mockRDPID, (mockRDPRole as unknown) as Role);
      const mentionedUser = {
        displayName: "fus-ro-dah",
        id: "123",
        removeRole: (role) => {
          expect(role).to.eql(mockRDPRole);
        },
      };
      mockRDPRole.members.set(
        mentionedUser.id,
        (mentionedUser as unknown) as GuildMember,
      );
      const mockMessage = {
        channel: {
          send: (result) => {
            expect(result).to.be.a("string");
          },
        },
        guild: {
          id: mockGuildID,
          roles: existedRoles,
        },
        member: mentionedUser,
      };
      await readyToPlayCommand[
        r2pCommandKeyList.REMOVE_USER_FROM_RDP
      ].commandCallback(
        { client, db: FireDB },
        (mockMessage as unknown) as Message,
      );
    });
    it("should say nothing if mentioned member/author were not in r2p role", async () => {
      const existedRoles = new Collection<string, Role>();
      const mockRDPRole = {
        id: mockRDPID,
        members: new Collection<string, GuildMember>(),
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
          },
        },
        guild: {
          id: mockGuildID,
          roles: existedRoles,
        },
        member: mentionedUser,
      };
      await readyToPlayCommand[
        r2pCommandKeyList.REMOVE_USER_FROM_RDP
      ].commandCallback(
        { client, db: FireDB },
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
          },
        },
        guild: {
          id: mockGuildID,
          roles: existedRoles,
        },
        member: mentionedUser,
      };
      await readyToPlayCommand[
        r2pCommandKeyList.REMOVE_USER_FROM_RDP
      ].commandCallback(
        {
          client,
          db: FireDB,
        },
        (mockMessage as unknown) as Message,
      );
    });
  });
  after(async () => {
    await FireDB.goOffline();
    await app.delete();
  });
});
