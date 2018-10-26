import chai, { expect } from "chai";
import chaiPromise from "chai-as-promised";
import debug from "debug";
import dotenv from "dotenv";
import firebase from "firebase";
import sinon from "sinon";
import FireDB, {
  DEFAULT_BASE_STORE,
  DEFAULT_GUILD_STORE,
  getBaseStore,
  getGuildStore,
  initGuildStore,
  updateGuildStore,
} from "../../../../src/lib/db/firebase";
import {
  GuildStore,
  GuildStoreInput,
} from "../../../../src/lib/db/firebase/firebase.interface";
dotenv.config();

chai.use(chaiPromise);

const debugLog = debug("BotBoi:FirebaseTest");

describe("Firebase DB Store", () => {
  describe("BaseStore", () => {
    describe("Retriving data from BaseStore", () => {
      beforeEach(async () => {
        await FireDB.ref("/").remove();
      });
      it("should return everything in BaseStore", async () => {
        const expectedData = {
          guilds: {
            test: "foo",
          },
        };
        await FireDB.ref("/").set(expectedData);
        const dataFromStore = await getBaseStore();
        expect(dataFromStore).to.eql(expectedData);
      });
      it("should return everything in BaseStore as format", async () => {
        const expectedData = {
          foo: "bar",
        };
        await FireDB.ref("/").set(expectedData);
        const dataFromStore = await getBaseStore();
        expect(dataFromStore).to.eql(DEFAULT_BASE_STORE);
      });
      it("should return default BaseStore if the database is empty", async () => {
        const dataFromStore = await getBaseStore();
        expect(dataFromStore).to.eql(DEFAULT_BASE_STORE);
      });
      it("should throw error if something wrong occur", async () => {
        sinon.stub(FireDB, "ref").throws();
        expect(getBaseStore()).to.eventually.be.rejected;
      });
      after(() => {
        sinon.restore();
      });
    });
  });
  describe("GuildStore", () => {
    const existingGuildStore: GuildStore = {
      data: {
        rule34Store: {
          recurringNSFWChannelID: "12354",
          rule34Keywords: [],
        },
      },
      guildMetadata: {
        guildID: "123",
      },
    };
    const nonExistingGuildStoreID = "4124";
    beforeEach(async () => {
      await FireDB.ref("/").remove();
      await FireDB.ref(
        `/guilds/${existingGuildStore.guildMetadata.guildID}`,
      ).set(existingGuildStore);
    });
    describe("Retriving data from GuildStore", () => {
      it("should return guild store if it found one", async () => {
        const dataFromStore = await getGuildStore(
          existingGuildStore.guildMetadata.guildID,
        );
        expect(dataFromStore).to.eql(existingGuildStore);
      });
      it("should return undefined if it couldn't find existing guild store", async () => {
        const dataFromStore = await getGuildStore(nonExistingGuildStoreID);
        expect(dataFromStore).to.be.null;
      });
      it("should throw error if something wrong occur", async () => {
        sinon.stub(FireDB, "ref").throws();
        expect(getGuildStore(nonExistingGuildStoreID)).to.eventually.be
          .rejected;
      });
      after(() => {
        sinon.restore();
      });
    });
    describe("Initialzing data from GuildStore", () => {
      it("should initialize and return newly initialized data", async () => {
        const dataFromStore = await initGuildStore(nonExistingGuildStoreID);
        expect(dataFromStore).to.eql({
          ...DEFAULT_GUILD_STORE,
          guildMetadata: {
            guildID: nonExistingGuildStoreID,
          },
        });
      });
      it("should throw error if something wrong occur", async () => {
        sinon.stub(FireDB, "ref").throws();
        expect(initGuildStore(nonExistingGuildStoreID)).to.eventually.be
          .rejected;
      });
      after(() => {
        sinon.restore();
      });
    });
    describe("Updating data in GuildStore", () => {
      it("should update guild store and return updated data", async () => {
        const dataToUpdate: GuildStoreInput = {
          data: {
            rule34Store: {
              recurringNSFWChannelID: "123124",
              rule34Keywords: [],
            },
          },
          guildMetadata: {
            guildID: "4124",
          },
        };
        const dataFromStore = await updateGuildStore(dataToUpdate);
        expect(dataFromStore).to.eql({
          ...DEFAULT_GUILD_STORE,
          guildMetadata: {
            guildID: nonExistingGuildStoreID,
          },
          ...dataToUpdate,
        });
      });
      it("should throw error if something wrong occur", async () => {
        sinon.stub(FireDB, "ref").throws();
        expect(updateGuildStore(({} as unknown) as GuildStore)).to.eventually.be
          .rejected;
      });
      after(() => {
        sinon.restore();
      });
    });
    after(async () => {
      await FireDB.ref("/").remove();
    });
  });
  after(() => {
    FireDB.goOffline();
  });
});
