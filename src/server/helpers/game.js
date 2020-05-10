const { CARD } = require("../constants");

const isNumber = (c) => {
  return CARD.numbers.indexOf(c.symbol) > -1;
};
const isSymbol = (c) => {
  return CARD.symbols.indexOf(c.symbol) > -1;
};
const isWild = (c) => {
  return CARD.wilds.indexOf(c.symbol) > -1;
};

module.exports = { isNumber, isSymbol, isWild };
