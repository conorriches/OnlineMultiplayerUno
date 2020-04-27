import React, { useState, useEffect } from "react";

import UsernameModal from "../components/UsernameModal";

const Lobby = ({ game, user, socket, name }) => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setShowModal(false);
  }, [name]);

  const start = () => {
    socket.emit("START_GAME");
  };

  const onEditName = () => {
    setShowModal(true);
  };

  const disableStart = { disabled: game.players.length < 3 };

  return (
    <>
      <section className="hero is-info is-bold">
        <div className="hero-body">
          <div className="container">
            <h1 className="title">
              <span className="tag is-black is-large">Game #{game.id}</span>
            </h1>

            <h2 className="subtitle">
              Welcome to game #{game.id}!<br /> The game hasn't started yet,
              only the game lead (
              {game.players.filter((p) => p.id === game.lead)[0].name}) can
              start the game.
              <br />
            </h2>

            <div className="columns">
              <div className="column is-two-thirds">
                <h2 className="subtitle">Current Players:</h2>
                <div class="field is-grouped is-grouped-multiline">
                  {game.players.map((p) => (
                    <div class="control">
                      <div class="tags has-addons">
                        <span
                          className={`tag is-medium is-dark
                            ${p.id == user && "is-warning"}
                            ${p.id == game.lead && "is-danger"}
                          `}
                        >
                          <span>
                            {p.name}
                            {p.id === user && " (you)"}
                            {p.id === game.lead && " (lead)"}
                          </span>
                        </span>
                        {console.log("!!", p.id, user)}
                        {p.id == user && (
                          <span className="tag is-medium">
                            <span class="icon is-small" onClick={onEditName}>
                              <i class="fas fa-pencil-alt"></i>
                            </span>
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="column">
                {user === game.lead && (
                  <>
                    <div className="box">
                      <h2 class="subtitle">
                        Once you have three or more players:
                      </h2>
                      <button
                        className="button is-primary"
                        onClick={start}
                        {...disableStart}
                      >
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
      <UsernameModal
        value={name}
        show={showModal}
        onContinue={(e) => {
          if (e) {
            setShowModal(false);
            socket.emit("SET_NAME", e);
          }
        }}
        onClose={() => setShowModal(false)}
      />
    </>
  );
};

export default Lobby;
