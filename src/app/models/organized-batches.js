import mongoose from "mongoose";
let Schema = mongoose.Schema;

let organizedBatches = new Schema(
  {
    data: { type: Array, required: true },
  },
  {
    versionKey: false,
  }
);

module.exports.organizedBatchesModel = mongoose.model('organizedBatches', organizedBatches);
