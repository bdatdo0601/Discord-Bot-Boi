import R2P_RESPONSES from "./response";

/**
 * making sure error message is formatted to send to user
 *
 * @param {string} errorMessage the raw error message from an error
 * @returns {string} an error message to send to user
 */
const errMessageResponse = (errorMessage: string): string => {
  switch (errorMessage) {
    case R2P_RESPONSES.R2P_ROLE_NOT_FOUND():
      return errorMessage;
    case "Missing Permissions":
      return R2P_RESPONSES.INVALID_PERMISSIONS();
    default:
      return "";
  }
};

export default {
  errMessageResponse,
};
