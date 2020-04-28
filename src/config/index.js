const dev = require("./dev.config.js");
const prod = require("./prod.config.js");

const isDev = process.env.NODE_ENV === "development";

if (isDev) {
  module.exports = dev;
} else {
  module.exports = prod;
}
