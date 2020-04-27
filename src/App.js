import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";

import openSocket from "socket.io-client";
import "bulma";

import Welcome from "./panels/Welcome";
import Lobby from "./panels/Lobby";
import Table from "./panels/Table";
import Summary from "./panels/Summary";
import UsernameModal from "./components/UsernameModal";

const socket = openSocket(`localhost:3030`);

function App() {
  const [gameId, setGameId] = useState(false);
  const [game, setGame] = useState(false);
  const [user, setUser] = useState(false);
  const [name, setName] = useState();
  const [error, setError] = useState(false);
  const [userMessage, setUserMessage] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    socket.on("error", (e) => {
      setError(e);
      setUser();
    });
    socket.on("disconnect", (e) => {
      setError(e);
      setUser();
    });
    socket.on("connect", (e) => {
      setError(false);
      setGame(false);
      const playerId = localStorage.getItem("playerId");
      setUser(playerId);
    });

    socket.on("GAME_ID", (id) => {
      localStorage.setItem("gameId", id);
      setGameId(id);
    });

    socket.on("PLAYER_ID", (obj) => {
      localStorage.setItem("playerId", obj.playerId);
      setUser(obj.playerId);
    });

    socket.on("USER_MESSAGE", (obj) => {
      if (obj.code === "E_NO_GAME") {
        localStorage.removeItem("gameId");
        setGameId(false);
      }
      setUserMessage(obj.message);
    });

    socket.on("GAME_STATE", (state) => {
      setUserMessage(false);
      state && setGame(state);
    });

    socket.on("NAME", (incomingName) => {
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
      socket.emit("REGISTER_USER", user);
    }
  }, [user]);

  useEffect(() => {
    if (gameId) {
      console.log("AAAAA", name);
      socket.emit("JOIN_GAME", gameId, name);
    }
  }, [gameId]);

  const exitGame = () => {
    if (!game) {
      socket.emit("EXIT_GAME", game.id);
    }
  };

  return (
    <>
      <div className="container is-widescreen">
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
                      <strong>Game #{gameId}</strong>
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
                  <div className="button is-light">
                    <strong>
                      <span className="icon has-text-dark">
                        <i className="fab fa-github"></i>
                      </span>
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {game.started && game.players.some((p) => p.deck.length === 0) && (
          <Summary game={game} onClose={exitGame} />
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
              class="delete"
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
              />
            )}
            {game && game.players && !game.started && (
              <Lobby game={game} user={user} socket={socket} name={name} />
            )}
            {game && game.players && game.started && (
              <Table game={game} user={user} socket={socket} />
            )}
          </>
        )}
      </div>
    </>
  );
}

export default App;
