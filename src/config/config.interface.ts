export interface EnvironmentVariables {
  FIREBASE_CONFIG: FirebaseConfiguration;
  DISCORD_CONFIG: DiscordConfiguration;
  WIT_AI_CONFIG: WitAIConfiguration;
  RULE_34_CONFIG: Rule34Configuration;
  HEROKU_DATA: HerokuData;
  GOOGLE_CONFIG: GoogleConfiguration;
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
  dbName: string;
  databaseURL: string;
  messagingSenderId: string;
  projectId: string;
  storageBucket: string;
}

export interface GoogleConfiguration {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
}

export interface HerokuData {
  APP_NAME: string;
  RELEASE_VERSION: string;
  RELEASE_CREATED_AT: string;
}
