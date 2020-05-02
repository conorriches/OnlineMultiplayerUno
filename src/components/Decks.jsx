import React from "react";
import Card from "./Card";

import Colour from "./Colour";
import "../css/card.css";

const Decks = ({ game, users, drawCard }) => {
  return (
    <div className="box decks">
      <div className="level">
        <div className="level-item has-text-centered discard">
          Discard ({game.discardLength})
        </div>
        <div className="level-item has-text-centered draw">
          Draw ({game.deckLength})
        </div>
      </div>
      <div className="level">
        <div className="level-item has-text-centered discard">
          {game.discard && (
            <>
              <div className="deck discard">
                {game.discard[0] && (
                  <Card
                    symbol={game.discard[0].symbol}
                    colour={game.discard[0].colour || ""}
                    onClick={() => {}}
                  />
                )}
                {game.discard[1] && (
                  <Card
                    symbol={game.discard[1].symbol}
                    colour={game.discard[1].colour || ""}
                    onClick={() => {}}
                  />
                )}
                {game.discard[2] && (
                  <Card
                    symbol={game.discard[2].symbol}
                    colour={game.discard[2].colour || ""}
                    onClick={() => {}}
                  />
                )}
              </div>
              <Colour colour={game.topCard.colour} />
            </>
          )}
        </div>
        <div className="level-item has-text-centered draw">
          <Card onClick={drawCard} />
        </div>
      </div>
    </div>
  );
};

export default Decks;
