import express from "express";
import {
    getInquiries,
    getInquiryById,
    createInquiry,
    updateInquiry,
    deleteInquiry
} from "../controllers/inquiry.controller.js";

const router = express.Router();

router.get("/", getInquiries); // Get all inquiries
router.get("/:id", getInquiryById); // Get a single inquiry by ID
router.post("/", createInquiry); // Create a new inquiry
router.patch("/:id", updateInquiry); // Update inquiry details
router.delete("/:id", deleteInquiry); // Delete inquiry

export default router;