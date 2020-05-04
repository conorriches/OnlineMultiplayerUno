const express = require("express");
const path = require("path");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

const {
  getPlayersByGameId,
  getUserBySocket,
  registerUser,
  generateToken,
  getGameById,
  myGame,
} = require("./helpers");
const { ACTION, ERROR } = require("./constants");
const Config = require("../config");
const logger = require("./logger");
const Game = require("./game/game");

app.use(express.static(path.join(__dirname, "../", "../", "build")));

app.get("/", function (req, res) {
  if (process.env.NODE_ENV === "production") {
    res.sendFile(path.join(__dirname, "../", "../", "build", "index.html"));
  } else {
    res.send(
      "<h1>[see: README]</h1><h2> You're running the server, but to access the client (with hot reloading) please go to localhost://3000.</h2>"
    );
  }
});

server.listen(process.env.PORT, () =>
  console.log(
    `Online Multiplayer Uno is running on port http://localhost:${process.env.PORT}`
  )
);

const games = [];
const users = [];

//io.origins("*:*");

io.on("connection", (socket) => {
  logger.verbose(`Socket Connect: ${socket.id}`);

  const updatePlayers = (users, games, game) => {
    getPlayersByGameId(users, games, game.id).forEach((s) => {
      const state = game.status(s.id);
      io.to(s.socket).emit(ACTION.GAME_STATE, state);
    });
  };

  const generateId = () => {
    let id;
    for (let i = 0; i < 9999; i++) {
      id = Math.floor(1000 + Math.random() * 9000);

      if (!games.some((g) => g.id === id)) {
        return id;
      }
      logger.warn(`Generating ID attempt: ${i}`);
    }
  };

  const deleteGame = (gameIdToDelete) => {
    let index;
    games.forEach((g, i) => {
      if (g.id === gameIdToDelete) {
        index = i;
      }
    });
    games.splice(index, 1);
  };

  socket.on(ACTION.REGISTER_USER, (token, name) => {
    if (!token) {
      token = generateToken();
    }
    registerUser(users, token, socket.id);
    socket.emit(ACTION.PLAYER_ID, { playerId: token });
  });

  socket.on(ACTION.CREATE_GAME, () => {
    const id = generateId();
    games.push(new Game({ id }));
    socket.emit(ACTION.GAME_ID, id);
  });

  socket.on(ACTION.SET_NAME, (name) => {
    const game = myGame(users, games, socket.id);
    const me = getUserBySocket(users, socket.id);

    if (game && me) {
      if (game.players.some((p) => p.name === name)) {
        socket.emit(ACTION.USER_MESSAGE, {
          code: ERROR.NAME_EXISTS,
          message: `You can't set your player name to ${name} as it is already taken.`,
        });
      } else {
        game.setName(me, name);
        socket.emit(ACTION.NAME, name);
        updatePlayers(users, games, game);
      }
    }
  });

  socket.on(ACTION.JOIN_GAME, (gameId, name) => {
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
              socket.emit(ACTION.USER_MESSAGE, {
                code: ERROR.NAME_EXISTS,
                message: `You can't join game #${gameId} as your player name is already taken (${name}).`,
              });
            } else {
              game.addPlayer({ id: me.token, name });
              socket.emit(ACTION.PLAYER_ID, { playerId: me.token });
            }
          } else {
            socket.emit(ACTION.USER_MESSAGE, {
              code: ERROR.STARTED,
              message: `You can't join game #${gameId} as it has already started.`,
            });
          }
        } else {
          socket.emit(ACTION.USER_MESSAGE, {
            code: ERROR.FULL,
            message: `You can't join game #${gameId} as is full up.`,
          });
        }
      }

      socket.emit(ACTION.GAME_ID, game.id); //TODO can we remove?
      updatePlayers(users, games, game);
    } else {
      if (!game) {
        socket.emit(ACTION.USER_MESSAGE, {
          code: ERROR.NO_GAME,
          message: `There is no game #${gameId}!`,
        });
      } else if (!me) {
        socket.emit(ACTION.USER_MESSAGE, {
          code: ERROR.NO_YOU,
          message: `I don't know who you are!`,
        });
      }
    }
  });

  socket.on(ACTION.START_GAME, () => {
    const game = myGame(users, games, socket.id);
    const me = getUserBySocket(users, socket.id);

    if (!game || !me) {
      return socket.emit(ACTION.USER_MESSAGE, {
        code: ERROR.START,
        message: `There's been an unexpected error! Please refresh. [START_GAME]`,
      });
    }

    if (me && game && me.token === game.lead) {
      game.start();
      updatePlayers(users, games, game);
    }
  });

  socket.on(ACTION.DRAW_CARD, () => {
    const game = myGame(users, games, socket.id);
    const me = getUserBySocket(users, socket.id);

    if (!game || !me) {
      return socket.emit(ACTION.USER_MESSAGE, {
        code: ERROR.DRAW,
        message: `There's been an unexpected error! Please refresh. [DRAW_CARD]`,
      });
    }

    if (me.token === game.player) {
      let hasMatch = false;
      game.players.forEach((p) => {
        if (p.id === me.token) {
          hasMatch = p.deck.some((c) =>
            game.matches(true, game.discard[game.discard.length - 1], c)
          );
        }
      });
      if (
        game.criteria.length ||
        !hasMatch ||
        game.drawCount < Config.game.maxExtraDraw
      ) {
        const result = game.drawCard(me.token);
        if (game.criteria) {
          if (!game.criteria) game.shouldIncrementPlayer();
        }

        if (result) {
          updatePlayers(users, games, game);
        }
      }
    }
  });

  socket.on(ACTION.CHOOSE_COLOUR, (colour) => {
    const game = myGame(users, games, socket.id);
    const me = getUserBySocket(users, socket.id);
    if (!game || !me) {
      socket.emit(ACTION.USER_MESSAGE, {
        code: ERROR.COLOUR,
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

  socket.on(ACTION.CHOOSE_PLAYER, (player) => {
    const game = myGame(users, games, socket.id);
    const me = getUserBySocket(users, socket.id);
    if (!game || !me) {
      socket.emit(ACTION.USER_MESSAGE, {
        code: ERROR.COLOUR,
        message: `There's been an unexpected error! Please refresh. [CHOOSE_PLAYER]`,
      });
    }

    const myName = game.players.filter((p) => p.id === me.token)[0].name;
    const swappingWith = game.players.filter((p) => p.id === player)[0];

    if (game.player !== me.token) {
      return false;
    }

    if (game.swapDecks(me.token, player)) {
      game.criteria = [];
      game.addMessage(myName, `swaps cards with ${swappingWith.name}`);
      game.shouldIncrementPlayer();
      updatePlayers(users, games, game);
    }
  });

  socket.on(ACTION.PLAY_CARD, (card) => {
    const game = myGame(users, games, socket.id);
    const me = getUserBySocket(users, socket.id);
    if (!game || !me) {
      return socket.emit(ACTION.USER_MESSAGE, {
        code: ERROR.PLAY,
        message: `There's been an unexpected error! Please refresh. [PLAY_CARD]`,
      });
    }

    const name = game.players.filter((p) => p.id === me.token)[0].name;
    const response = game.playCard(card, me.token);

    if (response) {
      game.players
        .filter((p) => p.deck.length == 1)
        .forEach(
          (p) =>
            p.id === me.token &&
            game.addMessage(false, `${name} has just one card left`)
        );
      game.shouldIncrementPlayer();

      updatePlayers(users, games, game);
    }
  });

  socket.on(ACTION.DECLARE_UNO, () => {
    const game = myGame(users, games, socket.id);
    const me = getUserBySocket(users, socket.id);
    if (!game || !me) {
      socket.emit(ACTION.USER_MESSAGE, {
        code: ERROR.DECLARE,
        message: `There's been an unexpected error! Please refresh. [PLAY_CARD]`,
      });
      return;
    }

    game.declareUno(me) && updatePlayers(users, games, game);
  });

  socket.on(ACTION.CHALLENGE, () => {
    const game = myGame(users, games, socket.id);
    const me = getUserBySocket(users, socket.id);
    if (!game || !me) {
      socket.emit(ACTION.USER_MESSAGE, {
        code: ERROR.CHALLENGE,
        message: `There's been an unexpected error! Please refresh. [CHALLENGE]`,
      });
      return;
    }

    game.challenge(me) && updatePlayers(users, games, game);
  });

  // TODO - why this no work
  socket.on(ACTION.CALLOUT, () => {
    const game = myGame(users, games, socket.id);
    const me = getUserBySocket(users, socket.id);

    if (game && me) {
      game.callout(me.token);
      updatePlayers(users, games, game);
    }
  });

  socket.on(ACTION.EXIT_GAME, (playerId) => {
    const game = myGame(users, games, socket.id);
    const me = getUserBySocket(users, socket.id);

    if (game && me) {
      const isLead = game.lead === me.token;
      const isMe = playerId === me.token;
      const name = game.players.forEach((p) => p.id === playerId);

      if (isLead && isMe) {
        return deleteGame(game.id);
      }

      if (game.players.length === 1) {
        return deleteGame(game.id);
      }

      if (isLead || isMe) {
        game.removePlayer(playerId, name ? name[0].name : false);
        updatePlayers(users, games, game);
      }
    }
  });

  socket.on("disconnect", function () {
    logger.verbose(`Socket Disconnect: ${socket.id}`);
    socket.disconnect();
  });
});
