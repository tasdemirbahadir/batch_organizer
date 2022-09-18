import config from "config";
import express from "express";
import bodyParser from "body-parser";
import routes from "./routes";

const init = () => {
  const app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.json({ type: "application/json" }));
  Object.values(routes).forEach(route => app.use("/", route));
  const server = app.listen(config.get("port"), () => {
    console.log(
      `server is running on port ${config.get("port")} and in ${config.get(
        "name"
      )} mode`
    );
  });
  return server;
};

module.exports = { init };
