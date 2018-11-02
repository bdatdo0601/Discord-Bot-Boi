export interface EnvironmentVariables {
  FIREBASE_CONFIG: FirebaseConfiguration;
  DISCORD_CONFIG: DiscordConfiguration;
  WIT_AI_CONFIG: WitAIConfiguration;
  RULE_34_CONFIG: Rule34Configuration;
  HEROKU_DATA: HerokuData;
}

export interface Rule34Configuration {
  RECURRING_INTERVAL: number;
}

export interface DiscordConfiguration {
  BOT_TOKEN: string;
}

export interface WitAIConfiguration {
  CLIENT_ACCESS_TOKEN: string;
  CONFIDENCE_RATE: number;
}

export interface FirebaseConfiguration {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  messagingSenderId: string;
  projectId: string;
  storageBucket: string;
}

export interface HerokuData {
  APP_NAME: string;
  RELEASE_VERSION: string;
  RELEASE_CREATED_AT: string;
}
