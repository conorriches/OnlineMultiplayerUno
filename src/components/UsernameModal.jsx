import React, { useState } from "react";

const UsernameModal = ({ defaultValue, show, onContinue, onClose }) => {
  const [value, setValue] = useState(defaultValue || "");

  return (
    <div className={`modal ${show && "is-active"}`}>
      <div className="modal-background"></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Choose a player name</p>
          <button
            className="delete"
            aria-label="close"
            onClick={onClose}
          ></button>
        </header>
        <section className="modal-card-body">
          <div className="level">
            <p>The player name must be unique to other players in the game.</p>
          </div>
          <div className="field">
            <div className="control">
              <input
                className={`input is-medium ${!value.length && "is-danger"}`}
                type="text"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                }}
              />
            </div>
          </div>
        </section>
        <footer className="modal-card-foot">
          <button
            className="button is-success"
            {...{ disabled: !value }}
            onClick={() => onContinue(value)}
          >
            Save name
          </button>
        </footer>
      </div>
    </div>
  );
};

export default UsernameModal;
