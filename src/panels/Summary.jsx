import React from "react";

const Summary = ({ game, onClose }) => {
  const order = game.players.concat().sort((a, b) => {
    return a.deck.length > b.deck.length;
  });
  const maxCards = order[order.length - 1].deck.length;

  return (
    <div class="modal is-active">
      <div class="modal-background"></div>
      <div class="modal-content">
        <section class="hero is-primary">
          <div class="hero-body">
            <div class="container">
              <h1 class="title">Winner: {order[0].name}</h1>
              <h2 class="subtitle">Congratulations!</h2>

              <div className="box">
                <h2 className="subtitle">Summary:</h2>
                {order.map((p) => {
                  return (
                    <div className="level">
                      <div className="level-item level-left">{p.name}</div>
                      <div className="level-item">
                        <progress
                          class="progress is-medium is-danger"
                          value={p.deck.length}
                          max={maxCards}
                        ></progress>
                      </div>
                      <div className="level-item level-right">
                        <div class="tags are-medium has-addons">
                          <span class="tag is-black">
                            <span class="icon is-small">
                              <i class="fas fa-hashtag"></i>
                            </span>
                            <span>{p.deck.length}</span>
                          </span>
                          <span class="tag is-warning">
                            <span class="icon is-small">
                              <i class="fas fa-star"></i>
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
        class="modal-close is-large"
        aria-label="close"
        onClick={onClose}
      ></button>
    </div>
  );
};

export default Summary;
