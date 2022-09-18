import { Router } from "express";
import organizedBatchesController from "../controllers/organized-batches-controller";

const router = Router();

router.get(
  "/batches/organized",
  organizedBatchesController.getOrganizedBatches
);

module.exports = router;
