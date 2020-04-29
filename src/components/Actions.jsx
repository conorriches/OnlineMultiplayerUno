import React from "react";
import Colour from "./Colour";
import "../css/card.css";

const Actions = ({ game, chooseColour, drawCard }) => {
  return (
    !!game.criteria.length && (
      <div className="notification is-danger">
        <div className="level">
          <div className="level-item">
            {game.criteria.indexOf("CHOOSECOLOUR") > -1 && (
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
            {game.criteria.length &&
              game.criteria.indexOf("CHOOSECOLOUR") === -1 && (
                <>
                  <h2 className="subtitle">
                    To move on you must draw{" "}
                    <span className="tag is-large is-dark">
                      {game.criteria.filter((c) => c === "DRAWCARD").length}
                    </span>{" "}
                    cards
                  </h2>
                </>
              )}
          </div>
        </div>
      </div>
    )
  );
};

export default Actions;
