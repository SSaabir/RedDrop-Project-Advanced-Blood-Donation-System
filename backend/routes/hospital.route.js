import express from "express";
import {
    getHospitals,
    getHospitalById,
    createHospital,
    updateHospital,
    deleteHospital
} from "../controllers/hospital.controller.js";

const router = express.Router();

router.get("/", getHospitals); // Get all hospitals
router.get("/:id", getHospitalById); // Get a single hospital by ID
router.post("/", createHospital); // Create a new hospital
router.patch("/:id", updateHospital); // Update hospital details
router.delete("/:id", deleteHospital); // Delete hospital

export default router;