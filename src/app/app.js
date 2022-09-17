import config from "config";
import express from "express";
import bodyParser from "body-parser";
import batches from "./routes/batches";
import organizedBatches from "./routes/organized-batches";

const init = () => {
  const app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.json({ type: "application/json" }));
  app.get("/", (req, res) =>
    res.json({ message: "Welcome to the Batch Organizer!!" })
  );
  app.route("/batches").post(batches.postBatch).get(batches.getBatches);
  app.route("/batches/organized").get(organizedBatches.getOrganizedBatches);
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
