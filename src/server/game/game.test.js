const Game = require("./game");

const P2 = "PICKUP2",
  SK = "SKIP",
  SW = "SWITCHDIRECTION",
  P4 = "PICKUP4",
  SC = "SETCOLOUR",
  R = "RED",
  G = "GREEN",
  Y = "YELLOW",
  B = "BLUE",
  NC = "NOCOLOUR";

const card = (symbol, colour) => ({
  symbol,
  colour,
});

const game = new Game({ id: 1234 });

describe("isCard", () => {
  test("isNumber()", () => {
    expect(game.isNumber(card(0, R))).toBe(true);
    expect(game.isNumber(card(1, R))).toBe(true);
    expect(game.isNumber(card(9, R))).toBe(true);
    expect(game.isNumber(card(SW, R))).toBe(false);
    expect(game.isNumber(card(SK, R))).toBe(false);
    expect(game.isNumber(card(P2, R))).toBe(false);
    expect(game.isNumber(card(SC, R))).toBe(false);
    expect(game.isNumber(card(P4, R))).toBe(false);
  });
  test("isSymbol()", () => {
    expect(game.isSymbol(card(0, R))).toBe(false);
    expect(game.isSymbol(card(1, R))).toBe(false);
    expect(game.isSymbol(card(9, R))).toBe(false);
    expect(game.isSymbol(card(SW, R))).toBe(true);
    expect(game.isSymbol(card(SK, R))).toBe(true);
    expect(game.isSymbol(card(P2, R))).toBe(true);
    expect(game.isSymbol(card(SC, R))).toBe(false);
    expect(game.isSymbol(card(P4, R))).toBe(false);
  });
  test("isWild()", () => {
    expect(game.isWild(card(0, R))).toBe(false);
    expect(game.isWild(card(1, R))).toBe(false);
    expect(game.isWild(card(9, R))).toBe(false);
    expect(game.isWild(card(SW, R))).toBe(false);
    expect(game.isWild(card(SK, R))).toBe(false);
    expect(game.isWild(card(P2, R))).toBe(false);
    expect(game.isWild(card(SC, R))).toBe(true);
    expect(game.isWild(card(P4, R))).toBe(true);
  });
});

describe("match()", () => {
  describe("on your go", () => {
    describe("playing a number", () => {
      test("on a number", () => {
        expect(game.matches(true, card(3, R), card(3, B))).toBe(true);
        expect(game.matches(true, card(3, R), card(2, R))).toBe(true);
        expect(game.matches(true, card(0, R), card(9, R))).toBe(true);
        expect(game.matches(true, card(9, R), card(0, R))).toBe(true);
        expect(game.matches(true, card(9, R), card(0, B))).toBe(false);
        expect(game.matches(true, card(1, B), card(7, B))).toBe(false);
      });
      test("on a symbol", () => {
        expect(game.matches(true, card(SK, R), card(3, R))).toBe(true);
        expect(game.matches(true, card(SW, R), card(3, R))).toBe(true);
        expect(game.matches(true, card(P2, R), card(3, R))).toBe(true);
        expect(game.matches(true, card(P2, R), card(3, G))).toBe(false);
        expect(game.matches(true, card(SW, R), card(3, G))).toBe(false);
        expect(game.matches(true, card(SK, R), card(3, G))).toBe(false);
      });
      test("on a wildcard", () => {
        expect(game.matches(true, card(P4, R), card(3, R))).toBe(true);
        expect(game.matches(true, card(SC, R), card(3, R))).toBe(true);
        expect(game.matches(true, card(P4, R), card(3, G))).toBe(false);
        expect(game.matches(true, card(SC, R), card(3, G))).toBe(false);
      });
    });

    describe("playing a symbol", () => {
      test("on a number", () => {
        expect(game.matches(true, card(3, R), card(SK, R))).toBe(true);
        expect(game.matches(true, card(3, R), card(P2, R))).toBe(true);
        expect(game.matches(true, card(3, R), card(SW, R))).toBe(true);
        expect(game.matches(true, card(3, R), card(SW, G))).toBe(false);
        expect(game.matches(true, card(3, R), card(P2, G))).toBe(false);
        expect(game.matches(true, card(3, R), card(SK, G))).toBe(false);
      });
      test("on a symbol", () => {
        expect(game.matches(true, card(SK, R), card(SK, R))).toBe(true);
        expect(game.matches(true, card(SK, R), card(SK, G))).toBe(true);
        expect(game.matches(true, card(SK, R), card(P2, R))).toBe(true);
        expect(game.matches(true, card(SK, R), card(SW, R))).toBe(true);
        expect(game.matches(true, card(SK, R), card(P2, G))).toBe(false);
      });
      test("on a wildcard", () => {
        expect(game.matches(true, card(P4, R), card(SK, R))).toBe(true);
        expect(game.matches(true, card(P4, R), card(P2, R))).toBe(true);
        expect(game.matches(true, card(SC, R), card(P2, R))).toBe(true);
        expect(game.matches(true, card(SC, R), card(P2, G))).toBe(false);
      });
    });

    describe("playing a wildcard", () => {
      test("on a number", () => {
        expect(game.matches(true, card(3, R), card(P4, R))).toBe(true);
        expect(game.matches(true, card(3, R), card(P4, R))).toBe(true);
        expect(game.matches(true, card(3, R), card(P4, R))).toBe(true);
        expect(game.matches(true, card(3, R), card(P4, G))).toBe(true);
        expect(game.matches(true, card(3, R), card(P4, G))).toBe(true);
        expect(game.matches(true, card(3, R), card(P4, G))).toBe(true);
      });
      test("on a symbol", () => {
        expect(game.matches(true, card(SK, R), card(P4, R))).toBe(true);
        expect(game.matches(true, card(SK, R), card(P4, G))).toBe(true);
        expect(game.matches(true, card(SK, R), card(SC, R))).toBe(true);
        expect(game.matches(true, card(SK, R), card(P4, R))).toBe(true);
        expect(game.matches(true, card(SK, R), card(SC, G))).toBe(true);
      });
      test("on a wildcard", () => {
        expect(game.matches(true, card(P4, R), card(P4, R))).toBe(true);
        expect(game.matches(true, card(P4, R), card(P4, NC))).toBe(true);
        expect(game.matches(true, card(P4, NC), card(P4, NC))).toBe(true);
        expect(game.matches(true, card(P4, R), card(SC, R))).toBe(true);
        expect(game.matches(true, card(SC, R), card(P4, R))).toBe(true);
        expect(game.matches(true, card(SC, R), card(P4, G))).toBe(true);
      });
    });
  });

  describe("jumping in", () => {
    describe("must be an exact match", () => {
      expect(game.matches(false, card(P4, R), card(P4, R))).toBe(true);
      expect(game.matches(false, card(SK, R), card(SK, R))).toBe(true);
      expect(game.matches(false, card(1, R), card(1, R))).toBe(true);
      expect(game.matches(false, card(1, R), card(2, R))).toBe(false);
      expect(game.matches(false, card(1, R), card(1, G))).toBe(false);
      expect(game.matches(false, card(P4, R), card(SC, R))).toBe(false);
      expect(game.matches(false, card(SC, R), card(P4, R))).toBe(false);
      expect(game.matches(false, card(SC, R), card(P4, G))).toBe(false);
    });
  });
});
