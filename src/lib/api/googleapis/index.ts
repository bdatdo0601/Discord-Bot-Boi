import { GOOGLE_CONFIG } from "@config";
import debug from "debug";
import { google } from "googleapis";

const debugLog = debug("BotBoi:GoogleAPIS");

const SCOPES = ["https://www.googleapis.com/auth/calendar"];

/**
 * initialize a google api jwt credential
 *
 * @returns jwt credential to google API
 */
export const initGoogleAPIS = async () => {
  try {
    const jwtClient = new google.auth.JWT({
      email: GOOGLE_CONFIG.client_email,
      key: GOOGLE_CONFIG.private_key,
      scopes: SCOPES,
    });
    await jwtClient.authorize();
    return jwtClient;
  } catch (err) {
    debugLog(err);
  }
};
