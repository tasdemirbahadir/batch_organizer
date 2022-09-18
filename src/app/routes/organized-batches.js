import { organizedBatchesModel } from "../models/organized-batches";

const DEFAULT_PAGE = 0;
const DEFAULT_PAGE_SIZE = 10;

const getOrganizedBatches = (req, res) => {
  const badRequestErrors = getGetOrganizedBatchesRequestErrors(req);
  if (badRequestErrors.length) {
    res.status(400);
    res.json({ errors: badRequestErrors });
    return;
  }

  const page = req.query.page ? req.query.page : DEFAULT_PAGE;
  const limit = req.query.size ? req.query.size : DEFAULT_PAGE_SIZE;
  const offset = page * limit;
  organizedBatchesModel
    .findOne({}, { values: { $slice: [Number(offset), Number(limit)] } })
    .exec()
    .then(
      (organizedBatches) => {
        if (!organizedBatches) {
          res.status(200);
          res.json({ message: "Currently there aren't any batches" });
        } else {
          res.status(200);
          organizedBatches = JSON.parse(JSON.stringify(organizedBatches));
          const response = {
            items: organizedBatches.values,
            page: offset / limit,
            size: organizedBatches.values.length,
          };
          res.json(response);
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
