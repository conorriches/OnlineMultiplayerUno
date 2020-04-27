import React from "react";
import "../css/card.css";

const Players = ({ game, user }) => {
  return (
    <div className="box players">
      <div class="level">
        {game.players
          .sort((a, b) => {
            return !game.direction;
          })
          .map((p, i) => (
            <>
              <div className="level-item is-narrow player" key={p.id}>
                <div className="tags has-addons">
                  <span
                    className={`tag is-medium ${
                      p.id === user && p.id === game.player.id
                        ? "is-success"
                        : "is-dark"
                    }`}
                  >
                    <div className="columns">
                      {p.id === user ? (
                        <div className="column">
                          <span className="icon has-text-light">
                            <i className="fas fa-user"></i>
                          </span>
                        </div>
                      ) : (
                        ""
                      )}
                      {p.id === game.player.id ? (
                        <div className="column">
                          <span className="icon has-text-warning">
                            <i className="fas fa-gamepad"></i>
                          </span>
                        </div>
                      ) : (
                        ""
                      )}
                      <div className="column">{p.name}</div>
                    </div>
                  </span>
                  <span
                    className={`tag is-medium ${
                      p.uno ? "is-danger" : "is-black"
                    }`}
                  >
                    <div className="columns">
                      {p.uno && (
                        <div className="column">
                          <span
                            className={`icon  ${
                              p.uno ? "has-text-light" : "has-text-danger"
                            }`}
                          >
                            <i className="fas fa-bullhorn"></i>
                          </span>
                        </div>
                      )}
                      <div className="column">{p.deck.length}</div>

                      {p.deck.length === 1 && (
                        <div className="column">
                          <span
                            className={`icon  ${
                              p.uno ? "has-text-light" : "has-text-danger"
                            }`}
                          >
                            <i className="fas fa-exclamation"></i>
                          </span>
                        </div>
                      )}
                    </div>
                  </span>
                </div>
              </div>
              <div className="level-item is-narrow">
                {i < game.players.length - 1 ? (
                  <span className="icon">
                    <i className="fas fa-arrow-right"></i>
                  </span>
                ) : (
                  <span className="icon">
                    <i className="fas fa-redo"></i>
                  </span>
                )}
              </div>
            </>
          ))}

        <div class="level-item level-right">
          <a className="pagination-previous is-current">Help</a>
        </div>
        <div class="level-item level-right">
          <a className="pagination-next">Rules</a>
        </div>
      </div>
    </div>
  );
};

export default Players;
