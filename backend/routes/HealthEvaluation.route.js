import express from "express";
import {
  getHealthEvaluations,
  getHealthEvaluationById,
  createEvaluation,
  updateEvaluationDateTime,
  cancelEvaluation,
  deleteHealthEvaluation,
} from "../controllers/HealthEvaluation.controller.js";

const router = express.Router();

router.get("/", getHealthEvaluations);
router.get("/:id", getHealthEvaluationById);
router.post("/", createEvaluation);
router.patch("/:id/date-time", updateEvaluationDateTime); // Update only date & time
router.patch("/:id/cancel", cancelEvaluation); // Cancel evaluation
router.delete("/:id", deleteHealthEvaluation);

export default router;
