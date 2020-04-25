import React from "react";
import Card from "./Card";

import Colour from "./Colour";
import "../css/card.css";

const Decks = ({ game, users, drawCard }) => {
  return (
    <div className="box decks">
      <div className="level">
        <div className="level-item has-text-centered discard">
          Discard ({game.discardLength}):
          {game.topCard && (
            <>
              <Card
                symbol={game.topCard.symbol}
                colour={game.topCard.colour || ""}
                onClick={() => {
                  alert("What were you trying to do???");
                }}
              />
              <Colour colour={game.topCard.colour} />
            </>
          )}
        </div>
        <div className="level-item has-text-centered draw">
          Draw ({game.deckLength}):
          <Card onClick={drawCard} />
        </div>
      </div>
    </div>
  );
};

export default Decks;
