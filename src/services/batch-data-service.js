import { paginate, save } from "../adaptors/batch-data-adaptor";

const debug = require("debug")("server:debug");
const DEFAULT_PAGE = 0;
const DEFAULT_PAGE_SIZE = 10;

const getBatchDatas = async (page, size) => {
  const pageVal = page ? page : DEFAULT_PAGE;
  const limit = size ? size : DEFAULT_PAGE_SIZE;
  const offset = pageVal * limit;
  const batchDatas = await paginate(offset, limit);
  const responsePageVal = batchDatas.offset / batchDatas.limit;
  return {
    status: 200,
    payload: {
      items: batchDatas.docs,
      total: batchDatas.total,
      size: batchDatas.docs.length,
      page: responsePageVal,
    }
  };
};

const postBatchData = async (batchData) => {
  const result = await save(batchData);
  debug(`Process took: ${result}`);
  return {
    status: 201,
    payload: { result: "SUCCESS" }
  }
};

module.exports = { postBatchData, getBatchDatas };
