import React from "react";

const Lobby = ({ game, user, socket }) => {
  const start = () => {
    socket.emit("START_GAME");
  };

  return (
    <section className="hero is-primary is-bold">
      <div className="hero-body">
        <div className="container">
          <h1 className="title">Uno</h1>
          <h2 className="subtitle">
            You're in game <span className="tag is-primary">#{game.id}</span>{" "}
            but the game hasn't started yet. <br />
            Only the game lead (
            {game.players.filter((p) => p.id === game.lead)[0].name}) can start
            the game.
          </h2>

          <div className="columns">
            <div className="column is-two-thirds">
              <h2 className="subtitle">Current Players:</h2>
              <div className="tags">
                {game.players.map((p) => (
                  <span
                    className={`tag is-medium is-dark
                ${p.id == user && "is-warning"}
                ${p.id == game.lead && "is-danger"}
                `}
                  >
                    {p.name}
                    {p.id === user && " (you)"}
                    {p.id === game.lead && " (lead)"}
                  </span>
                ))}
              </div>
            </div>
            <div className="column">
              {user === game.lead && (
                <>
                  <div className="box">
                    <h2 class="subtitle">Once everyone is in the room:</h2>
                    <button className="button is-primary" onClick={start}>
                      START
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Lobby;
