const io = require("socket.io")();
const {
  updatePlayersByGameId,
  getSocketByToken,
  getUserBySocket,
  registerUser,
  generateToken,
  getGameById,
  myGame,
  filterOtherPlayerCards,
} = require("./helpers");

io.origins("*:*"); // for latest version

var logger = require("./logger");
var Game = require("./rules/game");

const games = [];
const users = [];

this.runningIntegrations = {};
this.clients = [];
io.listen(3030);
games.push(new Game({ id: 1234 }));
games[0].addPlayer({ id: "_eap2lhlwx", name: "Alice" });
games[0].addPlayer({ id: "_123", name: "Bob" });
games[0].addPlayer({ id: "_234", name: "Cone" });
games[0].addPlayer({ id: "_345", name: "Drew" });

io.on("connection", (socket) => {
  logger.verbose(`Socket Connect: ${socket.id}`);

  socket.on("REGISTER_USER", (token, name) => {
    if (!token) {
      token = generateToken();
    }
    registerUser(users, token, socket.id);
    socket.emit("PLAYER_ID", { playerId: token });
  });

  socket.on("JOIN_GAME", (gameId) => {
    const me = getUserBySocket(users, socket.id);
    const game = getGameById(games, gameId);

    const exists = game.players.map((p) => p.id).indexOf(me.token) > -1;
    if (game && me && !exists) {
      game.players.push({ id: me.token, name: "Testing" });
    }

    if (game) {
      updatePlayersByGameId(users, games, game.id).forEach((s) => {
        io.to(s).emit("GAME_STATE", game.status(me));
      });
    }
  });

  socket.on("START_GAME", () => {
    const game = myGame(users, games, socket.id);
    const me = getUserBySocket(users, socket.id);

    if (me.token === game.lead) {
      logger.verbose("Start game by" + socket.id);
      game.start();
      updatePlayersByGameId(users, games, game.id).forEach((s) => {
        io.to(s).emit("GAME_STATE", game.status(me));
      });
    }
  });

  socket.on("disconnect", function () {
    logger.verbose(`Socket Disconnect: ${socket.id}`);
    socket.disconnect();
  });
});
