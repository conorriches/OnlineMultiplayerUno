const express = require("express");
const path = require("path");
const app = express();
const a = require("./app");

const { server } = require("../config");

app.use(express.static(path.join(__dirname, "../", "../", "build")));

app.get("/", function (req, res) {
  if (process.env.NODE_ENV === "production") {
    res.sendFile(path.join(__dirname, "../", "../", "build", "index.html"));
  } else {
    res.send(
      "<h1>[see: README]</h1><h2> You're running the server, but to access the client (with hot reloading) please go to localhost://3000.</h2>"
    );
  }
});

app.listen(process.env.PORT || server.port, () =>
  console.log(
    `Online Multiplayer Uno is running on port http://localhost:${server.port}`
  )
);
