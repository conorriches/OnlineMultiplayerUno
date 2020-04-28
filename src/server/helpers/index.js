var logger = require("../logger");

exports.getPlayersByGameId = (users, games, gameId) => {
  const game = this.getGameById(games, gameId);
  const sockets = [];

  game.players.forEach((p) => {
    const s = this.getSocketByToken(users, p.id);
    if (s) {
      sockets.push({
        socket: s.socket,
        ...p,
      });
    }
  });

  return sockets;
};

exports.getSocketByToken = (users, token) => {
  const matches = users.filter((u) => u.token === token);
  return matches ? matches[0] : false;
};

exports.getUserBySocket = (users, socketId) => {
  return users.filter((u) => u.socket === socketId)[0];
};

exports.registerUser = (users, token, socket) => {
  let index = -1;

  users.some((u, i) => {
    if (u.token === token) {
      index = i;
    }
    return index !== -1;
  });

  if (index > -1) {
    users.splice(index, 1);
  }

  users.push({
    token,
    socket,
  });
  logger.info("Registered user " + token + " on " + socket);
};

exports.generateToken = () => {
  logger.info("Generating token");
  return "_" + Math.random().toString(36).substr(2, 9);
};

exports.getGameById = (games, gameId) => {
  return games.filter((g) => g.id == gameId)[0];
};

exports.myGame = (users, games, socketId) => {
  let token;
  let game;

  users.map((u) => {
    if (u.socket === socketId) {
      token = u.token;
      return;
    }
  });

  if (token) {
    games.map((g) => {
      if (g.players.map((p) => p.id).indexOf(token) > -1) {
        game = g;
        return;
      }
    });
  }
  return game;
};
