import React from "react";

const Lobby = ({ game, user, socket }) => {
  const start = () => {
    console.log("START");
    socket.emit("START_GAME");
  };

  return (
    <section class="hero is-primary is-bold">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">Uno</h1>
          <h2 class="subtitle">
            You're in game <span class="tag is-primary">#{game.id}</span> but
            the game hasn't started yet. <br />
            Only the game lead (
            <span class="tag is-danger is-small">{game.lead}</span>) can start
            the game.
          </h2>
        </div>
        <br />
        <div class="container">
          <h2 class="subtitle">Current Players:</h2>
          <ul>
            {console.log(game.players)}
            {game.players.map((p) => (
              <span
                class={`tag is-medium is-dark
              ${p.id == user && "is-warning"}
              ${p.id == game.lead && "is-danger"}
              `}
              >
                {p.name} ({p.id}){p === user && " (you)"}
                {p.id === game.lead && " (lead)"}
              </span>
            ))}
          </ul>
        </div>

        <br />
        <div class="container">
          {user === game.lead && (
            <>
              <div class="box">
                <button class="button is-primary" onClick={start}>
                  START
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Lobby;
