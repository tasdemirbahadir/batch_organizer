import { Router } from "express";
import batchDataCountroller from "../controllers/batch-data-controller";
import batchDataValidator from "../validators/batch-data-validator";

const router = Router();

router.get(
  "/batch-data",
  batchDataValidator.validateGetBatchesBadRequestErrors,
  batchDataCountroller.getBatchDatas
);
router.post(
  "/batch-data",
  batchDataValidator.validatePostBatchBadRequestErrors,
  batchDataCountroller.postBatchData
);

module.exports = router;
