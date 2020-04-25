import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";

import openSocket from "socket.io-client";
import "bulma";

import Welcome from "./panels/Welcome";
import Lobby from "./panels/Lobby";
import Table from "./panels/Table";

const socket = openSocket(`localhost:3030`);

function App() {
  const [game, setGame] = useState(false);
  const [user, setUser] = useState(false);
  const [error, setError] = useState(true);
  const [userMessage, setUserMessage] = useState(false);

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
      const playerId = localStorage.getItem("playerId");
      setUser(playerId);
    });

    socket.on("PLAYER_ID", (obj) => {
      localStorage.setItem("playerId", obj.playerId);
    });

    socket.on("USER_MESSAGE", (obj) => {
      setUserMessage(obj);
    });

    socket.on("GAME_STATE", (state) => {
      setUserMessage(false);
      state && setGame(state);
    });
  }, []);

  useEffect(() => {
    const playerId = localStorage.getItem("playerId");
    setUser(playerId);
  }, []);

  useEffect(() => {
    if (user) {
      socket.emit("REGISTER_USER", user);
      //socket.emit("JOIN_GAME", 1234);
      //socket.emit("START_GAME");
    }
  }, [user]);

  return (
    <>
      <div className="container">
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
                  {game.id && (
                    <div className="button is-primary">
                      <strong> #{game.id}</strong>
                    </div>
                  )}
                  {user && (
                    <div className="button is-warning">
                      <strong>
                        {game
                          ? game.players.filter((p) => p.id === user)[0].name
                          : user}
                      </strong>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </nav>

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
            {!game && <Welcome game={game} user={user} socket={socket} />}
            {game && game.players && !game.started && (
              <Lobby game={game} user={user} socket={socket} />
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
