// import { expect } from "chai";
// import {
//   Client,
//   Collection,
//   Guild,
//   GuildChannel,
//   Message,
//   TextChannel,
// } from "discord.js";
// import firebase from "firebase";
// import _ from "lodash";
// import rule34CommandList, {
//   rule34CommandKeyList,
// } from "../../../src/commands/rule34";
// import rule34HelperFunction from "../../../src/commands/rule34/helper";
// import { FIREBASE_CONFIG } from "../../../src/config";
// import {
//   getGuildStore,
//   initGuildStore,
//   updateGuildStore,
// } from "../../../src/lib/db/firebase";
// import {
//   GuildStore,
//   GuildStoreDataInput,
// } from "../../../src/lib/db/firebase/firebase.interface";

// describe("Rule34 Commands", () => {
//   // firebase initialization
//   const app = firebase.initializeApp(FIREBASE_CONFIG, "Rule34TestEnv");
//   const FireDB = app.database();
//   const mockGuildID = "1";
//   const initMockGuildData: GuildStoreDataInput = {
//     rule34Store: {
//       rule34Keywords: [
//         {
//           source: "rule34xxx",
//           word: "test",
//         },
//         {
//           source: "rule34xxx",
//           word: "one_piece",
//         },
//       ],
//     },
//   };
//   const getExpectedResponse = async () => {
//     const result: string[] = [];
//     result.push("Updated List");
//     const mockGuildStore = (await getGuildStore(
//       mockGuildID,
//       FireDB,
//     )) as GuildStore;
//     const updatedData = _.groupBy(
//       mockGuildStore.data.rule34Store.rule34Keywords,
//       (item) => item.source,
//     );
//     Object.keys(updatedData).forEach((source) => {
//       result.push(
//         `${source}: [ ${updatedData[source].map((item) => item.word).join(" ")} ]`,
//       );
//     });
//     return result;
//   };
//   before(async () => {
//     await FireDB.ref("/").remove();
//   });
//   describe("Rule 34 Delete Keyword Command", async () => {
//     const client = new Client();
//     before(async () => {
//       await initGuildStore(mockGuildID, FireDB);
//       await updateGuildStore(
//         {
//           data: initMockGuildData,
//           guildMetadata: {
//             guildID: mockGuildID,
//           },
//         },
//         FireDB,
//       );
//     });
//     it("should restrict if the channel is not nsfw", (done) => {
//       const mockMessage = {
//         channel: {
//           nsfw: false,
//           send: (result) => {
//             expect(result).to.eql("Lewd stuff don't belong here");
//             done();
//           },
//         },
//       };
//       rule34CommandList[
//         rule34CommandKeyList.RULE34_DELETE_KEYWORD
//       ].commandCallback({ client, db: FireDB }, mockMessage as Message);
//     });
//     it("should delete if keyword exist and send back updated list", async () => {
//       const responses: string[] = [];
//       const mockMessage = {
//         channel: {
//           nsfw: true,
//           send: (result: string) => {
//             responses.push(result);
//           },
//         },
//         content: "test",
//         guild: {
//           id: mockGuildID,
//         },
//       };
//       await rule34CommandList[
//         rule34CommandKeyList.RULE34_DELETE_KEYWORD
//       ].commandCallback(
//         {
//           client,
//           db: FireDB,
//         },
//         mockMessage.content,
//         mockMessage as Message,
//       );
//       const expectedData = await getExpectedResponse();
//       expect(responses.join()).to.equal(expectedData.join());
//     });
//     after(() => {
//       client.destroy();
//     });
//   });
//   describe("Rule 34 Add Keyword Command", () => {
//     const client = new Client();
//     before(async () => {
//       await initGuildStore(mockGuildID, FireDB);
//     });
//     it("should restrict if the channel is not nsfw", (done) => {
//       const mockMessage = {
//         channel: {
//           nsfw: false,
//           send: (result: string) => {
//             expect(result).to.eql("Lewd stuff don't belong here");
//             done();
//           },
//         },
//       };
//       rule34CommandList[
//         rule34CommandKeyList.RULE34_ADD_KEYWORD
//       ].commandCallback({ client, db: FireDB }, mockMessage as Message);
//     });
//     it("should notify if no words was provided", (done) => {
//       const mockMessage = {
//         channel: {
//           nsfw: true,
//           send: (result) => {
//             expect(result).to.eql("You didn't give any word :[");
//             done();
//           },
//         },
//       };
//       rule34CommandList[
//         rule34CommandKeyList.RULE34_ADD_KEYWORD
//       ].commandCallback(client, FireDB, "   ", mockMessage as Message);
//     });
//     it("should return updated list if words are provided in nsfw channel", async () => {
//       const responses: string[] = [];
//       const mockMessage = {
//         channel: {
//           nsfw: true,
//           send: (result: string) => {
//             responses.push(result);
//           },
//         },
//         guild: {
//           id: mockGuildID,
//         },
//       };
//       await rule34CommandList[
//         rule34CommandKeyList.RULE34_ADD_KEYWORD
//       ].commandCallback(client, FireDB, "foos", mockMessage as Message);
//       const expectedData = await getExpectedResponse();
//       expect(responses.join()).to.equal(expectedData.join());
//     });
//     it("helper function should add keyword onto specific source if a source array is provided", async () => {
//       const updatedList = await rule34HelperFunction.addRule34Keyword(
//         mockGuildID,
//         "fos",
//         FireDB,
//         ["rule34xxx", "reddit"],
//       );
//       const expectedList: object = _.groupBy(
//         ((await getGuildStore(mockGuildID, FireDB)) as GuildStore).data
//           .rule34Store.rule34Keywords,
//         (item) => item.source,
//       );
//       Object.keys(expectedList).forEach((source) => {
//         expectedList[source] = expectedList[source].map((item) => item.word);
//       });
//       expect(updatedList).to.eql(expectedList);
//     });
//     after(() => {
//       client.destroy();
//     });
//   });
//   describe("Rule 34 Search Command", () => {
//     const client = new Client();
//     before(async () => {
//       await initGuildStore(mockGuildID, FireDB);
//       await updateGuildStore(
//         {
//           data: initMockGuildData,
//           guildMetadata: {
//             guildID: mockGuildID,
//           },
//         },
//         FireDB,
//       );
//     });
//     it("getLewdImageFromRule34XXX should return whole array if amount requested is larger that found", async () => {
//       const amount = 100000000;
//       const dataToSend = await rule34HelperFunction.getLewlImagesFromRule34XXX(
//         "naruto",
//         amount,
//       );
//       expect(dataToSend.length).to.be.lessThan(amount);
//     });
//     it("should restrict if channel is not nsfw", (done) => {
//       const mockMessage = {
//         channel: {
//           nsfw: false,
//           send: (result) => {
//             expect(result).to.eql("Lewd images don't belong here");
//             done();
//           },
//         },
//       };
//       rule34CommandList[rule34CommandKeyList.RULE34_SEARCH].commandCallback(
//         client,
//         FireDB,
//         "test",
//         mockMessage as Message,
//       );
//     });
//     it("should send back one lewd image if it found one", async () => {
//       const responses: string[] = [];
//       const mockMessage = {
//         channel: {
//           nsfw: true,
//           send: (result) => {
//             responses.push(result);
//           },
//         },
//       };
//       await rule34CommandList[
//         rule34CommandKeyList.RULE34_SEARCH
//       ].commandCallback(client, FireDB, "naruto", mockMessage as Message);
//       expect(responses.length).to.be.greaterThan(0);
//     });
//     it("should notify if it doesn't found any results", async () => {
//       const responses: string[] = [];
//       const mockMessage = {
//         channel: {
//           nsfw: true,
//           send: (result) => {
//             responses.push(result);
//           },
//         },
//       };
//       await rule34CommandList[
//         rule34CommandKeyList.RULE34_SEARCH
//       ].commandCallback(
//         client,
//         FireDB,
//         "asfasdgfs;l;;",
//         mockMessage as Message,
//       );
//       expect(responses.length).to.equal(1);
//     });
//     it("should send back one random lewd image if no query provided", async () => {
//       const responses: string[] = [];
//       const mockMessage = {
//         channel: {
//           nsfw: true,
//           send: (result) => {
//             responses.push(result);
//           },
//         },
//         guild: {
//           id: mockGuildID,
//         },
//       };
//       await rule34CommandList[
//         rule34CommandKeyList.RULE34_SEARCH
//       ].commandCallback(client, FireDB, "", mockMessage as Message);
//       expect(responses.length).to.be.greaterThan(0);
//     });
//     it("should notify if no query provided an no keyword associated with guild found", async () => {
//       const responses: string[] = [];
//       const mockMessage = {
//         channel: {
//           nsfw: true,
//           send: (result) => {
//             responses.push(result);
//           },
//         },
//         guild: {
//           id: "foos",
//         },
//       };
//       await rule34CommandList[
//         rule34CommandKeyList.RULE34_SEARCH
//       ].commandCallback(client, FireDB, "", mockMessage as Message);
//       expect(responses.length).to.be.greaterThan(0);
//     });
//     after(() => {
//       client.destroy();
//     });
//   });
//   describe("Rule 34 Search Recurring Command", () => {
//     const client = new Client();
//     const mockGuildIDWithRecurring = "2";
//     const mockRecurringChannelID = "123";
//     const mockStoreWithRecurringID: GuildStoreDataInput = {
//       rule34Store: {
//         recurringNSFWChannelID: mockRecurringChannelID,
//         rule34Keywords: [
//           {
//             source: "rule34xxx",
//             word: "jhjhjhjhjhjhjhjkkmlknmm",
//           },
//         ],
//       },
//     };
//     const mockGuild = {
//       channels: new Collection<string, GuildChannel>(),
//       id: mockGuildID,
//     };
//     const mockGuildWithRecurring = {
//       channels: new Collection<string, GuildChannel>(),
//       id: mockGuildIDWithRecurring,
//     };
//     before(async () => {
//       await initGuildStore(mockGuildID, FireDB);
//       await initGuildStore(mockGuildIDWithRecurring, FireDB);
//       await updateGuildStore(
//         {
//           data: initMockGuildData,
//           guildMetadata: {
//             guildID: mockGuildID,
//           },
//         },
//         FireDB,
//       );
//       await updateGuildStore(
//         {
//           data: mockStoreWithRecurringID,
//           guildMetadata: {
//             guildID: mockGuildIDWithRecurring,
//           },
//         },
//         FireDB,
//       );
//     });
// it("should send images to client's guild when message was not supplied based on recurring channel ID", async () => {
//       const responses: string[] = [];
//       const mockChannel = {
//         guild: {
//           id: mockGuildIDWithRecurring,
//         },
//         send: (result) => {
//           responses.push(result);
//         },
//       };
//       mockGuild.channels.set(
//         mockRecurringChannelID,
//         mockChannel as TextChannel,
//       );
//       mockGuildWithRecurring.channels.set(
//         mockRecurringChannelID,
//         mockChannel as TextChannel,
//       );
//       const guilds = new Collection<string, Guild>();
//       guilds.set(mockGuildID, mockGuild as Guild);
//       guilds.set(mockGuildIDWithRecurring, mockGuildWithRecurring as Guild);
//       client.guilds = guilds;
//       await rule34CommandList[
//         rule34CommandKeyList.RULE34_SEARCH_RECURRING
//       ].commandCallback(client, FireDB);
//       expect(responses.length).to.be.greaterThan(0);
//     });
//     it("should post images if a request is provided", async () => {
//       const responses: string[] = [];
//       const mockMessage = {
//         channel: {
//           guild: {
//             id: mockGuildID,
//           },
//           nsfw: true,
//           send: (result) => {
//             responses.push(result);
//           },
//         },
//       };
//       await rule34CommandList[
//         rule34CommandKeyList.RULE34_SEARCH_RECURRING
//       ].commandCallback(client, FireDB, "", mockMessage as Message);
//     });
//     it("should do notthing if the message is provided but channel is not nsfw", async () => {
//       const mockMessage = {
//         channel: {
//           guild: {
//             id: mockGuildID,
//           },
//           nsfw: false,
//           send: (result) => {
//             throw new Error("Should not send messages");
//           },
//         },
//       };
//       await rule34CommandList[
//         rule34CommandKeyList.RULE34_SEARCH_RECURRING
//       ].commandCallback(
//         client,
//         FireDB,
//         "",
//         (mockMessage as unknown) as Message,
//       );
//     });
//   });
//   describe("Rule 34 List Command", () => {
//     const client = new Client();
//     before(async () => {
//       await initGuildStore(mockGuildID, FireDB);
//       await updateGuildStore(
//         {
//           data: initMockGuildData,
//           guildMetadata: {
//             guildID: mockGuildID,
//           },
//         },
//         FireDB,
//       );
//     });
//     it("should restrict if channel is not nsfw", (done) => {
//       const mockMessage = {
//         channel: {
//           nsfw: false,
//           send: (result) => {
//             expect(result).to.eql("Lewd stuff don't belong here");
//             done();
//           },
//         },
//       };
//       rule34CommandList[rule34CommandKeyList.RULE34_LIST].commandCallback(
//         client,
//         FireDB,
//         "test",
//         mockMessage as Message,
//       );
//     });
//     it("should return a list categorized by source", async () => {
//       const responses: string[] = [];
//       const mockMessage = {
//         channel: {
//           nsfw: true,
//           send: (result) => {
//             responses.push(result);
//           },
//         },
//         guild: {
//           id: mockGuildID,
//         },
//       };
//       await rule34CommandList[rule34CommandKeyList.RULE34_LIST].commandCallback(
//         client,
//         FireDB,
//         "test",
//         mockMessage as Message,
//       );
//       const expected = await getExpectedResponse();
//       expected.shift();
//       expect(responses).to.eql(expected);
//     });
//     it("should notify if no keyword found", async () => {
//       await updateGuildStore(
//         {
//           data: {
//             rule34Store: {
//               rule34Keywords: [],
//             },
//           },
//           guildMetadata: {
//             guildID: mockGuildID,
//           },
//         },
//         FireDB,
//       );
//       const mockMessage = {
//         channel: {
//           nsfw: true,
//           send: (result) => {
//             expect(result).to.eql("There are no keyword found");
//           },
//         },
//         guild: {
//           id: mockGuildID,
//         },
//       };
//       await rule34CommandList[rule34CommandKeyList.RULE34_LIST].commandCallback(
//         client,
//         FireDB,
//         "test",
//         mockMessage as Message,
//       );
//     });
//   });
//   describe("Rule 34 Set Recurring", () => {
//     const client = new Client();
//     before(async () => {
//       await initGuildStore(mockGuildID, FireDB);
//       await updateGuildStore(
//         {
//           data: initMockGuildData,
//           guildMetadata: {
//             guildID: mockGuildID,
//           },
//         },
//         FireDB,
//       );
//     });
//     it("should notify is the current channel is not nsfw", (done) => {
//       const mockMessage = {
//         channel: {
//           id: "123",
//           nsfw: false,
//           send: (result) => {
//             expect(result).to.eql("Lewd stuff don't belong here");
//             done();
//           },
//         },
//         guild: {
//           id: mockGuildID,
//         },
//       };
//       rule34CommandList[
//         rule34CommandKeyList.RULE34_SET_RECURRING
//       ].commandCallback(client, FireDB, "meh", mockMessage as Message);
//     });
//     it("should notify success if the channel is now set to recurring", (done) => {
//       const mockMessage = {
//         channel: {
//           id: "123",
//           nsfw: true,
//           send: (result) => {
//             expect(result).to.eql(
//               "Rule34 Recurring Images will now be posted here",
//             );
//             done();
//           },
//         },
//         guild: {
//           id: mockGuildID,
//         },
//       };
//       rule34CommandList[
//         rule34CommandKeyList.RULE34_SET_RECURRING
//       ].commandCallback(client, FireDB, "meh", mockMessage as Message);
//     });
//     after(() => {
//       client.destroy();
//     });
//   });
//   describe("Rule 34 Get Recurring", () => {
//     const client = new Client();
//     const mockGuildBaseWithRecurringID = "2";
//     const mockRecurringChannelID = "123";
//     const initMockGuildDataWithRecurring: GuildStoreDataInput = {
//       rule34Store: {
//         recurringNSFWChannelID: mockRecurringChannelID,
//       },
//     };
//     beforeEach(async () => {
//       await initGuildStore(mockGuildID, FireDB);
//       await initGuildStore(mockGuildBaseWithRecurringID, FireDB);
//       await updateGuildStore(
//         {
//           data: initMockGuildData,
//           guildMetadata: {
//             guildID: mockGuildID,
//           },
//         },
//         FireDB,
//       );
//       await updateGuildStore(
//         {
//           data: initMockGuildDataWithRecurring,
//           guildMetadata: {
//             guildID: mockGuildBaseWithRecurringID,
//           },
//         },
//         FireDB,
//       );
//     });
//     it("should notify if it can't find guildbase", (done) => {
//       const mockMessage = {
//         channel: {
//           id: "12s3",
//           send: (result) => {
//             expect(result).to.eql(
//               "I can't find any recurring channel for rule 34",
//             );
//             done();
//           },
//         },
//         guild: {
//           id: "4124",
//         },
//       };
//       rule34CommandList[
//         rule34CommandKeyList.RULE34_GET_RECURRING
//       ].commandCallback(client, FireDB, "meh", mockMessage as Message);
//     });
//     it("should notify if it can't find recurring channel", (done) => {
//       const mockMessage = {
//         channel: {
//           id: "12s3",
//           send: (result) => {
//             expect(result).to.eql(
//               "I can't find any recurring channel for rule 34",
//             );
//             done();
//           },
//         },
//         guild: {
//           id: "foo",
//         },
//       };
//       rule34CommandList[
//         rule34CommandKeyList.RULE34_GET_RECURRING
//       ].commandCallback(client, FireDB, "meh", mockMessage as Message);
//     });
//     it("should tell which channel is recurring if it existed", (done) => {
//       const mockMessage = {
//         channel: {
//           id: mockRecurringChannelID,
//           nsfw: false,
//           send: (result) => {
//             expect(result).to.eql(
//               `The current Rule 34 recurring channel is <#${mockRecurringChannelID}>`,
//             );
//             done();
//           },
//         },
//         guild: {
//           id: mockGuildBaseWithRecurringID,
//         },
//       };
//       rule34CommandList[
//         rule34CommandKeyList.RULE34_GET_RECURRING
//       ].commandCallback(client, FireDB, "meh", mockMessage as Message);
//     });
//     after(() => {
//       client.destroy();
//     });
//   });
//   describe("Rule 34 Delete Recurring", () => {
//     const client = new Client();
//     before(async () => {
//       await initGuildStore(mockGuildID, FireDB);
//       await updateGuildStore(
//         {
//           data: initMockGuildData,
//           guildMetadata: {
//             guildID: mockGuildID,
//           },
//         },
//         FireDB,
//       );
//     });
//     it("should notify when the deletion is complete", (done) => {
//       const mockMessage = {
//         channel: {
//           id: "123",
//           nsfw: false,
//           send: (result) => {
//             expect(result).to.eql("Recurring Channel is now deleted");
//             done();
//           },
//         },
//         guild: {
//           id: mockGuildID,
//         },
//       };
//       rule34CommandList[
//         rule34CommandKeyList.RULE34_DELETE_RECURRING
//       ].commandCallback(client, FireDB, "meh", mockMessage as Message);
//     });
//   });
//   after(async () => {
//     await FireDB.ref("/").remove();
//     await app.delete();
//   });
// });
