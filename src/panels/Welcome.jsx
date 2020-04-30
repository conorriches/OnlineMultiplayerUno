import React, { useState, useEffect } from "react";

const Welcome = ({ connected, socket, onGameId }) => {
  const [gameId, setGameId] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (gameId && gameId.length === 4) {
      onGameId(gameId);
    }
  }, [gameId, onGameId]);

  useEffect(() => {
    const playerId = localStorage.getItem("playerId");
    socket.emit("REGISTER_USER", playerId);
  }, [socket]);

  const createGame = () => {
    socket.emit("CREATE_GAME");
  };

  return (
    <section className="hero is-primary is-bold welcome">
      <div className="hero-body">
        <div className="container">
          <h1 className="title">Online Multiplayer Uno</h1>
          <h2 className="subtitle">with House Rules!</h2>

          {!connected && (
            <div className="notification is-dark">
              Connecting to live game server...
            </div>
          )}

          {connected && (
            <>
              <article className="message is-link">
                <div className="message-header">
                  <p>Join a game</p>
                </div>
                <div className="message-body">
                  <div className="level">
                    <p>
                      To join a game, enter the game ID. You'll automatically be
                      entered.
                    </p>
                  </div>
                  <div className="field">
                    <div
                      className={`control is-medium has-icons-left ${
                        loading && "is-loading"
                      }`}
                    >
                      <input
                        className="input is-primary is-medium "
                        type="text"
                        onChange={(e) => {
                          setLoading(true);
                          setGameId(e.target.value);
                        }}
                      />
                      <span className="icon is-small is-left">
                        <i className="fas fa-hashtag"></i>
                      </span>
                    </div>
                  </div>
                </div>
              </article>

              <article className="message is-warning">
                <div className="message-header">
                  <p>Create a game</p>
                </div>
                <div className="message-body">
                  <div className="level">
                    <p>
                      Create a new game, then share the game ID for your friends
                      to join.
                    </p>
                  </div>
                  <button
                    className="button is-warning"
                    onClick={() => {
                      createGame();
                    }}
                  >
                    Create new game
                  </button>
                </div>
              </article>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Welcome;
