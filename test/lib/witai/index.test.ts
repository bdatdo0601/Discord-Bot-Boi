// import { expect } from "chai";
// import { Client, Message } from "discord.js";
// import dotenv from "dotenv";
// import firebase from "firebase";
// import witAICommand, { witAICommandKeyList } from "../../../src/commands/witai";

// dotenv.config();

// // firebase configuration
// const firebaseConfig = {
//   apiKey: process.env.FIREBASE_API_KEY,
//   authDomain: `${process.env.FIREBASE_AUTH_DOMAIN}.firebaseapp.com`,
//   databaseURL: `https://${process.env.FIREBASE_DB_NAME}.firebaseio.com`,
//   messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
//   projectId: process.env.FIREBASE_PROJECT_ID,
//   storageBucket: `${process.env.FIREBASE_STORAGE_BUCKET}.appspot.com`,
// };

// describe("WitAI Command", () => {
//   // firebase initialization
//   const app = firebase.initializeApp(firebaseConfig, "WitAICommandTestEnv");
//   const FireDB = app.database();
//   before(async () => {
//     await FireDB.goOnline();
//   });
//   describe("Eval Command", () => {
//     const client = new Client();
//     it("greet user if it detect greetings", async () => {
//       await witAICommand[witAICommandKeyList.EVAL].commandCallback(
//         client,
//         FireDB,
//         "hello",
//         ({
//           author: {
//             id: "123",
//           },
//           channel: {
//             send: (result) => {
//               expect(result).to.be.a("string");
//             },
//           },
//         } as unknown) as Message,
//       );
//     });
//     it("process rule34searchRecurring command", async () => {
//       await witAICommand[witAICommandKeyList.EVAL].commandCallback(
//         client,
//         FireDB,
//         "show me some good rule34 images",
//         ({
//           channel: {
//             nsfw: false,
//           },
//         } as unknown) as Message,
//       );
//     });
//     it("pass through the command if it couldn't detect anything", async () => {
//       await witAICommand[witAICommandKeyList.EVAL].commandCallback(
//         client,
//         FireDB,
//         "LMAO",
//         ({} as unknown) as Message,
//       );
//     });
//   });
//   after(async () => {
//     await FireDB.goOffline();
//     await app.delete();
//   });
// });
