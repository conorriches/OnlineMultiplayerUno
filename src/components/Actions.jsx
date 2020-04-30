import React from "react";
import Colour from "./Colour";
import "../css/card.css";

const Actions = ({ game, chooseColour, drawCard, choosePlayer }) => {
  const mustChooseColour =
    game.criteria.length && game.criteria.indexOf("CHOOSECOLOUR") > -1;
  const mustDrawCard =
    game.criteria.length && game.criteria.indexOf("DRAWCARD") > -1;
  const mustSwapWith =
    game.criteria.length && game.criteria.indexOf("SWAPWITH") > -1;

  return (
    !!game.criteria.length && (
      <div className="notification is-danger">
        <div className="level">
          <div className="level-item">
            {mustChooseColour && (
              <>
                <h2 className="subtitle">Please set a colour:</h2>
                <div className="tags are-medium">
                  <Colour colour="RED" onClick={chooseColour} />
                  <Colour colour="GREEN" onClick={chooseColour} />
                  <Colour colour="YELLOW" onClick={chooseColour} />
                  <Colour colour="BLUE" onClick={chooseColour} />
                </div>
              </>
            )}
            {mustDrawCard && !mustChooseColour && (
              <h2 className="subtitle">
                To move on you must draw{" "}
                <span className="tag is-large is-dark" onClick={drawCard}>
                  {game.criteria.filter((c) => c === "DRAWCARD").length}
                </span>{" "}
                cards
              </h2>
            )}

            {mustSwapWith && (
              <h2 className="subtitle">
                <h2 className="subtitle">
                  To move on, choose who you want to swap decks with:
                </h2>
                <div class="tags">
                  {game.players
                    .filter((p) => p.id !== game.player.id)
                    .map((p) => (
                      <span
                        className="tag is-medium is-dark clickable"
                        onClick={() => choosePlayer(p.id)}
                      >
                        {p.name}
                      </span>
                    ))}
                </div>
              </h2>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default Actions;
