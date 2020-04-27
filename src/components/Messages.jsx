import React from "react";
import "../css/card.css";

const Messages = ({ game, user, onUno, onChallenge, onCallout }) => {
  if (!user) return false;

  const thisUser = game.players.filter((p) => p.id === user)[0];
  const disableUno = {
    disabled: thisUser.deck.length > 1,
  };

  const disableChallenge = {
    disabled:
      game.topCard.symbol !== "PICKUP4" ||
      thisUser.id !== game.player.id ||
      !(game.criteria.length >= 4),
  };

  const disableCallout = {
    disabled: !game.players.some((p) => p.deck.length === 1 && !p.uno),
  };

  return (
    <div className="box">
      <h2 class="subtitle">Game Actions:</h2>
      <div class="level">
        <div className="level-item has-text-centered draw">
          <button
            class="button is-primary is-light is-fullwidth"
            onClick={onUno}
            {...disableUno}
          >
            <span class="icon is-small">
              <i class="fas fa-check"></i>
            </span>
            <span>Uno!</span>
          </button>
          <button
            class="button is-danger is-light is-fullwidth"
            onClick={onChallenge}
            {...disableChallenge}
          >
            <span class="icon is-small">
              <i class="fas fa-thumbs-down"></i>
            </span>
            <span>Challenge</span>
          </button>

          <button
            class="button is-warning is-light is-fullwidth"
            onClick={onCallout}
            {...disableCallout}
          >
            <span class="icon is-small">
              <i class="fas fa-gavel"></i>
            </span>
            <span>Undeclared Uno</span>
          </button>
        </div>
      </div>
      <h2 class="subtitle">Events:</h2>
      <div class="level">
        <div className="messages">
          {game.messages.reverse().map((m) => {
            return (
              <li>
                <span
                  className={`tag ${
                    m.user ? "is-primary" : "is-danger"
                  }  is-light`}
                >
                  {m.user || (
                    <span className="icon">
                      <i className="fas fa-user-lock"></i>
                    </span>
                  )}
                </span>
                {m.message}
              </li>
            );
          })}
          {game.messages.length >= 10 && <div className="fade"></div>}
        </div>
      </div>
    </div>
  );
};

export default Messages;
