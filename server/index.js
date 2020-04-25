const express = require("express");
const app = express();
const a = require("./app");

const port = 5000;

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(port, () =>
  console.log(
    `Online Multiplayer Uno is running on port http://localhost:${port}`
  )
);
