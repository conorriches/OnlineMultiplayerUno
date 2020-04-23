import React from "react";
import "../css/card.css";

const Colour = ({ colour, onClick, medium }) => {
  return (
    <span
      class={`tag select-colour ${medium && "is-medium"} ${colour} ${
        onClick && "clickable"
      }`}
      onClick={() => onClick && onClick(colour)}
    >
      {colour}
    </span>
  );
};

export default Colour;
