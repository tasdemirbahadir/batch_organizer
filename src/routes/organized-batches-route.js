import { Router } from "express";
import organizedBatchesController from "../controllers/organized-batches-controller";
import organizedBatchesValidator from "../validators/organized-batches-validator";
import { handleResponse } from "./response-handler";

const router = Router();

router.get(
  "/batches/organized",
  organizedBatchesValidator.validateGetOrganizedBatchesRequestErrors,
  handleResponse(organizedBatchesController.getOrganizedBatches)
);

module.exports = router;
