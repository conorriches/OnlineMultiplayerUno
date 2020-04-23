import React from "react";
import "../css/card.css";

const Card = ({ colour, symbol, onClick }) => {
  return (
    <div
      className={`card symbol-${symbol} colour-${colour}`}
      onClick={() => onClick(colour, symbol)}
    ></div>
  );
};

export default Card;
