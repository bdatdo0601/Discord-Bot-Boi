import axios from "axios";

const MOCK_URL =
  "https://us-central1-dabotboi-66d17.cloudfunctions.net/spongeBobImage";

/**
 * get spongebob image picture with a given mock message
 *
 * @param {string} mockMessage mock message
 * @returns {Promise<ArrayBuffer>} eventually return the image with mock message on it as array buffer
 */
export const getMockImage = async (
  mockMessage: string,
): Promise<ArrayBuffer> => {
  const response = await axios.post(
    MOCK_URL,
    {
      mockMessage,
    },
    {
      responseType: "arraybuffer",
    },
  );
  return response.data;
};
