import _ from "lodash";

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

export default {
  toMockSentence,
};
