import { Router } from "express";
import batchDataCountroller from "../controllers/batch-data-controller";
import batchDataValidator from "../validators/batch-data-validator";
import { handleResponse } from "./response-handler";

const router = Router();

router.get(
  "/batch-data",
  batchDataValidator.validateGetRequest,
  handleResponse(batchDataCountroller.getBatchDatas)
);
router.post(
  "/batch-data",
  batchDataValidator.validatePostRequest,
  handleResponse(batchDataCountroller.postBatchData)
);

module.exports = router;
