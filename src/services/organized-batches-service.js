import { paginate } from "../adaptors/organized-batches-adaptor";

const DEFAULT_PAGE = 0;
const DEFAULT_PAGE_SIZE = 10;

const getOrganizedBatches = async (page, size, response) => {
  const pageVal = page ? page : DEFAULT_PAGE;
  const limit = size ? size : DEFAULT_PAGE_SIZE;
  const skip = pageVal * limit;
  try {
    let organizedBatches = await paginate(skip, limit);
    response.status(200);
    if (!organizedBatches || !organizedBatches.length) {
      response.json({
        items: [],
        total: 0,
        size: 0,
        page: 0,
      });
    } else {
      organizedBatches = JSON.parse(JSON.stringify(organizedBatches));
      const responsePageVal = skip / limit;
      response.json({
        items: organizedBatches[0].items,
        total: organizedBatches[0].total,
        size: organizedBatches[0].items.length,
        page: responsePageVal,
      });
    }
  } catch (error) {
    console.error("Error occured: ", error);
    response.status(500);
    response.json({ errors: "Unexpected error occurred" });
  }
};

module.exports = { getOrganizedBatches };
