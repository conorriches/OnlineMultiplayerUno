const { isNumber, isSymbol, isWild } = require("../../helpers/game");

const matches = (playerId, playerGoId, c1, c2) => {
  if (!c1 || !c2) return false;

  // Anyone can jump in on an exact match
  if (c1.colour === c2.colour && c1.symbol === c2.symbol) {
    return true;
  }

  if (playerId === playerGoId) {
    if (isNumber(c2)) {
      if (isNumber(c1)) {
        // Number on Number
        if (c1.symbol === c2.symbol) return true;
        if (c1.colour === c2.colour) {
          if (Math.abs(c1.symbol - c2.symbol) < 2) {
            return true;
          }
          if (
            (c1.symbol === 0 && c2.symbol === 9) ||
            (c2.symbol === 0 && c1.symbol === 9)
          ) {
            return true;
          }
          // Playing on symbol / wild
          if (wild.indexOf(c1.symbol) > -1 || symbols.indexOf(c1.symbol) > -1) {
            return true;
          }
          return false;
        } else {
          return false;
        }
      }
      if (isSymbol(c1)) {
        // Number on Symbol
        return c1.colour == c2.colour;
      }
      if (isWild(c1)) {
        // Number on wild (change colour / +4)
        return c1.colour == c2.colour;
      }
    }

    //User is playing a symbol
    if (isSymbol(c2)) {
      if (isNumber(c1)) {
        return c1.colour === c2.colour;
      }
      if (isSymbol(c1)) {
        return c1.symbol === c2.symbol || c1.colour === c2.colour;
      }
      if (isWild(c1)) {
        return c1.colour == c2.colour;
      }
    }

    //User is playing a wildcard
    if (isWild(c2)) {
      return true;
    }
  }

  return false;
};

const playCard = () => {};

const action = () => {};

module.exports = {
  matches,
  playCard,
  action,
};
