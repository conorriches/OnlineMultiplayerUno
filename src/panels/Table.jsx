import React, { useState, useEffect } from "react";
import Card from "../components/Card";
import Colour from "../components/Colour";
import Players from "../components/Players";
import Decks from "../components/Decks";
import Actions from "../components/Actions";
import Messages from "../components/Messages";

const Table = ({ game, user, socket }) => {
  const player = game.players.filter((p) => p.id === user);
  const myCards = !!player.length ? player[0].deck : [];

  const playCard = (colour, symbol) => {
    socket.emit("PLAY_CARD", {
      colour,
      symbol,
    });
  };

  const drawCard = () => {
    socket.emit("DRAW_CARD");
  };

  const chooseColour = (colour) => {
    socket.emit("CHOOSE_COLOUR", colour);
  };

  return (
    <section
      className={`table hero is-dark ${game.discardLength === 1 && "animate"}`}
    >
      <div className="hero-body">
        <div className="columns">
          <div className="players column">
            <Players game={game} user={user} />
          </div>
        </div>
        <div class="columns">
          <div class="column is-two-thirds">
            <Decks game={game} drawCard={drawCard} />
            <div className="actions box">
              {game.player.id === user && (
                <Actions
                  game={game}
                  chooseColour={chooseColour}
                  drawCard={drawCard}
                />
              )}

              <div className="deck">
                {myCards.map((c) => {
                  return (
                    c && (
                      <Card
                        symbol={c.symbol}
                        colour={c.colour || ""}
                        onClick={playCard}
                      />
                    )
                  );
                })}
              </div>
            </div>
          </div>
          <div class="events column">
            <Messages game={game} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Table;
