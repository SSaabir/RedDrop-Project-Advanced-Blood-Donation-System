import express from "express";
import {
    getDonors,
    getDonorById,
    createDonor,
    updateDonor,
    deleteDonor
} from "../controllers/donor.controller.js";

const router = express.Router();

router.get("/", getDonors); // Get all donors
router.get("/:id", getDonorById); // Get a single donor by ID
router.post("/", createDonor); // Create a new donor
router.patch("/:id", updateDonor); // Update donor details
router.delete("/:id", deleteDonor); // Delete donor

export default router;