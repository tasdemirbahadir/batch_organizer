import { organizedBatchesModel } from "../models/organized-batches-model";

const DEFAULT_PAGE = 0;
const DEFAULT_PAGE_SIZE = 10;

const getOrganizedBatches = (req, res) => {
  const badRequestErrors = getGetOrganizedBatchesRequestErrors(req);
  if (badRequestErrors.length) {
    res.status(400);
    res.json({ errors: badRequestErrors });
    return;
  }

  const page = Number(req.query.page ? req.query.page : DEFAULT_PAGE);
  const limit = Number(req.query.size ? req.query.size : DEFAULT_PAGE_SIZE);
  const skip = page * limit;
  /**
   * In below aggregation, I am not sure if it will perform well with a high volume of data.
   * It would be better to investiagte and test the code with a large amaount of data.
   */
  organizedBatchesModel
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
    .exec()
    .then(
      (organizedBatches) => {
        res.status(200);
        if (!organizedBatches || !organizedBatches.length) {
          res.json({
            items: [],
            total: 0,
            size: 0,
            page: 0,
          });
        } else {
          organizedBatches = JSON.parse(JSON.stringify(organizedBatches));
          const page = skip / limit;
          res.json({
            items: organizedBatches[0].items,
            total: organizedBatches[0].total,
            size: organizedBatches[0].items.length,
            page: page,
          });
        }
      },
      (err) => {
        console.error("Error occured: ", err);
        res.status(500);
        res.json({ errors: "Unexpected error occurred" });
      }
    );
};

const getGetOrganizedBatchesRequestErrors = (req) => {
  let badRequestErrors = [];
  if (req.query.size) {
    if (isNaN(req.query.size)) {
      badRequestErrors.push("Page size value must be a number");
    } else if (req.query.size < 1) {
      badRequestErrors.push("Min page size is 1");
    }
  }
  if (req.query.page) {
    if (isNaN(req.query.page)) {
      badRequestErrors.push("Page value must be a number");
    } else if (req.query.page < 0) {
      badRequestErrors.push("Min page value is 0");
    }
  }
  return badRequestErrors;
};

module.exports = { getOrganizedBatches };
