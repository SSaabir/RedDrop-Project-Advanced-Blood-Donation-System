import express from "express";
import {
    getFeedbacks,
    getFeedbackById,
    createFeedback,
    updateFeedback,
    deleteFeedback
} from "../controllers/feedback.controller.js";

const router = express.Router();

router.get("/", getFeedbacks); // Get all feedback
router.get("/:id", getFeedbackById); // Get a single feedback by ID
router.post("/", createFeedback); // Create new feedback
router.patch("/:id", updateFeedback); // Update feedback details
router.delete("/:id", deleteFeedback); // Delete feedback

export default router;