import batchDataService from "../services/batch-data-service";

const getBatchDatas = (request, response) => {
  return batchDataService.getBatchDatas(request, response);
};

const postBatchData = (request, response) => {
  return batchDataService.postBatchData(request, response);
};

module.exports = { getBatchDatas, postBatchData };
