import { Router } from "express";
import batchDataCountroller from "../controllers/batch-data-controller";

const router = Router();

router.get("/batch-data", batchDataCountroller.getBatchDatas);
router.post("/batch-data", batchDataCountroller.postBatchData);

module.exports = router;
