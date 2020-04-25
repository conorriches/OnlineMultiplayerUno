const io = require("socket.io")();
const {
  getPlayersByGameId,
  getUserBySocket,
  registerUser,
  generateToken,
  getGameById,
  myGame,
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
games[0].addPlayer({ id: "_lapwjldrv", name: "Alice" });

io.on("connection", (socket) => {
  logger.verbose(`Socket Connect: ${socket.id}`);

  const updatePlayers = (users, games, game) => {
    getPlayersByGameId(users, games, game.id).forEach((s) => {
      const state = game.status(s.id);
      io.to(s.socket).emit("GAME_STATE", state);
    });
  };

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

    if (game && me) {
      const exists = game.players.map((p) => p.id).indexOf(me.token) > -1;
      if (!exists) {
        if (game.players.length < 9) {
          if (!game.started) {
            game.players.push({ id: me.token, name: "Testing", deck: [] });
          } else {
            socket.emit(
              "USER_MESSAGE",
              `You can't join game #${gameId} as it has already started.`
            );
          }
        } else {
          socket.emit(
            "USER_MESSAGE",
            `You can't join game #${gameId} as is full up.`
          );
        }
      }

      getPlayersByGameId(users, games, game.id).forEach((s) => {
        io.to(s.socket).emit("GAME_STATE", game.status(s.id));
      });
    } else {
      if (!game) {
        socket.emit("USER_MESSAGE", `There is no game #${gameId}!`);
      } else if (!me) {
        socket.emit("USER_MESSAGE", `I don't know who you are!`);
      }
    }
  });

  socket.on("START_GAME", () => {
    const game = myGame(users, games, socket.id);
    const me = getUserBySocket(users, socket.id);

    if (!game || !me) {
      socket.emit(
        "USER_MESSAGE",
        `There's been an unexpected error! Please refresh. [START_GAME]`
      );
    }

    if (me && game && me.token === game.lead) {
      logger.verbose("Start game by" + socket.id);
      game.start();

      updatePlayers(users, games, game);
    }
  });

  socket.on("DRAW_CARD", () => {
    const game = myGame(users, games, socket.id);
    const me = getUserBySocket(users, socket.id);

    if (!game || !me) {
      socket.emit(
        "USER_MESSAGE",
        `There's been an unexpected error! Please refresh. [DRAW_CARD]`
      );
    }

    if (me.token === game.player) {
      const result = game.drawCard(me);
      if (game.criteria) {
        if (!game.criteria) game.shouldIncrementPlayer();
      }

      if (result) {
        updatePlayers(users, games, game);
      }
    }
  });

  socket.on("CHOOSE_COLOUR", (colour) => {
    const game = myGame(users, games, socket.id);
    const me = getUserBySocket(users, socket.id);
    if (!game || !me) {
      socket.emit(
        "USER_MESSAGE",
        `There's been an unexpected error! Please refresh. [CHOOSE_COLOUR]`
      );
    }

    const name = game.players.filter((p) => p.id === me.token)[0].name;

    if (game.setColour(me, colour)) {
      game.addMessage(name, `set the colour to ${colour}`);
      game.shouldIncrementPlayer();
      updatePlayers(users, games, game);
    }
  });

  socket.on("PLAY_CARD", (card) => {
    const game = myGame(users, games, socket.id);
    const me = getUserBySocket(users, socket.id);
    if (!game || !me) {
      socket.emit(
        "USER_MESSAGE",
        `There's been an unexpected error! Please refresh. [PLAY_CARD]`
      );
    }

    const name = game.players.filter((p) => p.id === me.token)[0].name;

    const response = game.playCard(card, me.token);

    if (response) {
      game.shouldIncrementPlayer();

      game.players
        .filter((p) => p.deck.length == 1)
        .forEach((p) =>
          game.addMessage(false, `${name} has just one card left`)
        );

      updatePlayers(users, games, game);
    }
  });

  socket.on("disconnect", function () {
    logger.verbose(`Socket Disconnect: ${socket.id}`);
    socket.disconnect();
  });
});
