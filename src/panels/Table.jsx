import React, { useState } from "react";
import Card from "../components/Card";
import Players from "../components/Players";
import Decks from "../components/Decks";
import Actions from "../components/Actions";
import Messages from "../components/Messages";

const Table = ({ game, user, socket }) => {
  const [sort, setSort] = useState(false);

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

  const uno = () => {
    socket.emit("DECLARE_UNO");
  };

  const challenge = () => {
    socket.emit("CHALLENGE");
  };

  const callout = () => {
    socket.emit("CALLOUT");
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
        <div className="columns">
          <div className="column is-two-thirds">
            <Decks game={game} drawCard={drawCard} />
            <div className="actions box">
              {game.player.id === user && (
                <Actions
                  game={game}
                  chooseColour={chooseColour}
                  drawCard={drawCard}
                  onUno={uno}
                  onChallenge={challenge}
                  onCallout={callout}
                />
              )}

              <div className="deck">
                <div className="columns">
                  <div className="column">
                    {myCards
                      .concat()
                      .sort((a, b) => {
                        if (sort === "COLOUR") {
                          return a.colour > b.colour;
                        }
                        if (sort === "SYMBOL") {
                          return a.symbol > b.symbol;
                        }
                        return 0;
                      })
                      .map((c) => {
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
              <div className="control" style={{ display: "none" }}>
                Sort:
                <label className="radio">
                  <input
                    type="radio"
                    name="foobar"
                    onClick={() => setSort("SYMBOL")}
                    {...{ checked: sort === "SYMBOL" }}
                  />
                  Symbol
                </label>
                <label className="radio">
                  <input
                    type="radio"
                    name="foobar"
                    onClick={() => setSort("COLOUR")}
                    {...{ checked: sort === "COLOUR" }}
                  />
                  Colour
                </label>
                <label className="radio">
                  <input
                    type="radio"
                    name="foobar"
                    onClick={() => setSort(false)}
                    {...{ checked: !sort }}
                  />
                  None
                </label>
              </div>
            </div>
          </div>
          <div className="events column">
            <Messages
              game={game}
              user={user}
              onUno={uno}
              onChallenge={challenge}
              onCallout={callout}
            />
            {console.log("===", game.players)}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Table;
