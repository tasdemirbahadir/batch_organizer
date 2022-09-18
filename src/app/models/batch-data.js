import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate";

let Schema = mongoose.Schema;

let batchData = new Schema(
  {
    batch_id: { type: String, required: true },
    value: { type: Number, required: true },
    time: { type: Date, required: true },
  },
  {
    versionKey: false,
  }
);
batchData.plugin(mongoosePaginate);

module.exports.batchDataModel = mongoose.model("batchData", batchData);
