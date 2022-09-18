import organizedBatchesService from "../services/organized-batches-service";

const getOrganizedBatches = (request, response) => {
  organizedBatchesService.getOrganizedBatches(request, response);
};

module.exports = { getOrganizedBatches };
