import organizedBatchesService from "../services/organized-batches-service";

const getOrganizedBatches = (request, response) => {
  const page = request.query.page ? Number(request.query.page) : null;
  const size = request.query.size ? Number(request.query.size) : null;
  organizedBatchesService.getOrganizedBatches(page, size, response);
};

module.exports = { getOrganizedBatches };
