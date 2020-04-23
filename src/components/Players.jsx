import React from "react";
import "../css/card.css";

const Players = ({ game }) => {
  return (
    <div className="box players">
      <nav className="pagination" role="navigation" aria-label="pagination">
        <ul className="pagination-list">
          {game.players
            .sort((a, b) => {
              return !game.direction;
            })
            .map((p, i) => (
              <li key={p.id}>
                <div class="level">
                  <div class="level-item">
                    <div className="tags has-addons">
                      <span
                        className={`tag is-medium ${
                          game.player.id === p.id ? "is-link" : "is-light"
                        }`}
                      >
                        {p.name}{" "}
                      </span>
                      <span
                        className={`tag is-medium   ${
                          game.player.id === p.id ? "is-warning" : "is-warning"
                        }`}
                      >
                        {p.uno && (
                          <span className="icon has-text-danger">
                            <i className="fas fa-bullhorn"></i>
                          </span>
                        )}
                        {p.deck.length}
                        {p.deck.length === 1 && (
                          <span className="icon has-text-danger">
                            <i className="fas fa-exclamation"></i>
                          </span>
                        )}
                      </span>
                    </div>

                    <span className="icon has-text-success">
                      <i className="fas fa-arrow-right"></i>
                    </span>
                  </div>
                </div>
              </li>
            ))}
        </ul>
        <a className="pagination-previous is-current">Help</a>
        <a className="pagination-next">Rules</a>
      </nav>
    </div>
  );
};

export default Players;
