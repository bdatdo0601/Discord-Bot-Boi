import { Attachment } from "discord.js";
import _ from "lodash";
import { MockResponse } from "./mock.interace";
import MOCK_RESPONSE from "./response";

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

const getMockResponse = async (
  mockeeID: string,
  mockMessage: string,
): Promise<MockResponse> => {
  const imageData = await mockMessage;
  const attachment = new Attachment(imageData, "mocking.jpg");
  return {
    message: MOCK_RESPONSE.MOCKING(mockeeID, mockMessage),
    attachment,
  };
};

export default {
  toMockSentence,
  getMockResponse,
};
