import rule34Command from "./rule34";
import sayMockCommand from "./sayMock";
import mockCommand from "./mock";

export const COMMANDS = {
    RULE34: "~rule34",
    SAY_MOCK: "~sayMock",
    MOCK: "~MOCK",
};

export default {
    [COMMANDS.RULE34]: rule34Command.commandCallback,
    [COMMANDS.SAY_MOCK]: sayMockCommand.commandCallback,
    [COMMANDS.MOCK]: mockCommand.commandCallback,
};
