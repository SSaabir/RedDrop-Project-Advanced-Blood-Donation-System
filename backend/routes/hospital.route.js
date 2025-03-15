import express from "express";
import upload from "../utils/multer.js";
import {
    getHospitals,
    getHospitalById,
    createHospital,
    updateHospital,
    signinHospital
} from "../controllers/hospital.controller.js";

const router = express.Router();

// ✅ Hospital Routes
router.get("/", getHospitals); // Get all hospitals
router.get("/:id", getHospitalById); // Get a single hospital by ID
router.post("/", upload.single("image"), createHospital); // Sign up (Create Hospital)
router.post("/signin", signinHospital); // Sign in (Login)
router.put("/:id", upload.single("image"), updateHospital); // Update hospital

export default router;