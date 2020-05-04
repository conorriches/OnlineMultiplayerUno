module.exports = {
  ACTION: {
    GAME_STATE: "GAME_STATE",
    REGISTER_USER: "REGISTER_USER",
    CREATE_GAME: "CREATE_GAME",
    SET_NAME: "SET_NAME",
    NAME: "NAME",
    GAME_ID: "GAME_ID",
    PLAYER_ID: "PLAYER_ID",
    USER_MESSAGE: "USER_MESSAGE",
    JOIN_GAME: "JOIN_GAME",
    START_GAME: "START_GAME",
    DRAW_CARD: "DRAW_CARD",
    CHOOSE_COLOUR: "CHOOSE_COLOUR",
    CHOOSE_PLAYER: "CHOOSE_PLAYER",
    PLAY_CARD: "PLAY_CARD",
    DECLARE_UNO: "DECLARE_UNO",
    CHALLENGE: "CHALLENGE",
    CALLOUT: "CALLOUT",
    EXIT_GAME: "EXIT_GAME",
  },
  ERROR: {
    NAME_EXISTS: "E_NAME_EXIST",
    STARTED: "E_STARTED",
    FULL: "E_FULL",
    NO_GAME: "E_NO_GAME",
    NO_YOU: "E_NO_YOU",
    START: "E_START",
    DRAW: "E_DRAW",
    COLOUR: "E_COLOUR",
    PLAY: "E_PLAY",
    CHALLENGE: "E_CHALLENGE",
    DECLARE: "E_DECLARE",
  },
  CRITERIA: {
    CC: "CHOOSECOLOUR",
    SW: "SWAPWITH",
    DC: "DRAWCARD",
  },
  CARD: {
    COLOUR: {
      RED: "RED",
      GREEN: "GREEN",
      BLUE: "BLUE",
      YELLOW: "YELLOW",
    },
    P2: "PICKUP2",
    SK: "SKIP",
    SD: "SWITCHDIRECTION",
    P4: "PICKUP4",
    SC: "SETCOLOUR",
    NC: "NOCOLOUR",
    get numbers() {
      return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    },
    get symbols() {
      return [this.P2, this.SK, this.SD];
    },
    get wilds() {
      return [this.P4, this.SC];
    },
    get colours() {
      return [
        this.COLOUR.RED,
        this.COLOUR.GREEN,
        this.COLOUR.BLUE,
        this.COLOUR.YELLOW,
      ];
    },
    get actions() {
      return [this.DC, this.CC, this.SW];
    },
  },
};
