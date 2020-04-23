import React from "react";
import "../css/card.css";

const Messages = ({ game }) => {
  return (
    <div className="box">
      <h2 class="subtitle">Events:</h2>
      <div className="messages">
        {game.messages.reverse().map((m) => {
          return (
            <li>
              <span
                className={`tag ${
                  m.user ? "is-primary" : "is-danger"
                }  is-light`}
              >
                {m.user || (
                  <span className="icon">
                    <i className="fas fa-user-lock"></i>
                  </span>
                )}
              </span>
              {m.message}
            </li>
          );
        })}
        {game.messages.length >= 10 && <div className="fade"></div>}
      </div>
    </div>
  );
};

export default Messages;
