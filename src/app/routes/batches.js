import { batchDataModel } from "../models/batch-data";

const debug = require("debug")("server:debug");
const DEFAULT_PAGE = 0;
const DEFAULT_PAGE_SIZE = 10;

const getBatches = (req, res) => {
  const badRequestErrors = getGetBatchesBadRequestErrors(req);
  if (badRequestErrors.length) {
    res.status(400);
    res.json({ errors: badRequestErrors });
    return;
  }

  const page = req.query.page ? req.query.page : DEFAULT_PAGE;
  const limit = req.query.size ? req.query.size : DEFAULT_PAGE_SIZE;
  const offset = page * limit;

  batchDataModel.paginate({}, { offset, limit })
    .then(result => {
      const response = {
        items: result.docs,
        total: result.total,
        size: result.limit,
        page: result.offset / result.limit,
      };
      res.json(response);
    }, err => {
      console.error("Error occured: ", err);
      res.status(500);
      res.json({ errors: "Unexpected error occurred" });
    });
};

const postBatch = (req, res) => {
  const badRequestErrors = getPostBatchBadRequestErrors(req);
  if (badRequestErrors.length) {
    res.status(400);
    res.json({ errors: badRequestErrors });
    return;
  }

  const newBatchData = new batchDataModel({
    batch_id: req.headers.batch_id,
    value: req.body.number,
    time: new Date(),
  });
  return newBatchData
    .save()
    .then(() => {
      return batchDataModel
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
    })
    .then(
      (result) => {
        debug(`Process took: ${result}`);
        res.status(201);
        res.json({ result: "SUCCESS" });
      },
      (err) => {
        console.error("Error occured: ", err);
        res.status(500);
        res.json({ errors: "Unexpected error occurred" });
      }
    );
};

const getGetBatchesBadRequestErrors = (req) => {
  let badRequestErrors = [];
  if (req.query.size && req.query.size > 20) {
    badRequestErrors.push("Max page size is 20");
  }
  return badRequestErrors;
};

const getPostBatchBadRequestErrors = (req) => {
  let badRequestErrors = [];
  if (!req.headers.batch_id) {
    badRequestErrors.push(
      "Batch ID doesn't exist in header with the key 'batch_id'. Sample header: batch_id=<string_val>"
    );
  }
  if (!req.body.number) {
    badRequestErrors.push(
      "Data 'number' doesn't exist in body. Sample body: { number: <integer_val> }"
    );
  }
  return badRequestErrors;
};

module.exports = { postBatch, getBatches };
