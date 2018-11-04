import { expect } from "chai";
import { Client, Message } from "discord.js";
import firebase, { ServiceAccount } from "firebase-admin";
import referendumCommandList, {
  referendumCommandKeyList,
} from "../../../src/commands/referendum";
import REFERENDUM_RESPONSE from "../../../src/commands/referendum/response";
import { FIREBASE_CONFIG, GOOGLE_CONFIG } from "../../../src/config";

describe("Referendum Commands", () => {
  // firebase initialization
  const app = firebase.initializeApp(
    {
      credential: firebase.credential.cert(GOOGLE_CONFIG as ServiceAccount),
      databaseURL: FIREBASE_CONFIG.databaseURL,
    },
    "ReferendumCommandTestEnv",
  );
  const db = app.database();
  const client = new Client();
  const mockAuthorID = "123";
  const mockVoteOptions = ["1", "2", "3"];
  const mockPollingMessage = {
    author: {
      id: mockAuthorID,
    },
    channel: {
      send: (result) => {
        expect(result).to.be.a("string");
        expect(result).to.include(mockAuthorID);
        mockVoteOptions.forEach((voteOption) => {
          expect(result).to.include(voteOption);
        });
      },
    },
  };

  before(async () => {
    await db.goOnline();
  });
  describe("~poll command", () => {
    it("should create a poll if no poll were created", async () => {
      await referendumCommandList[
        referendumCommandKeyList.REFERENDUM_POLL
      ].commandCallback(
        { client, db },
        (mockPollingMessage as unknown) as Message,
        mockVoteOptions.join(","),
      );
    });
    it("should notify if another poll is already existed", async () => {
      const mockMessage = {
        reply: (result) => {
          expect(result).to.eql(REFERENDUM_RESPONSE.POLL_ALREADY_EXIST());
        },
      };
      await referendumCommandList[
        referendumCommandKeyList.REFERENDUM_POLL
      ].commandCallback(
        { client, db },
        (mockMessage as unknown) as Message,
        mockVoteOptions.join(","),
      );
    });
    it("should do nothing if an error occur", async () => {
      await referendumCommandList[
        referendumCommandKeyList.REFERENDUM_POLL
      ].commandCallback(
        { client, db },
        ({} as unknown) as Message,
        mockVoteOptions.join(","),
      );
    });
  });
  describe("~tally command", () => {
    it("should notify vote result and winner", async () => {
      const mockMessage = {
        channel: {
          send: (result) => {
            expect(result).to.be.a("string");
            mockVoteOptions.forEach((voteOption) => {
              expect(result).to.include(voteOption);
            });
          },
        },
      };
      await referendumCommandList[
        referendumCommandKeyList.REFERENDUM_TALLY
      ].commandCallback({ client, db }, (mockMessage as unknown) as Message);
    });
    it("should notify if no poll were created", async () => {
      const mockMessage = {
        reply: (result) => {
          expect(result).to.be.a("string");
          expect(result).to.eql(REFERENDUM_RESPONSE.POLL_NOT_CREATED());
        },
      };
      await referendumCommandList[
        referendumCommandKeyList.REFERENDUM_TALLY
      ].commandCallback({ client, db }, (mockMessage as unknown) as Message);
    });
    it("should do nothing if an error occur", async () => {
      await referendumCommandList[
        referendumCommandKeyList.REFERENDUM_TALLY
      ].commandCallback({ client, db }, ({} as unknown) as Message);
    });
  });
  describe("~vote command", () => {
    it("should notify if no poll is currently active", async () => {
      const mockMessage = {
        reply: (result) => {
          expect(result).to.be.a("string");
          expect(result).to.eql(REFERENDUM_RESPONSE.POLL_NOT_CREATED());
        },
      };
      await referendumCommandList[
        referendumCommandKeyList.REFERENDUM_VOTE
      ].commandCallback(
        { client, db },
        (mockMessage as unknown) as Message,
        "1",
      );
    });
    it("should notify if user vote an invalid option", async () => {
      await referendumCommandList[
        referendumCommandKeyList.REFERENDUM_POLL
      ].commandCallback(
        { client, db },
        (mockPollingMessage as unknown) as Message,
        mockVoteOptions.join(","),
      );
      const mockMessage = {
        reply: (result) => {
          expect(result).to.eql(REFERENDUM_RESPONSE.INVALID_QUERY("foo"));
        },
      };
      await referendumCommandList[
        referendumCommandKeyList.REFERENDUM_VOTE
      ].commandCallback(
        { client, db },
        (mockMessage as unknown) as Message,
        "foo",
      );
    });
    it("should notify if user vote successfully", async () => {
      const mockMessage = {
        author: {
          id: "fosodf",
        },
        reply: (result) => {
          expect(result).to.include("fosodf");
          expect(result).to.include("1");
        },
      };
      await referendumCommandList[
        referendumCommandKeyList.REFERENDUM_VOTE
      ].commandCallback(
        { client, db },
        (mockMessage as unknown) as Message,
        "1",
      );
    });
    it("should notify if user have already voted", async () => {
      const mockMessage = {
        author: {
          id: "fosodf",
        },
        reply: (result) => {
          expect(result).to.eql(REFERENDUM_RESPONSE.ALREADY_VOTED());
        },
      };
      await referendumCommandList[
        referendumCommandKeyList.REFERENDUM_VOTE
      ].commandCallback(
        { client, db },
        (mockMessage as unknown) as Message,
        "1",
      );
    });
    it("should do nothing if an error occur", async () => {
      await referendumCommandList[
        referendumCommandKeyList.REFERENDUM_VOTE
      ].commandCallback({ client, db }, ({} as unknown) as Message);
    });
  });
  after(async () => {
    await db.goOffline();
    await app.delete();
  });
});
