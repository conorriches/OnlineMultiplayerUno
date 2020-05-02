import React, { useState, useEffect } from "react";
import Card from "../components/Card";
import Players from "../components/Players";
import Decks from "../components/Decks";
import Actions from "../components/Actions";
import Messages from "../components/Messages";

import useAudio from "../useAudio";
import pop from "../pop.mp3";

const Table = ({ game, user, socket, onLeave }) => {
  const [sort, setSort] = useState(false);
  const [playing, toggle] = useAudio(pop);
  const [mute, setMute] = useState(false);
  const [lastPlayer, setLastPlayer] = useState();
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

  const choosePlayer = (player) => {
    socket.emit("CHOOSE_PLAYER", player);
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

  useEffect(() => {
    if (!mute && game.player.id !== lastPlayer) {
      toggle();
      setLastPlayer(game.player.id);
    }
  }, [game]);

  return (
    <section
      className={`table hero is-dark is-bold ${
        game.discardLength === 1 &&
        !game.players.some((p) => p.deck.length !== 7) &&
        "animate"
      }`}
    >
      <div className="hero-body">
        <div className="columns">
          <div className="players column is-one-quarter">
            <Players
              game={game}
              user={user}
              onLeave={onLeave}
              mute={mute}
              toggleMute={() => setMute(!mute)}
            />
          </div>
          <div className="column">
            <Decks game={game} drawCard={drawCard} />
            <div className="actions box">
              {game.player.id === user && (
                <Actions
                  game={game}
                  chooseColour={chooseColour}
                  drawCard={drawCard}
                  choosePlayer={choosePlayer}
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
                      .reverse()
                      .sort((a, b) => {
                        if (sort === "COLOUR") {
                          return a.colour > b.colour;
                        }
                        if (sort === "SYMBOL") {
                          return a.symbol > b.symbol;
                        }
                        return 0;
                      })
                      .map(
                        (c, i) =>
                          c && (
                            <span key={`card-${i}`}>
                              <Card
                                symbol={c.symbol}
                                colour={c.colour || ""}
                                onClick={playCard}
                              />
                            </span>
                          )
                      )}
                  </div>
                </div>
              </div>
              <div className="control" style={{ display: "none" }}>
                Sort:
                <label className="radio">
                  <input
                    type="radio"
                    name="foobar"
                    onChange={() => setSort("SYMBOL")}
                    {...{ checked: sort === "SYMBOL" }}
                  />
                  Symbol
                </label>
                <label className="radio">
                  <input
                    type="radio"
                    name="foobar"
                    onChange={() => setSort("COLOUR")}
                    {...{ checked: sort === "COLOUR" }}
                  />
                  Colour
                </label>
                <label className="radio">
                  <input
                    type="radio"
                    name="foobar"
                    onChange={() => setSort(false)}
                    {...{ checked: !sort }}
                  />
                  None
                </label>
              </div>
            </div>
          </div>
          <div className="events column is-one-quarter">
            <Messages
              game={game}
              user={user}
              onUno={uno}
              onChallenge={challenge}
              onCallout={callout}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Table;
