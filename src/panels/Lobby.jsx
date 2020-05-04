import React, { useState, useEffect } from "react";

import UsernameModal from "../components/UsernameModal";

const Lobby = ({ game, user, socket, name, onLeave }) => {
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

  const disableStart = { disabled: !game.players.length >= 2 };

  return (
    <>
      <section className="hero is-info is-bold lobby">
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
                <div className="field is-grouped is-grouped-multiline PlayerList">
                  {game.players.map((p) => (
                    <div key={p.id} className="control">
                      <div className="tags has-addons">
                        <span
                          className={`tag is-medium is-dark
                            ${p.id === user && "is-warning"}
                            ${p.id === game.lead && "is-danger"}
                          `}
                        >
                          <span>
                            {p.name}
                            {p.id === user && " (you)"}
                            {p.id === game.lead && " (lead)"}
                          </span>
                        </span>

                        {p.id === user && (
                          <span className="tag is-medium">
                            <span
                              className="icon is-small"
                              onClick={onEditName}
                            >
                              <i className="fas fa-pencil-alt"></i>
                            </span>
                          </span>
                        )}
                        {(p.id === user || user === game.lead) && (
                          <span className="tag is-medium">
                            <span
                              className="icon is-small"
                              onClick={() => onLeave(p.id, p.name)}
                            >
                              <i className="fas fa-ban"></i>
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
                      <h2 className="subtitle">
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
