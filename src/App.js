import React, { useEffect, useState } from "react";
import io from "socket.io-client";

import config from "./config";
import { C, E } from "./server/constants";
import Welcome from "./panels/Welcome";
import Lobby from "./panels/Lobby";
import Table from "./panels/Table";
import Summary from "./panels/Summary";
import useAudio from "./useAudio";
import pop from "./pop.mp3";

import "bulma";

const socket = io(`${config.sockets.protocol}://${config.sockets.host}`);
console.log(`${config.sockets.protocol}://${config.sockets.host}`);
function App() {
  const [gameId, setGameId] = useState(false);
  const [game, setGame] = useState(false);
  const [user, setUser] = useState(false);
  const [name, setName] = useState();
  const [error, setError] = useState(false);
  const [userMessage, setUserMessage] = useState(false);
  const [connected, setConnected] = useState(false);
  const [showSummary, setShowSummary] = useState(true);
  const [playing, toggle] = useAudio(pop);
  const [topCard, setTopCard] = useState({ symbol: false, colour: false });
  const [mute, setMute] = useState(false);

  useEffect(() => {
    socket.on("error", (e) => {
      setError(e);
      setUser();
      setConnected(false);
    });
    socket.on("disconnect", (e) => {
      setError(e);
      setUser();
      setConnected(false);
    });
    socket.on("connect", (e) => {
      setError(false);
      setGame(false);
      setConnected(true);
      const playerId = localStorage.getItem("playerId");
      setUser(playerId);
    });

    socket.on(C.GAME_ID, (id) => {
      localStorage.setItem("gameId", id);
      setGameId(id);
    });

    socket.on(C.PLAYER_ID, (obj) => {
      localStorage.setItem("playerId", obj.playerId);
      setUser(obj.playerId);
    });

    socket.on(C.USER_MESSAGE, (obj) => {
      if (obj.code === E.NO_GAME) {
        localStorage.removeItem("gameId");
        setGameId(false);
      }
      setUserMessage(obj.message);
    });

    socket.on(C.GAME_STATE, (state) => {
      setUserMessage(false);
      state && setGame(state);
    });

    socket.on(C.NAME, (incomingName) => {
      if (incomingName) {
        localStorage.setItem("name", incomingName);
        setName(incomingName);
      }
    });
  }, []);

  useEffect(() => {
    const savedName = localStorage.getItem("name");
    const savedPlayerId = localStorage.getItem("playerId");
    const savedGameId = localStorage.getItem("gameId");
    setName(savedName);
    setUser(savedPlayerId);
    setGameId(savedGameId);
  }, []);

  useEffect(() => {
    if (user) {
      socket.emit(C.REGISTER_USER, user);
    }
  }, [user]);

  useEffect(() => {
    if (gameId) {
      socket.emit(C.JOIN_GAME, gameId, name);
    }
  }, [gameId, name]);

  useEffect(() => {
    if (topCard && game.topCard) {
      const diffCard =
        topCard.symbol !== game.topCard.symbol ||
        topCard.colour !== game.topCard.colour;
      if (diffCard && !mute) {
        setTopCard(game.topCard);
      }
    }
  }, [game]);

  const exitGame = (playerId) => {
    let copy = "You're about to kick this user from the game. Continue?";
    if (playerId === user) {
      copy = "You're about to leave the game - are you sure?";
    }
    const sure = window.confirm(copy);
    if (game && sure) {
      socket.emit(C.EXIT_GAME, playerId);

      if (playerId === user) {
        localStorage.removeItem("gameId");
        setGame(false);
        setGameId(false);
      }
    }
  };

  return (
    <>
      <div
        className={` ${
          game && game.players && game.started ? "" : "container is-widescreen"
        }`}
      >
        <nav className="navbar" role="navigation" aria-label="main navigation">
          <div id="navbarBasicExample" className="navbar-menu">
            <div className="navbar-brand">
              <div className="navbar-item">
                <div className="button is-info">
                  <strong>Online Multiplayer Uno!</strong>
                </div>
              </div>
            </div>

            <div className="navbar-end">
              <div className="navbar-item">
                <div className="buttons">
                  {gameId && (
                    <div className="button is-primary">
                      <strong>#{gameId}</strong>
                    </div>
                  )}
                  {(name || user) && (
                    <div className="button is-warning">
                      <strong>
                        <span className="icon has-text-dark">
                          <i className="fas fa-user"></i>
                        </span>
                        <span>{name ? name : user}</span>
                      </strong>
                    </div>
                  )}
                  <a
                    className="button is-light"
                    target="_blank"
                    href="https://github.com/conorriches/OnlineMultiplayerUno"
                  >
                    <strong>
                      <span className="icon has-text-dark">
                        <i className="fab fa-github"></i>
                      </span>
                    </strong>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {game.started &&
          game.players.some((p) => p.deck.length === 0) &&
          showSummary && (
            <Summary game={game} onClose={() => setShowSummary(false)} />
          )}

        {error && (
          <div className="notification is-danger">
            <b>The connection to the server has failed.</b> <br />
            If it's just your internet, you'll be automatically reconnected and
            the game will resume from where you were at.
          </div>
        )}

        {userMessage && (
          <div className="notification is-danger">
            <button
              className="delete"
              onClick={() => setUserMessage(false)}
            ></button>
            {userMessage}
          </div>
        )}

        {!error && (
          <>
            {!game && (
              <Welcome
                game={game}
                user={user}
                socket={socket}
                onGameId={(id) => setGameId(id)}
                connected={connected}
              />
            )}
            {game && game.players && !game.started && (
              <Lobby
                game={game}
                user={user}
                socket={socket}
                name={name}
                onLeave={exitGame}
              />
            )}
            {game && game.players && game.started && (
              <Table
                game={game}
                user={user}
                socket={socket}
                onLeave={exitGame}
                mute={mute}
                onMute={setMute}
              />
            )}
          </>
        )}
      </div>
    </>
  );
}

export default App;
