import React from "react";

const Summary = ({ game, onClose }) => {
  const order = game.players.concat().sort((a, b) => {
    return a.deck.length > b.deck.length;
  });
  const maxCards = order[order.length - 1].deck.length;

  return (
    <div className="modal is-active">
      <div className="modal-background"></div>
      <div className="modal-content">
        <section className="hero is-primary">
          <div className="hero-body">
            <div className="container">
              <h1 className="title">Winner: {order[0].name}</h1>
              <h2 className="subtitle">Congratulations!</h2>

              <div className="box">
                <h2 className="subtitle">Summary:</h2>
                {order.map((p) => {
                  return (
                    <div className="level">
                      <div className="level-item level-left">{p.name}</div>
                      <div className="level-item">
                        <progress
                          className="progress is-medium is-danger"
                          value={p.deck.length}
                          max={maxCards}
                        ></progress>
                      </div>
                      <div className="level-item level-right">
                        <div className="tags are-medium has-addons">
                          <span className="tag is-black">
                            <span className="icon is-small">
                              <i className="fas fa-hashtag"></i>
                            </span>
                            <span>{p.deck.length}</span>
                          </span>
                          <span className="tag is-warning">
                            <span className="icon is-small">
                              <i className="fas fa-star"></i>
                            </span>
                            <span>{p.deck.length}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </div>
      <button
        className="modal-close is-large"
        aria-label="close"
        onClick={onClose}
      ></button>
    </div>
  );
};

export default Summary;
