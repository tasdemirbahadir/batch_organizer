import mongoose from "mongoose";
const Schema = mongoose.Schema;

const organizedBatches = new Schema(
  {
    data: { type: Array, required: true },
  },
  {
    versionKey: false,
  }
);
const organizedBatchesModel = mongoose.model(
  "organizedBatches",
  organizedBatches
);

module.exports = { organizedBatchesModel };
