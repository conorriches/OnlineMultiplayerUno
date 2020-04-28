module.exports = {
  apps: [
    {
      name: "OnlineMultiplayerUno",
      script: "./src/server",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
