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

io.on("connection", (socket) => {
  logger.verbose(`Socket Connect: ${socket.id}`);

  const updatePlayers = (users, games, game) => {
    getPlayersByGameId(users, games, game.id).forEach((s) => {
      const state = game.status(s.id);
      io.to(s.socket).emit("GAME_STATE", state);
    });
  };

  const generateId = () => {
    // TODO: is there a clash?
    return Math.floor(1000 + Math.random() * 9000);
  };

  socket.on("REGISTER_USER", (token, name) => {
    if (!token) {
      token = generateToken();
    }
    registerUser(users, token, socket.id);
    socket.emit("PLAYER_ID", { playerId: token });
  });

  socket.on("CREATE_GAME", () => {
    const id = generateId();
    games.push(new Game({ id }));
    socket.emit("GAME_ID", id);
  });

  socket.on("SET_NAME", (name) => {
    const game = myGame(users, games, socket.id);
    const me = getUserBySocket(users, socket.id);

    if (game && me) {
      if (game.players.some((p) => p.name === name)) {
        socket.emit("USER_MESSAGE", {
          code: "E_NAME_EXIST",
          message: `You can't set your player name to ${name} as it is already taken.`,
        });
      } else {
        game.setName(me, name);
        socket.emit("NAME", name);
        getPlayersByGameId(users, games, game.id).forEach((s) => {
          io.to(s.socket).emit("GAME_STATE", game.status(s.id));
        });
      }
    }
  });

  socket.on("JOIN_GAME", (gameId, name) => {
    const me = getUserBySocket(users, socket.id);
    const game = getGameById(games, gameId);

    if (game && me) {
      const exists = game.players.map((p) => p.id).indexOf(me.token) > -1;
      if (!exists) {
        if (game.players.length < 9) {
          if (!game.started) {
            if (game.players.length === 0) {
              game.lead = me.token;
            }
            if (game.players.some((p) => p.name === name)) {
              socket.emit("USER_MESSAGE", {
                code: "E_NAME_EXIST",
                message: `You can't join game #${gameId} as your player name is already taken (${name}).`,
              });
            } else {
              game.addPlayer({ id: me.token, name });
              socket.emit("PLAYER_ID", { playerId: me.token });
            }
          } else {
            socket.emit("USER_MESSAGE", {
              code: "E_STARTED",
              message: `You can't join game #${gameId} as it has already started.`,
            });
          }
        } else {
          socket.emit("USER_MESSAGE", {
            code: "E_FULL",
            message: `You can't join game #${gameId} as is full up.`,
          });
        }
      }

      socket.emit("GAME_ID", game.id); //TODO can we remove?
      getPlayersByGameId(users, games, game.id).forEach((s) => {
        io.to(s.socket).emit("GAME_STATE", game.status(s.id));
      });
    } else {
      if (!game) {
        socket.emit("USER_MESSAGE", {
          code: "E_NO_GAME",
          message: `There is no game #${gameId}!`,
        });
      } else if (!me) {
        socket.emit("USER_MESSAGE", {
          code: "E_NO_YOU",
          message: `I don't know who you are!`,
        });
      }
    }
  });

  socket.on("START_GAME", () => {
    const game = myGame(users, games, socket.id);
    const me = getUserBySocket(users, socket.id);

    if (!game || !me) {
      return socket.emit("USER_MESSAGE", {
        code: "E_START",
        message: `There's been an unexpected error! Please refresh. [START_GAME]`,
      });
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
      return socket.emit("USER_MESSAGE", {
        code: "E_DRAW",
        message: `There's been an unexpected error! Please refresh. [DRAW_CARD]`,
      });
    }

    if (me.token === game.player) {
      const result = game.drawCard(me.token);
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
      socket.emit("USER_MESSAGE", {
        code: "E_COLOUR",
        message: `There's been an unexpected error! Please refresh. [CHOOSE_COLOUR]`,
      });
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
      return socket.emit("USER_MESSAGE", {
        code: "E_PLAY",
        message: `There's been an unexpected error! Please refresh. [PLAY_CARD]`,
      });
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

  socket.on("DECLARE_UNO", () => {
    const game = myGame(users, games, socket.id);
    const me = getUserBySocket(users, socket.id);
    if (!game || !me) {
      socket.emit("USER_MESSAGE", {
        code: "E_DECLARE",
        message: `There's been an unexpected error! Please refresh. [PLAY_CARD]`,
      });
      return;
    }

    game.declareUno(me) && updatePlayers(users, games, game);
  });

  socket.on("CHALLENGE", () => {
    const game = myGame(users, games, socket.id);
    const me = getUserBySocket(users, socket.id);
    if (!game || !me) {
      socket.emit("USER_MESSAGE", {
        code: "E_CHALLENGE",
        message: `There's been an unexpected error! Please refresh. [PLAY_CARD]`,
      });
      return;
    }

    game.challenge(me) && updatePlayers(users, games, game);
  });

  // TODO - why this no work
  socket.on("CALLOUT", () => {
    const game = myGame(users, games, socket.id);
    if (game) {
      game.callout();
    }
  });

  socket.on("EXIT_GAME", () => {
    const game = myGame(users, games, socket.id);
    const me = getUserBySocket(users, socket.id);
    if (game && me) {
      game.removePlayer(me.token);
    }
  });

  socket.on("disconnect", function () {
    logger.verbose(`Socket Disconnect: ${socket.id}`);
    socket.disconnect();
  });
});
