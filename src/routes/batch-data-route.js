import { batchDataModel } from "../models/batch-data-model";

const debug = require("debug")("server:debug");
const DEFAULT_PAGE = 0;
const DEFAULT_PAGE_SIZE = 10;

const getBatchDatas = (request, response) => {
  const badRequestErrors = getGetBatchesBadRequestErrors(request);
  if (badRequestErrors.length) {
    response.status(400);
    response.json({ errors: badRequestErrors });
    return;
  }

  const page = Number(request.query.page ? request.query.page : DEFAULT_PAGE);
  const limit = Number(
    request.query.size ? request.query.size : DEFAULT_PAGE_SIZE
  );
  const offset = page * limit;
  batchDataModel.paginate({}, { offset, limit }).then(
    (result) => {
      const page = result.offset / result.limit;
      response.json({
        items: result.docs,
        total: result.total,
        size: result.docs.length,
        page,
      });
    },
    (err) => {
      console.error("Error occured: ", err);
      response.status(500);
      response.json({ errors: "Unexpected error occurred" });
    }
  );
};

const postBatchData = (request, response) => {
  const badRequestErrors = getPostBatchBadRequestErrors(request);
  if (badRequestErrors.length) {
    response.status(400);
    response.json({ errors: badRequestErrors });
    return;
  }

  const newBatchData = new batchDataModel({
    batch_id: request.body.batchId,
    value: request.body.number,
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
        response.status(201);
        response.json({ result: "SUCCESS" });
      },
      (err) => {
        console.error("Error occured: ", err);
        response.status(500);
        response.json({ errors: "Unexpected error occurred" });
      }
    );
};

const getGetBatchesBadRequestErrors = (request) => {
  let badRequestErrors = [];
  if (request.query.size) {
    if (isNaN(request.query.size)) {
      badRequestErrors.push("Page size value must be a number");
    } else {
      if (request.query.size > 20) {
        badRequestErrors.push("Max page size is 20");
      }
      if (request.query.size < 1) {
        badRequestErrors.push("Min page size is 1");
      }
    }
  }
  if (request.query.page) {
    if (isNaN(request.query.page)) {
      badRequestErrors.push("Page value must be a number");
    } else if (request.query.page < 0) {
      badRequestErrors.push("Min page value is 0");
    }
  }
  return badRequestErrors;
};

const getPostBatchBadRequestErrors = (request) => {
  let badRequestErrors = [];
  if (!request.body.batchId) {
    badRequestErrors.push(
      "Data 'batchId' doesn't exist in body. Sample body: { batchId: <string_val>, number: <number_val> }"
    );
  }
  if (!request.body.number) {
    badRequestErrors.push(
      "Data 'number' doesn't exist in body. Sample body: { batchId: <string_val>, number: <number_val> }"
    );
  } else if (isNaN(request.body.number)) {
    badRequestErrors.push(
      "The value of data 'number' must be type of number. Sample body: { batchId: <string_val>, number: <number_val> }"
    );
  }
  return badRequestErrors;
};

module.exports = { postBatchData, getBatchDatas };
