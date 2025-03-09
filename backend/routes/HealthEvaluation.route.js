import express from "express";
import upload from "../utils/multer.js";

import {
  getHealthEvaluations,
  getHealthEvaluationById,
  createEvaluation,
  updateEvaluationDateTime,
  cancelEvaluation,
  acceptEvaluation,
  arrivedForEvaluation,
  completeEvaluation,
  deleteHealthEvaluation,
} from "../controllers/HealthEvaluation.controller.js";

const router = express.Router();

router.get("/", getHealthEvaluations);
router.get("/:id", getHealthEvaluationById);
router.post("/", createEvaluation);
router.patch("/:id/date-time", updateEvaluationDateTime); 
router.patch("/:id/cancel", cancelEvaluation); 
router.delete("/:id", deleteHealthEvaluation);
router.patch("/:id/accept", acceptEvaluation);
router.patch("/:id/arrived", arrivedForEvaluation);
router.patch("/:id/complete", upload.single('evaluationFile'), completeEvaluation);

export default router;
