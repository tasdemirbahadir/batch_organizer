import { batchDataModel } from "../models/batch-data";

const debug = require("debug")("server:debug");
const DEFAULT_PAGE = 0;
const DEFAULT_PAGE_SIZE = 10;

const getBatchDatas = (req, res) => {
  const badRequestErrors = getGetBatchesBadRequestErrors(req);
  if (badRequestErrors.length) {
    res.status(400);
    res.json({ errors: badRequestErrors });
    return;
  }

  const page = Number(req.query.page ? req.query.page : DEFAULT_PAGE);
  const limit = Number(req.query.size ? req.query.size : DEFAULT_PAGE_SIZE);
  const offset = page * limit;
  batchDataModel.paginate({}, { offset, limit }).then(
    (result) => {
      const page = result.offset / result.limit;
      res.json({
        items: result.docs,
        total: result.total,
        size: result.docs.length,
        page,
      });
    },
    (err) => {
      console.error("Error occured: ", err);
      res.status(500);
      res.json({ errors: "Unexpected error occurred" });
    }
  );
};

const postBatchData = (req, res) => {
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
      /**
       * In below aggregation, I am not sure if it will perform well with a high volume of data.
       * It would be better to investiagte and test the code with a large amaount of data.
       */
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
  if (req.query.size) {
    if (isNaN(req.query.size)) {
      badRequestErrors.push("Page size value must be a number");
    } else {
      if (req.query.size > 20) {
        badRequestErrors.push("Max page size is 20");
      }
      if (req.query.size < 1) {
        badRequestErrors.push("Min page size is 1");
      }
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

const getPostBatchBadRequestErrors = (req) => {
  let badRequestErrors = [];
  if (!req.headers.batch_id) {
    badRequestErrors.push(
      "Batch ID doesn't exist in header with the key 'batch_id'. Sample header: batch_id=<string_val>"
    );
  }
  if (!req.body.number) {
    badRequestErrors.push(
      "Data 'number' doesn't exist in body. Sample body: { number: <number_val> }"
    );
  } else if (isNaN(req.body.number)) {
    badRequestErrors.push(
      "The value of data 'number' must be type of number. Sample body: { number: <number_val> }"
    );
  }
  return badRequestErrors;
};

module.exports = { postBatchData, getBatchDatas };
