import React from "react";
import Card from "./Card";
import "../css/card.css";

const Decks = ({ game, users }) => {
  return (
    <div class="box">
      <div class="level">
        <div class="level-item has-text-centered">
          <div class="notification is-dark">
            <Card
              symbol={game.topCard.symbol}
              colour={game.topCard.colour || ""}
            />
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div class="notification is-primary">
            <p>It's Conor's Go</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div class="notification is-primary">
            <Card />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Decks;
