module.exports = {
  server: {
    port: "3000",
  },
  sockets: {
    protocol: "ws",
    host: "multiplayer-uno.herokuapp.com",
    port: "3030",
  },
  players: {
    minimum: 3,
    maximum: 10,
  },
};
