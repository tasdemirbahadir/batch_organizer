import { Router } from "express";
import organizedBatchesController from "../controllers/organized-batches-controller";
import organizedBatchesValidator from "../validators/organized-batches-validator";

const router = Router();

router.get(
  "/batches/organized",
  organizedBatchesValidator.validateGetOrganizedBatchesRequestErrors,
  organizedBatchesController.getOrganizedBatches
);

module.exports = router;
