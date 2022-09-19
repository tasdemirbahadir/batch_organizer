import { paginate } from "../adaptors/organized-batches-adaptor";

const DEFAULT_PAGE = 0;
const DEFAULT_PAGE_SIZE = 10;

const getOrganizedBatches = async (page, size) => {
  const pageVal = page ? page : DEFAULT_PAGE;
  const limit = size ? size : DEFAULT_PAGE_SIZE;
  const skip = pageVal * limit;
  let organizedBatches = await paginate(skip, limit);
  let payload;
  if (!organizedBatches || !organizedBatches.length) {
    payload = {
      items: [],
      total: 0,
      size: 0,
      page: 0,
    };
  } else {
    organizedBatches = JSON.parse(JSON.stringify(organizedBatches));
    const responsePageVal = skip / limit;
    payload = {
      items: organizedBatches[0].items,
      total: organizedBatches[0].total,
      size: organizedBatches[0].items.length,
      page: responsePageVal,
    };
  }
  return {
    status: 200,
    payload,
  };
};

module.exports = { getOrganizedBatches };
