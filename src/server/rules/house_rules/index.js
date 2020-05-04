const matches = (playerId, playerGoId, topCard, card) => {
  if (!c1 || !c2) return false;

  // Anyone can jump in on an exact match
  if (c1.colour === c2.colour && c1.symbol === c2.symbol) {
    return true;
  }

  if (ownGo) {
    if (this.isNumber(c2)) {
      if (this.isNumber(c1)) {
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
      if (this.isSymbol(c1)) {
        // Number on Symbol
        return c1.colour == c2.colour;
      }
      if (this.isWild(c1)) {
        // Number on wild (change colour / +4)
        return c1.colour == c2.colour;
      }
    }

    //User is playing a symbol
    if (this.isSymbol(c2)) {
      if (this.isNumber(c1)) {
        return c1.colour === c2.colour;
      }
      if (this.isSymbol(c1)) {
        return c1.symbol === c2.symbol || c1.colour === c2.colour;
      }
      if (this.isWild(c1)) {
        return c1.colour == c2.colour;
      }
    }

    //User is playing a wildcard
    if (this.isWild(c2)) {
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
