import React from "react";
import "../css/card.css";

const Card = ({ colour, symbol }) => {
  return <div class={`card symbol-${symbol} colour-${colour}`}></div>;
};

export default Card;
