import dotenv from "dotenv";
import {
  DiscordConfiguration,
  EnvironmentVariables,
  FirebaseConfiguration,
  GoogleConfiguration,
  HerokuData,
  Rule34Configuration,
  WitAIConfiguration,
} from "./config.interface";
dotenv.config();

export const GOOGLE_CONFIG: GoogleConfiguration = {
  auth_provider_x509_cert_url: process.env
    .GOOGLE_AUTH_PROVIDER_X509_CERT_URL as string,
  auth_uri: process.env.GOOGLE_AUTH_URI as string,
  client_email: process.env.GOOGLE_CLIENT_EMAIL as string,
  client_id: process.env.GOOGLE_CLIENT_ID as string,
  client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT_URL as string,
  private_key: (process.env.GOOGLE_PRIVATE_KEY as string).replace(/\\n/g, "\n"),
  private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID as string,
  project_id: process.env.GOOGLE_PROJECT_ID as string,
  token_uri: process.env.GOOGLE_TOKEN_URI as string,
  type: process.env.GOOGLE_ACCOUNT_TYPE as string,
};

export const FIREBASE_CONFIG: FirebaseConfiguration = {
  apiKey: process.env.FIREBASE_API_KEY as string,
  authDomain: `${process.env.FIREBASE_AUTH_DOMAIN}.firebaseapp.com`,
  databaseURL: `https://${process.env.FIREBASE_DB_NAME}.firebaseio.com`,
  dbName: process.env.FIREBASE_DB_NAME as string,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID as string,
  projectId: process.env.FIREBASE_PROJECT_ID as string,
  storageBucket: `${process.env.FIREBASE_STORAGE_BUCKET}.appspot.com`,
};

export const DISCORD_CONFIG: DiscordConfiguration = {
  BOT_TOKEN: process.env.BOT_TOKEN as string,
};

export const WIT_AI_CONFIG: WitAIConfiguration = {
  CLIENT_ACCESS_TOKEN: process.env.WIT_AI_CLIENT_ACCESS_TOKEN as string,
  CONFIDENCE_RATE: parseFloat(
    (process.env.WIT_AI_CONFIDENCE_RATE as string) || "0.7",
  ),
};

export const RULE_34_CONFIG: Rule34Configuration = {
  RECURRING_INTERVAL: parseInt(
    (process.env.RECURRING_INTERVAL as string) || "60000*30",
    10,
  ),
};

export const HEROKU_DATA: HerokuData = {
  APP_NAME: process.env.HEROKU_APP_NAME as string,
  RELEASE_CREATED_AT: process.env.HEROKU_RELEASE_CREATED_AT as string,
  RELEASE_VERSION: process.env.HEROKU_RELEASE_VERSION as string,
};

const ENV_VAR: EnvironmentVariables = {
  DISCORD_CONFIG,
  FIREBASE_CONFIG,
  GOOGLE_CONFIG,
  HEROKU_DATA,
  RULE_34_CONFIG,
  WIT_AI_CONFIG,
};

export default ENV_VAR;
