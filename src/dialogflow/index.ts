import { DIALOGFLOW_CONFIG } from "@config";
import { EventContext } from "@events/event.interface";
import debug from "debug";
import dialogflow, {
  ClientOptions,
  DetectIntentRequest,
  DetectIntentResponse,
  SessionsClient,
} from "dialogflow";
import { Message } from "discord.js";
import _ from "lodash";
import { GoogleConfiguration } from "src/config/config.interface";

const debugLog = debug("BotBoi:DialogFlow");

/**
 * DialogFlow class
 *
 * manage interaction with DialogFlow API
 */
class DialogFlow {
  private projectID: string;
  private sessionClient: SessionsClient;
  /**
   * Initialize Dialogflow Client
   *
   * @param {string} projectID project id associated with dialogflow
   */
  constructor(googleConfig: GoogleConfiguration) {
    this.projectID = googleConfig.project_id;
    const config: ClientOptions = {
      credentials: {
        client_email: googleConfig.client_email,
        private_key: googleConfig.private_key,
      },
    };
    this.sessionClient = new dialogflow.v2beta1.SessionsClient(config);
  }

  public async processMessage(
    context: EventContext,
    message: Message,
  ): Promise<void> {
    // clean text request
    const selfID = context.client.user.id;
    const textRequest = message.content.replace(`<@${selfID}>`, "").trim();
    // only consider detected intent with highest confidence
    const responses = await this.getResponses(textRequest, message.author.id);
    const intent = _.maxBy(
      responses.filter(
        (response) =>
          response &&
          response.queryResult.intentDetectionConfidence >=
            DIALOGFLOW_CONFIG.CONFIDENCE_TOLERANCE,
      ),
      (response) => response.queryResult.intentDetectionConfidence,
    );
    if (!intent) {
      await message.reply("I don't understand what chu sayin' fam");
      return;
    }
    debugLog(intent.queryResult.parameters.fields.searchQuery);
    await message.reply(intent.queryResult.fulfillmentText);
  }

  /**
   *
   * @param {string} textRequest
   * @param {string} sessionID
   */
  private async getResponses(
    textRequest: string,
    sessionID: string,
  ): Promise<DetectIntentResponse[]> {
    try {
      // construct request
      const request: DetectIntentRequest = {
        queryInput: {
          text: {
            languageCode: DIALOGFLOW_CONFIG.LANGUAGE_CODE,
            text: textRequest,
          },
        },
        session: this.sessionClient.sessionPath(this.projectID, sessionID),
      };
      const responses = await this.sessionClient.detectIntent(request);
      return responses;
    } catch (err) {
      debugLog(err);
      return [];
    }
  }
}

export default DialogFlow;
