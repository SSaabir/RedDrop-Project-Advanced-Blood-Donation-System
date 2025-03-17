import express from "express";
import upload from "../utils/multer.js"; // Importing multer for image upload
import {
    getHospitals,
    getHospitalById,
    createHospital,
    updateHospital,
    signinHospital,
    deleteHospital, // You might want a delete route as well
    activateDeactivateHospital, // For activation/deactivation of hospital
} from "../controllers/hospital.controller.js";

const router = express.Router();

// Get all hospitals
router.get("/", getHospitals);

// Get a single hospital by ID
router.get("/:id", getHospitalById);

// Create a new hospital (sign-up)
router.post("/", upload.single("image"), createHospital);

// Hospital sign-in (login)
router.post("/signin", signinHospital);

// Update hospital details (with optional image upload)
router.put("/:id", upload.single("image"), updateHospital);

// Delete a hospital
router.delete("/:id", deleteHospital);

// Activate/Deactivate hospital
router.patch("/:id/toggle-status", activateDeactivateHospital);

export default router;