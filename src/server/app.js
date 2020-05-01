const express = require("express");
const path = require("path");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

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

const {
  getPlayersByGameId,
  getUserBySocket,
  registerUser,
  generateToken,
  getGameById,
  myGame,
} = require("./helpers");
const { C, E } = require("./constants");
const config = require("../config");
const logger = require("./logger");
const Game = require("./game/game");

const games = [];
const users = [];

//io.origins("*:*");
//io.listen(config.sockets.port);

io.on("connection", (socket) => {
  logger.verbose(`Socket Connect: ${socket.id}`);

  const updatePlayers = (users, games, game) => {
    getPlayersByGameId(users, games, game.id).forEach((s) => {
      const state = game.status(s.id);
      io.to(s.socket).emit(C.GAME_STATE, state);
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

  socket.on(C.REGISTER_USER, (token, name) => {
    if (!token) {
      token = generateToken();
    }
    registerUser(users, token, socket.id);
    socket.emit(C.PLAYER_ID, { playerId: token });
  });

  socket.on(C.CREATE_GAME, () => {
    const id = generateId();
    games.push(new Game({ id }));
    socket.emit(C.GAME_ID, id);
  });

  socket.on(C.SET_NAME, (name) => {
    const game = myGame(users, games, socket.id);
    const me = getUserBySocket(users, socket.id);

    if (game && me) {
      if (game.players.some((p) => p.name === name)) {
        socket.emit(C.USER_MESSAGE, {
          code: E.NAME_EXISTS,
          message: `You can't set your player name to ${name} as it is already taken.`,
        });
      } else {
        game.setName(me, name);
        socket.emit(C.NAME, name);
        updatePlayers(users, games, game);
      }
    }
  });

  socket.on(C.JOIN_GAME, (gameId, name) => {
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
              socket.emit(C.USER_MESSAGE, {
                code: E.NAME_EXISTS,
                message: `You can't join game #${gameId} as your player name is already taken (${name}).`,
              });
            } else {
              game.addPlayer({ id: me.token, name });
              socket.emit(C.PLAYER_ID, { playerId: me.token });
            }
          } else {
            socket.emit(C.USER_MESSAGE, {
              code: E.STARTED,
              message: `You can't join game #${gameId} as it has already started.`,
            });
          }
        } else {
          socket.emit(C.USER_MESSAGE, {
            code: E.FULL,
            message: `You can't join game #${gameId} as is full up.`,
          });
        }
      }

      socket.emit(C.GAME_ID, game.id); //TODO can we remove?
      updatePlayers(users, games, game);
    } else {
      if (!game) {
        socket.emit(C.USER_MESSAGE, {
          code: E.NO_GAME,
          message: `There is no game #${gameId}!`,
        });
      } else if (!me) {
        socket.emit(C.USER_MESSAGE, {
          code: E.NO_YOU,
          message: `I don't know who you are!`,
        });
      }
    }
  });

  socket.on(C.START_GAME, () => {
    const game = myGame(users, games, socket.id);
    const me = getUserBySocket(users, socket.id);

    if (!game || !me) {
      return socket.emit(C.USER_MESSAGE, {
        code: E.START,
        message: `There's been an unexpected error! Please refresh. [START_GAME]`,
      });
    }

    if (me && game && me.token === game.lead) {
      game.start();
      updatePlayers(users, games, game);
    }
  });

  socket.on(C.DRAW_CARD, () => {
    const game = myGame(users, games, socket.id);
    const me = getUserBySocket(users, socket.id);

    if (!game || !me) {
      return socket.emit(C.USER_MESSAGE, {
        code: E.DRAW,
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

  socket.on(C.CHOOSE_COLOUR, (colour) => {
    const game = myGame(users, games, socket.id);
    const me = getUserBySocket(users, socket.id);
    if (!game || !me) {
      socket.emit(C.USER_MESSAGE, {
        code: E.COLOUR,
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

  socket.on(C.CHOOSE_PLAYER, (player) => {
    const game = myGame(users, games, socket.id);
    const me = getUserBySocket(users, socket.id);
    if (!game || !me) {
      socket.emit(C.USER_MESSAGE, {
        code: E.COLOUR,
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

  socket.on(C.PLAY_CARD, (card) => {
    const game = myGame(users, games, socket.id);
    const me = getUserBySocket(users, socket.id);
    if (!game || !me) {
      return socket.emit(C.USER_MESSAGE, {
        code: E.PLAY,
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

  socket.on(C.DECLARE_UNO, () => {
    const game = myGame(users, games, socket.id);
    const me = getUserBySocket(users, socket.id);
    if (!game || !me) {
      socket.emit(C.USER_MESSAGE, {
        code: E.DECLARE,
        message: `There's been an unexpected error! Please refresh. [PLAY_CARD]`,
      });
      return;
    }

    game.declareUno(me) && updatePlayers(users, games, game);
  });

  socket.on(C.CHALLENGE, () => {
    const game = myGame(users, games, socket.id);
    const me = getUserBySocket(users, socket.id);
    if (!game || !me) {
      socket.emit(C.USER_MESSAGE, {
        code: E.CHALLENGE,
        message: `There's been an unexpected error! Please refresh. [PLAY_CARD]`,
      });
      return;
    }

    game.challenge(me) && updatePlayers(users, games, game);
  });

  // TODO - why this no work
  socket.on(C.CALLOUT, () => {
    const game = myGame(users, games, socket.id);
    if (game) {
      game.callout();
    }
  });

  socket.on(C.EXIT_GAME, (playerId) => {
    const game = myGame(users, games, socket.id);
    const me = getUserBySocket(users, socket.id);

    if (game && me) {
      const isLead = game.lead === me.token;
      const isMe = playerId === me.token;
      const name = game.players.forEach((p) => p.id === playerId);

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
