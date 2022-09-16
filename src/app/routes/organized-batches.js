import { organizedBatchesModel } from "../models/organized-batches";

const getOrganizedBatches = (req, res) => {
  organizedBatchesModel
    .findOne()
    .exec()
    .then(
      (organizedBatches) => {
        if (!organizedBatches) {
          res.status(200);
          res.json({ message: "Currently there aren't any batches" });
        } else {
          res.status(200);
          res.json(organizedBatches);
        }
      },
      (err) => {
        console.error("Error occured: ", err);
        res.status(500);
        res.json({ errors: "Unexpected error occurred" });
      }
    );
};

module.exports = { getOrganizedBatches };
