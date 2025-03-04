import express from "express";
import {
    getDonors,
    getDonorById,
    createDonor,
    updateDonor,
    deleteDonor,
    updateHealthStatus,
    updateAppointmentStatus
} from "../controllers/donor.controller.js";

const router = express.Router();

router.get("/", getDonors); // Get all donors
router.get("/:id", getDonorById); // Get a single donor by ID
router.post("/", createDonor); // Create a new donor
router.patch("/:id", updateDonor); // Update donor details
router.delete("/:id", deleteDonor); // Delete donor

// ✅ New Routes for Updating Health and Appointment Status
router.patch("/:id/health-status", updateHealthStatus); // Update health status
router.patch("/:id/appointment-status", updateAppointmentStatus); // Update appointment status

export default router;