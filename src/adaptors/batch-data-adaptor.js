import { batchDataModel } from "../models/batch-data-model";

const paginate = async (offset, limit) => {
  return await batchDataModel.paginate({}, { offset, limit });
};

const save = async (batchData) => {
  const newBatchData = new batchDataModel(batchData);
  await newBatchData.save();
  return await batchDataModel
    .aggregate()
    .allowDiskUse(true)
    .sort({ value: 1 })
    .group({
      _id: { $getField: "batch_id" },
      time: { $min: { $getField: "time" } },
      values: { $push: { $getField: "value" } },
    })
    .sort({ time: 1 })
    .unwind({ path: "$values" })
    .group({
      _id: "VALUES",
      values: { $push: "$values" },
    })
    .out("organizedbatches");
};

module.exports = { paginate, save };
