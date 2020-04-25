import React, { useState, useEffect } from "react";

const Welcome = ({ game, user, socket }) => {
  const [gameId, setGameId] = useState(1234);

  useEffect(() => {
    if (gameId && gameId.length === 4) {
      socket.emit("JOIN_GAME", gameId);
    }
  }, [gameId]);

  useEffect(() => {
    const playerId = localStorage.getItem("playerId");
    socket.emit("REGISTER_USER", playerId);
  }, []);

  return (
    <section className="hero is-warning is-bold">
      <div className="hero-body">
        <div className="container">
          <h1 className="title">Online Multiplayer Uno</h1>

          <article className="message is-info">
            <div className="message-header">
              <p>Join a game</p>
            </div>
            <div className="message-body">
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

          <article className="message is-warning">
            <div className="message-header">
              <p>Create a game</p>
            </div>
            <div className="message-body">
              <p>Coming soon, create a room for your friends to join</p>
              <button className="button is-warning">Create new game</button>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};

export default Welcome;
