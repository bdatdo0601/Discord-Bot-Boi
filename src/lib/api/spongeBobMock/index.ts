import axios from "axios";

const MOCK_URL =
  "https://us-central1-dabotboi-66d17.cloudfunctions.net/spongeBobImage";

export const getMockImage = async (mockMessage) => {
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
