import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate";

const Schema = mongoose.Schema;

const batchData = new Schema(
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
const batchDataModel = mongoose.model("batchData", batchData);

module.exports = { batchDataModel };
