import { Attachment } from "discord.js";
import _ from "lodash";
import { MockResponse } from "./mock.interace";
import MOCK_RESPONSE from "./response";

/**
 * get a mock version from a provided phrase
 *
 * @param {string} sentence original query
 * @returns {string} mocked query
 */
const toMockSentence = (sentence: string): string => {
  const response: string[] = sentence.split("");
  let lowerCaseToggle = true;
  const mockSentence: string = _.reduce(
    response,
    (result: string, currentChar: string) => {
      if (!currentChar.match(/[A-Za-z]/)) {
        return result + currentChar;
      }
      if (lowerCaseToggle) {
        lowerCaseToggle = !lowerCaseToggle;
        return result + currentChar.toLocaleLowerCase();
      } else {
        lowerCaseToggle = !lowerCaseToggle;
        return result + currentChar.toLocaleUpperCase();
      }
    },
    "",
  );
  return mockSentence;
};

/**
 * get a mock response based from user that will be mocked and the mock message
 *
 * @param {string} mockeeID ID of the mocked user
 * @param {string} mockMessage mocked message
 *
 * @returns {Promise<MockResponse>} eventually return a response with mocked image attachment
 */
const getMockResponse = async (
  mockeeID: string,
  mockMessage: string,
): Promise<MockResponse> => {
  const imageData = await mockMessage;
  const attachment = new Attachment(imageData, "mocking.jpg");
  return {
    attachment,
    message: MOCK_RESPONSE.MOCKING(mockeeID, mockMessage),
  };
};

export default {
  getMockResponse,
  toMockSentence,
};
