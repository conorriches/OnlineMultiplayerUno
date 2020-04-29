const dev = require("./dev.config.js");
const prod = require("./prod.config.js");

const isDev = process.env.NODE_ENV !== "production";

if (isDev) {
  module.exports = dev;
} else {
  module.exports = prod;
}
