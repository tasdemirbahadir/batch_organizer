import { organizedBatchesModel } from "../models/organized-batches-model";

const DEFAULT_PAGE = 0;
const DEFAULT_PAGE_SIZE = 10;

const getOrganizedBatches = async (request, response) => {
  const page = Number(request.query.page ? request.query.page : DEFAULT_PAGE);
  const limit = Number(
    request.query.size ? request.query.size : DEFAULT_PAGE_SIZE
  );
  const skip = page * limit;
  try {
    let organizedBatches = await organizedBatchesModel
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
    response.status(200);
    if (!organizedBatches || !organizedBatches.length) {
      response.json({
        items: [],
        total: 0,
        size: 0,
        page: 0,
      });
    } else {
      organizedBatches = JSON.parse(JSON.stringify(organizedBatches));
      const page = skip / limit;
      response.json({
        items: organizedBatches[0].items,
        total: organizedBatches[0].total,
        size: organizedBatches[0].items.length,
        page: page,
      });
    }
  } catch (error) {
    console.error("Error occured: ", error);
    response.status(500);
    response.json({ errors: "Unexpected error occurred" });
  }
};

module.exports = { getOrganizedBatches };
