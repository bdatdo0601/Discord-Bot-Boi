import chai, { expect } from "chai";
import chaiPromise from "chai-as-promised";
import debug from "debug";
import dotenv from "dotenv";
import firebase from "firebase";
import fb from "firebase-admin";
import sinon from "sinon";
import {
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

// firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: `${process.env.FIREBASE_AUTH_DOMAIN}.firebaseapp.com`,
  databaseURL: `https://${process.env.FIREBASE_DB_NAME}.firebaseio.com`,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: `${process.env.FIREBASE_STORAGE_BUCKET}.appspot.com`,
};

describe("Firebase DB Store", () => {
  // firebase initialization
  const app = firebase.initializeApp(firebaseConfig, "FirebaseUtilityTestEnv");
  const FireDB = (app.database() as unknown) as fb.database.Database;
  before(async () => {
    await FireDB.goOnline();
  });
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
        const dataFromStore = await getBaseStore(FireDB);
        expect(dataFromStore).to.eql(expectedData);
      });
      it("should return everything in BaseStore as format", async () => {
        const expectedData = {
          foo: "bar",
        };
        await FireDB.ref("/").set(expectedData);
        const dataFromStore = await getBaseStore(FireDB);
        expect(dataFromStore).to.eql(DEFAULT_BASE_STORE);
      });
      it("should return default BaseStore if the database is empty", async () => {
        const dataFromStore = await getBaseStore(FireDB);
        expect(dataFromStore).to.eql(DEFAULT_BASE_STORE);
      });
      it("should throw error if something wrong occur", async () => {
        sinon.stub(FireDB, "ref").throws();
        expect(getBaseStore(FireDB)).to.eventually.be.rejected;
      });
      after(() => {
        sinon.restore();
      });
    });
  });
  describe("GuildStore", () => {
    const existingGuildStore: GuildStore = {
      data: {
        googleStore: {
          calendarID: "",
        },
        readyToPlayStore: {
          isActivated: false,
          readyToPlayRoleID: "",
        },
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
          FireDB,
        );
        expect(dataFromStore).to.eql(existingGuildStore);
      });
      it("should return undefined if it couldn't find existing guild store", async () => {
        const dataFromStore = await getGuildStore(
          nonExistingGuildStoreID,
          FireDB,
        );
        expect(dataFromStore).to.be.null;
      });
      it("should throw error if something wrong occur", async () => {
        sinon.stub(FireDB, "ref").throws();
        expect(getGuildStore(nonExistingGuildStoreID, FireDB)).to.eventually.be
          .rejected;
      });
      after(() => {
        sinon.restore();
      });
    });
    describe("Initialzing data from GuildStore", () => {
      it("should initialize and return newly initialized data", async () => {
        const dataFromStore = await initGuildStore(
          nonExistingGuildStoreID,
          FireDB,
        );
        expect(dataFromStore).to.eql({
          ...DEFAULT_GUILD_STORE,
          guildMetadata: {
            guildID: nonExistingGuildStoreID,
          },
        });
      });
      it("should throw error if something wrong occur", async () => {
        sinon.stub(FireDB, "ref").throws();
        expect(initGuildStore(nonExistingGuildStoreID, FireDB)).to.eventually.be
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
        const dataFromStore = await updateGuildStore(dataToUpdate, FireDB);
        expect(dataFromStore).to.eql({
          data: {
            ...DEFAULT_GUILD_STORE.data,
            ...dataToUpdate.data,
          },
          guildMetadata: {
            guildID: nonExistingGuildStoreID,
          },
        });
      });
      it("should throw error if something wrong occur", async () => {
        sinon.stub(FireDB, "ref").throws();
        expect(updateGuildStore(({} as unknown) as GuildStore, FireDB)).to
          .eventually.be.rejected;
      });
      after(() => {
        sinon.restore();
      });
    });
    after(async () => {
      await FireDB.ref("/").remove();
    });
  });
  after(async () => {
    await FireDB.goOffline();
    await app.delete();
  });
});
