import express from "express";
import upload from "../utils/multer.js";
import {
    getHospitals,
    getHospitalById,
    createHospital,
    updateHospital,
    deleteHospital,
} from "../controllers/hospital.controller.js";

const router = express.Router();

// Hospital CRUD Routes
router.get("/", getHospitals); // Get all hospitals
router.get("/:id", getHospitalById); // Get a single hospital by ID
router.post("/", upload.single("image"), createHospital); // Create a new hospital with image upload
router.put("/:id", upload.single("image"), updateHospital); // Update hospital details with image upload
router.delete("/:id", deleteHospital); // Delete hospital

export default router;