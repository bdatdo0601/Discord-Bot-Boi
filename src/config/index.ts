import dotenv from "dotenv";
import {
  DiscordConfiguration,
  EnvironmentVariables,
  FirebaseConfiguration,
  HerokuData,
  WitAIConfiguration,
} from "./config.interface";
dotenv.config();

export const FIREBASE_CONFIG: FirebaseConfiguration = {
  apiKey: process.env.FIREBASE_API_KEY as string,
  authDomain: `${process.env.FIREBASE_AUTH_DOMAIN}.firebaseapp.com`,
  databaseURL: `https://${process.env.FIREBASE_DB_NAME}.firebaseio.com`,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID as string,
  projectId: process.env.FIREBASE_PROJECT_ID as string,
  storageBucket: `${process.env.FIREBASE_STORAGE_BUCKET}.appspot.com`,
};

export const DISCORD_CONFIG: DiscordConfiguration = {
  BOT_TOKEN: process.env.BOT_TOKEN as string,
};

export const WIT_AI_CONFIG: WitAIConfiguration = {
  CLIENT_ACCESS_TOKEN: process.env.WIT_AI_CLIENT_ACCESS_TOKEN as string,
  CONFIDENCE_RATE: parseFloat(process.env.WIT_AI_CONFIDENCE_RATE as string),
};

export const HEROKU_DATA: HerokuData = {
  APP_NAME: process.env.HEROKU_APP_NAME as string,
  RELEASE_CREATED_AT: process.env.HEROKU_RELEASE_CREATED_AT as string,
  RELEASE_VERSION: process.env.HEROKU_RELEASE_VERSION as string,
};

const ENV_VAR: EnvironmentVariables = {
  DISCORD_CONFIG,
  FIREBASE_CONFIG,
  HEROKU_DATA,
  WIT_AI_CONFIG,
};

export default ENV_VAR;
