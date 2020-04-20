import React, { useState, useEffect } from "react";
import Card from "../components/Card";
import Players from "../components/Players";
import Decks from "../components/Decks";

const Table = ({ game, user, socket }) => {
  const myCards = game.players.filter((p) => p.id === user)[0].deck;
  return (
    <section class="hero is-dark">
      <div class="hero-body">
        <div class="container">
          <Players game={game} />
          <Decks game={game} />
          <div class="box">
            <div class="deck">
              {console.log(myCards)}
              {myCards.map((c) => {
                return <Card symbol={c.symbol} colour={c.colour || ""} />;
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Table;
