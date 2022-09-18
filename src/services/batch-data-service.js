import { batchDataModel } from "../models/batch-data-model";

const debug = require("debug")("server:debug");
const DEFAULT_PAGE = 0;
const DEFAULT_PAGE_SIZE = 10;

const getBatchDatas = async (page, size, response) => {
  const pageVal = page ? page : DEFAULT_PAGE;
  const limit = size ? size : DEFAULT_PAGE_SIZE;
  const offset = pageVal * limit;
  try {
    const batchDatas = await batchDataModel.paginate({}, { offset, limit });
    const responsePageVal = batchDatas.offset / batchDatas.limit;
    response.json({
      items: batchDatas.docs,
      total: batchDatas.total,
      size: batchDatas.docs.length,
      page: responsePageVal,
    });
  } catch (error) {
    console.error("Error occured: ", error);
    response.status(500);
    response.json({ errors: "Unexpected error occurred" });
  }
};

const postBatchData = async (batchData, response) => {
  const newBatchData = new batchDataModel(batchData);
  try {
    await newBatchData.save();
    const result = await batchDataModel
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
    debug(`Process took: ${result}`);
    response.status(201);
    response.json({ result: "SUCCESS" });
  } catch (error) {
    console.error("Error occured: ", error);
    response.status(500);
    response.json({ errors: "Unexpected error occurred" });
  }
};

module.exports = { postBatchData, getBatchDatas };
