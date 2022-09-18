import config from "config";
import express from "express";
import bodyParser from "body-parser";
import batchData from "./routes/batch-data-route";
import organizedBatches from "./routes/organized-batches-route";

const init = () => {
  const app = express();
  const router = express.Router;
  app.use(bodyParser.json());
  app.use(bodyParser.json({ type: "application/json" }));
  app.get("/", (req, res) =>
    res.json({ message: "Welcome to the Batch Organizer!!" })
  );
  app
    .route("/batch-data")
    .post(batchData.postBatchData)
    .get(batchData.getBatchDatas);
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