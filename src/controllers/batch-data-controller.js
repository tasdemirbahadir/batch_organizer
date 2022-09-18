import batchDataService from "../services/batch-data-service";

const getBatchDatas = (request, response) => {
  const page = request.query.page ? Number(request.query.page) : null;
  const size = request.query.size ? Number(request.query.size) : null;
  return batchDataService.getBatchDatas(page, size, response);
};

const postBatchData = (request, response) => {
  const batchData = {
    batch_id: request.body.batchId,
    value: Number(request.body.number),
    time: new Date(),
  }
  return batchDataService.postBatchData(batchData, response);
};

module.exports = { getBatchDatas, postBatchData };
