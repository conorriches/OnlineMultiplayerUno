import React, { useState } from "react";

const UsernameModal = ({ defaultValue, show, onContinue, onClose }) => {
  const [value, setValue] = useState(defaultValue || "");

  return (
    <div class={`modal ${show && "is-active"}`}>
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Choose a player name</p>
          <button class="delete" aria-label="close" onClick={onClose}></button>
        </header>
        <section class="modal-card-body">
          <div className="level">
            <p>The player name must be unique to other players in the game.</p>
          </div>
          <div class="field">
            <div class="control">
              <input
                class={`input is-medium ${!value.length && "is-danger"}`}
                type="text"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                }}
              />
            </div>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button
            class="button is-success"
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