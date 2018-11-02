import R2P_RESPONSES from "./response";

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
