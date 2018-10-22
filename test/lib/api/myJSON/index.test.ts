import axios from "axios";
import chai, { expect } from "chai";
import chaiLike from "chai-like";
import MyJSONAPI from "../../../../src/lib/api/myJson";
import {
  BaseJSONStore,
  BaseJSONStoreInput,
  GuildBaseJSONStore,
  GuildBaseJSONStoreData,
  GuildBaseJSONStoreInput,
  InitGuildBaseJSONStoreResponse,
} from "../../../../src/lib/api/myJson/myJson.interface";
import Util from "../../../../src/lib/util";

chai.use(chaiLike);

const configOptions = {
  headers: {
    "Content-type": "application/json",
  },
};

describe("MyJSON API Functionalities", () => {
  const initBaseStoreData: BaseJSONStore = {
    guildStores: [],
  };
  let binID = "";
  before(async () => {
    const response = await axios.post<InitGuildBaseJSONStoreResponse>(
      `https://api.myjson.com/bins`,
      {},
      configOptions,
    );
    binID = response.data.uri.split("/")[4];
    MyJSONAPI.setNewBaseStoreID(binID);
  });
  describe("Base Store Functions", () => {
    describe("Initialization", () => {
      it("should return base store with empty data", async () => {
        const data = await MyJSONAPI.initBaseStore();
        expect(data).to.eql(initBaseStoreData);
      });
    });
    describe("Update", () => {
      const validMockData: BaseJSONStoreInput[] = [
        {},
        {
          guildStores: [{ guildID: "foo", storeURL: "bar" }],
        },
        {
          guildStores: [{ guildID: "baz", storeURL: "bas" }],
        },
      ];
      validMockData.forEach((testCase) => {
        let previousData = initBaseStoreData;
        it("should returned updated data", async () => {
          const data = await MyJSONAPI.updateBaseStore(testCase);
          const expectedData = {
            ...previousData,
            ...testCase,
          };
          expect(data).to.eql(expectedData);
          previousData = expectedData;
        });
      });
    });
    describe("Retrieval", () => {
      it("should get lastest data", async () => {
        const originalData = await MyJSONAPI.getBaseStore();
        expect(originalData).to.be.an("object");
        const updatedData: BaseJSONStoreInput = {
          guildStores: [{ guildID: "124", storeURL: "124" }],
        };
        await MyJSONAPI.updateBaseStore(updatedData);
        const newData = await MyJSONAPI.getBaseStore();
        expect(newData).to.eql({
          ...originalData,
          ...updatedData,
        });
      });
      it("should initialize data if the returned format is corrupted", async () => {
        await axios.put(
          `https://api.myjson.com/bins/${binID}`,
          {},
          configOptions,
        );
        const data = await MyJSONAPI.getBaseStore();
        expect(data).to.eql(initBaseStoreData);
      });
    });
    after(async () => {
      await MyJSONAPI.initBaseStore();
    });
  });
  describe("Guild Store Functions", () => {
    const validGuildStoreIDs: string[] = ["bar", "bas"];
    const initGuildStoreData: GuildBaseJSONStoreInput = {
      rule34Store: {
        rule34Keywords: [],
      },
    };
    describe("Initialization", () => {
      validGuildStoreIDs.forEach((testCase) => {
        it("should create guild store", async () => {
          const guildBaseStore = (await MyJSONAPI.initGuildBaseJSONStore(
            testCase,
          )) as GuildBaseJSONStore;
          expect(guildBaseStore.data).to.be.eql(initGuildStoreData);
        });
      });
      validGuildStoreIDs.forEach((testCase) => {
        it("should overwrite and init guild store if already exist", async () => {
          const guildBaseStore = (await MyJSONAPI.initGuildBaseJSONStore(
            testCase,
            initGuildStoreData,
          )) as GuildBaseJSONStore;
          expect(guildBaseStore.data).to.be.eql(initGuildStoreData);
        });
      });
    });
    describe("Update", () => {
      const validGuildStoreIDsForUpdate: string[] = [
        Util.getRandomElementFromArray(validGuildStoreIDs),
        "foos",
      ];
      const updatedData: GuildBaseJSONStoreInput = {
        rule34Store: {
          rule34Keywords: [
            {
              source: "rule34xxx",
              word: "pokemon",
            },
          ],
        },
      };
      validGuildStoreIDsForUpdate.forEach((testCase) => {
        it("should update (or create update if does not exist) and return new data", async () => {
          const guildBaseStore = (await MyJSONAPI.updateGuildBaseJSONStore(
            testCase,
            updatedData,
          )) as GuildBaseJSONStore;
          const expectedData: GuildBaseJSONStoreInput = {
            ...initGuildStoreData,
            ...updatedData,
          };
          expect(guildBaseStore.data).to.be.eql(expectedData);
        });
      });
    });
    describe("Retrieval", () => {
      const nonExistGuildID: string[] = ["asd", "asfa"];
      validGuildStoreIDs.forEach((testCase) => {
        it("should retrieve data if it exists", async () => {
          const guildBaseStore = (await MyJSONAPI.getGuildBaseJSONStore(
            testCase,
          )) as GuildBaseJSONStore;
          expect(guildBaseStore.guildStore.guildID).to.equals(testCase);
        });
      });
      nonExistGuildID.forEach((testCase) => {
        it("should return undefined if it does not exist", async () => {
          const guildBaseStore = await MyJSONAPI.getGuildBaseJSONStore(
            testCase,
          );
          expect(guildBaseStore).to.be.undefined;
        });
      });
    });
  });
});
