// import commandList from "@commands";
// import { Command } from "@commands/command.interface";
// import debug from "debug";
// import { Client, Message } from "discord.js";
// import { Wit } from "node-wit";
// import helperWitAIFunctions from "./helper";

// const debugLog = debug("BotBoi:WitAI");

// const { WIT_AI_CLIENT_ACCESS_TOKEN } = process.env as {
//   WIT_AI_CLIENT_ACCESS_TOKEN: string;
// };

// const CONFIDENCE_RATE = 0.7;

// const witClient = new Wit({
//   accessToken: WIT_AI_CLIENT_ACCESS_TOKEN,
// });
// const evalCommand = {
//   commandCallback: async (
//     client: Client,
//     db: firebase.database.Database,
//     query: string,
//     message: Message,
//   ): Promise<void> => {
//     const response = await witClient.message(query, {});
//     for (const entityKey of Object.keys(response.entities)) {
//       const value = response.entities[entityKey].value;
//       if (entityKey[0] === "_") {
//         const command = entityKey.replace("_", "~");
//         await commandList[command].commandCallback(client, db, value, message);
//       } else {
//         if (helperWitAIFunctions[entityKey]) {
//           const messageToSend = await helperWitAIFunctions[entityKey](message);
//           await message.channel.send(messageToSend);
//         }
//       }
//     }
//   },
//   commandDescription: "<ALWAYS_ON> Evaluate based on user natural response",
// };

// export const witAICommandKeyList: WitAICommandKeyList = {
//   EVAL: "~EVAL",
// };

// export default {
//   [witAICommandKeyList.EVAL]: evalCommand,
// };
