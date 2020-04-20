import React from "react";
import "../css/card.css";

const Players = ({ game, users }) => {
  return (
    <div class="box">
      <nav class="pagination" role="navigation" aria-label="pagination">
        <ul class="pagination-list">
          {game.players.map((p) => (
            <li>
              <div class="tags has-addons">
                <span
                  class={`tag is-medium ${
                    game.players[game.player].id === p.id
                      ? "is-primary"
                      : "is-info"
                  }`}
                >
                  {p.name}({p.id})
                </span>
                <span
                  class={`tag is-medium is-light ${
                    game.players[game.player].id === p.id
                      ? "is-primary"
                      : "is-info"
                  }`}
                >
                  12
                </span>
              </div>
            </li>
          ))}

          <span class="icon has-text-info">
            <i class="fas fa-redo"></i>
          </span>
        </ul>
        <a class="pagination-previous">Previous</a>
        <a class="pagination-next">Next page</a>
      </nav>
    </div>
  );
};

export default Players;
