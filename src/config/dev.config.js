module.exports = {
  server: {
    port: "5000",
  },
  sockets: {
    protocol: "http",
    host: "localhost",
  },
  game: {
    maxExtraDraw: 5,
    deckTwoThreshold: 3,
    deckThreeThreshold: 8,
  },
};
