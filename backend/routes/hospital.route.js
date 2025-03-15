import express from "express";
import {
    getHospitals,
    getHospitalById,
    createHospital,
    updateHospital,
    deleteHospital,
    signinHospital,
    updateOperatingHours,
    activateDeactivateHospital
} from "../controllers/hospital.controller.js";

const router = express.Router();

// ✅ Get all hospitals
router.get("/", getHospitals);

// ✅ Get a single hospital by ID
router.get("/:id", getHospitalById);

// ✅ Create a new hospital
router.post("/", createHospital);

// ✅ Update hospital details
router.patch("/:id", updateHospital);

// ✅ Delete a hospital
router.delete("/:id", deleteHospital);

// ✅ Signin hospital
router.post("/signin", signinHospital); // Post route for hospital signin

// ✅ Update operating hours of a hospital
router.patch("/:id/operating-hours", updateOperatingHours); // Update operating hours by ID

// ✅ Activate/Deactivate a hospital
router.patch("/:id/toggle-status", activateDeactivateHospital); // Toggle hospital active status

export default router;