import React, { useState, useEffect } from "react";

const Welcome = ({ game, user, socket }) => {
  const [gameId, setGameId] = useState(1234);

  useEffect(() => {
    if (gameId && gameId.length === 4) {
      console.log("JOINING GAM", gameId);
      socket.emit("JOIN_GAME", gameId);
    }
  }, [gameId]);

  useEffect(() => {
    const playerId = localStorage.getItem("playerId");
    socket.emit("REGISTER_USER", playerId);
  }, []);

  return (
    <section class="hero is-warning is-bold">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">Online Multiplayer Uno</h1>

          <article class="message is-info">
            <div class="message-header">
              <p>Join a game</p>
            </div>
            <div class="message-body">
              <p>
                To join a game, enter the game ID. You'll automatically be
                entered.
              </p>
              <input
                onChange={(e) => setGameId(e.target.value)}
                placeholder="_ _ _ _"
              />
            </div>
          </article>

          <article class="message is-warning">
            <div class="message-header">
              <p>Create a game</p>
            </div>
            <div class="message-body">
              <p>Coming soon, create a room for your friends to join</p>
              <button class="button is-warning">Create new game</button>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};

export default Welcome;
