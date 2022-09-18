import { organizedBatchesModel } from "../models/organized-batches-model";

const paginate = async (skip, limit) => {
  return await organizedBatchesModel
    .aggregate()
    .allowDiskUse(true)
    .unwind({ path: "$values" })
    .group({
      _id: null,
      total: { $sum: 1 },
      data: { $push: "$values" },
    })
    .project({
      total: 1,
      items: { $slice: ["$data", skip, limit] },
    })
    .exec();
};

module.exports = { paginate };
