var logger = require("../logger");

exports.updatePlayersByGameId = (users, games, gameId) => {
  const game = this.getGameById(games, gameId);
  const sockets = [];
  game.players.forEach((p) => {
    const s = this.getSocketByToken(users, p.id);
    if (s) {
      sockets.push(s.socket);
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
  users.splice(users.map((u) => u.socket).indexOf(socket), 1);
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

exports.filterOtherPlayerCards = (game, me, socket) => {
  console.log(me);
  return game;
};
