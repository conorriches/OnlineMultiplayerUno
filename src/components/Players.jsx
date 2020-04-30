import React, { useState } from "react";
import "../css/card.css";

const Players = ({ game, user, onLeave }) => {
  const [showAbout, setShowAbout] = useState(false);
  const [showRules, setShowRules] = useState(false);

  const AboutModal = () =>
    showAbout && (
      <div className="modal is-active">
        <div className="modal-background"></div>
        <div className="modal-content">
          <div className="box">
            <h1 className="title"> About this game</h1>
            <p>
              This is an online version of the popular game Uno. It's not
              affiliated with the game and is just a fun project I made.
            </p>
            <hr />
            <p>
              The code is on GitHub - so please feel free to check it out, fork,
              make improvements and submit PRs:
              <a href="https://github.com/conorriches/OnlineMultiplayerUno">
                View the code on GitHub
              </a>
            </p>
          </div>
        </div>
        <button
          className="modal-close is-large"
          aria-label="close"
          onClick={() => setShowAbout(false)}
        ></button>
      </div>
    );

  const RulesModal = () =>
    showRules && (
      <div className="modal is-active rules">
        <div className="modal-background"></div>
        <div className="modal-content">
          <div className="box">
            <h1 className="title">Summary of Rules</h1>
            <hr />
            <h2 className="subtitle">Playing cards</h2>
            <p>When it's your turn you should play a card that matches:</p>
            <ul>
              <li>Same colour (Red, Green, Yellow, Blue)</li>
              <li>Same symbol (0, 9, +2 etc)</li>
              <li>
                <b>House Rules:</b> One number either side - includes 0's and
                9's wrapping around
              </li>
              <li>
                A wildcard - either Draw Four or Choosing a colour. Be careful
                though... you can be challenged
              </li>
            </ul>

            <h2 className="subtitle">Card Actions</h2>
            <ul>
              <li>+2 makes the next player pick up two cards</li>
              <li>
                +4 makes the next player pick up four cards, and you can set the
                colour
              </li>
              <li>Colour wildcard makes you set the colour</li>
              <li>Switch Direction changes the direction of play</li>
              <li>Skip Go card skips the next player's go</li>
              <li>
                <b>House Rules</b> Playing a <b>0</b> rotates hands in the
                direction of play
              </li>
              <li>
                <b>House Rules</b> Playing a <b>7</b> swaps hands. If there's an
                even number of players, the game will swap with the player
                opposite. Otherwise you get to choose.
              </li>
              <li>
                <b>House Rules</b> Jump in! If you have an identical card to the
                top of the deck (matches colour AND symbol) you can jump in and
                play it.
              </li>
              <li>
                <b>House Rules</b> Stackable! If someone jumps in on a +2, or +4
                before the next player starts drawing cards, the penalties
                stack!
              </li>
            </ul>

            <h2 className="subtitle">Drawing cards</h2>
            <p>
              If you can't play a card in your deck, you must draw a card. With{" "}
              <b>House Rules</b>, you draw until you can play.
            </p>
          </div>
        </div>
        <button
          className="modal-close is-large"
          aria-label="close"
          onClick={() => setShowRules(false)}
        ></button>
      </div>
    );

  return (
    <div className="box players">
      {<AboutModal />}
      {<RulesModal />}
      <div className="level">
        {game.players
          .sort((a, b) => {
            return !game.direction;
          })
          .map((p, i) => (
            <>
              <div className="level-item is-narrow player" key={p.id}>
                <div className="tags has-addons">
                  <span
                    className={`tag is-medium ${
                      p.id === user && p.id === game.player.id
                        ? "is-success"
                        : "is-dark"
                    }`}
                  >
                    <div className="columns">
                      {p.id === user ? (
                        <div className="column">
                          <span className="icon has-text-light">
                            <i className="fas fa-user"></i>
                          </span>
                        </div>
                      ) : (
                        ""
                      )}
                      {p.id === game.player.id ? (
                        <div className="column">
                          <span className="icon has-text-warning">
                            <i className="fas fa-gamepad"></i>
                          </span>
                        </div>
                      ) : (
                        ""
                      )}
                      <div className="column">{p.name}</div>
                    </div>
                  </span>
                  <span
                    className={`tag is-medium ${
                      p.uno ? "is-danger" : "is-black"
                    }`}
                  >
                    <div className="columns">
                      {p.uno && (
                        <div className="column">
                          <span
                            className={`icon  ${
                              p.uno ? "has-text-light" : "has-text-danger"
                            }`}
                          >
                            <i className="fas fa-bullhorn"></i>
                          </span>
                        </div>
                      )}
                      <div className="column">{p.deck.length}</div>

                      {p.deck.length === 1 && (
                        <div className="column">
                          <span
                            className={`icon  ${
                              p.uno ? "has-text-light" : "has-text-danger"
                            }`}
                          >
                            <i className="fas fa-exclamation"></i>
                          </span>
                        </div>
                      )}
                    </div>
                  </span>
                </div>
              </div>
              <div className="level-item is-narrow">
                {i < game.players.length - 1 ? (
                  <span className="icon">
                    <i className="fas fa-arrow-right"></i>
                  </span>
                ) : (
                  <span className="icon">
                    <i className="fas fa-redo"></i>
                  </span>
                )}
              </div>
            </>
          ))}

        <div className="level-item level-right">
          <div className="buttons">
            <div className="button is-light" onClick={() => setShowRules(true)}>
              Rules
            </div>
            <div className="button is-light" onClick={() => setShowAbout(true)}>
              About
            </div>
            <div
              className="button is-light is-danger"
              onClick={() => onLeave(user)}
            >
              <span className="icon has-text-danger">
                <i className="fas fa-window-close"></i>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Players;
