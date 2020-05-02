module.exports = {
  server: {
    port: "3000",
  },
  sockets: {
    protocol: "https",
    host: "multiplayer-uno.herokuapp.com",
  },
  game: {
    maxExtraDraw: 5,
    deckTwoThreshold: 3,
    deckThreeThreshold: 8,
  },
};
