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

  useEffect(() => {
    socket.on("PLAYER_ID", (obj) => {
      localStorage.setItem("playerId", obj.playerId);
    });

    socket.on("GAME_STATE", (state) => {
      console.log("GOT GAME STATE", state);
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
        <nav class="navbar" role="navigation" aria-label="main navigation">
          <div id="navbarBasicExample" class="navbar-menu">
            <div class="navbar-brand">
              <div class="navbar-item">
                <div class="button is-info">
                  <strong>Online Multiplayer Uno!</strong>
                </div>
              </div>
            </div>

            <div class="navbar-end">
              <div class="navbar-item">
                <div class="buttons">
                  {game.id && (
                    <div class="button is-primary">
                      <strong> #{game.id}</strong>
                    </div>
                  )}
                  {user && (
                    <div class="button is-warning">
                      <strong> {user}</strong>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </nav>

        {!game && <Welcome game={game} user={user} socket={socket} />}
        {game && game.players && !game.started && (
          <Lobby game={game} user={user} socket={socket} />
        )}
        {game && game.players && game.started && (
          <Table game={game} user={user} socket={socket} />
        )}
      </div>
    </>
  );
}

export default App;
