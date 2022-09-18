import { paginate, save } from "../adaptors/batch-data-adaptor";

const debug = require("debug")("server:debug");
const DEFAULT_PAGE = 0;
const DEFAULT_PAGE_SIZE = 10;

const getBatchDatas = async (page, size, response) => {
  const pageVal = page ? page : DEFAULT_PAGE;
  const limit = size ? size : DEFAULT_PAGE_SIZE;
  const offset = pageVal * limit;
  try {
    const batchDatas = await paginate(offset, limit);
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
  try {
    const result = await save(batchData);
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
