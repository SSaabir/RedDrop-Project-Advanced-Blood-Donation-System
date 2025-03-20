import express from "express";
import upload from '../utils/Multer.js';
import {
    getSystemManagers,
    getSystemManagerById,
    createSystemManager,
    updateSystemManager,
    deleteSystemManager,
    activateDeactivateSystemManager
} from "../controllers/SystemManager.controller.js";

const router = express.Router();

router.get("/", getSystemManagers);          // Get all system managers
router.get("/:systemManagerId", getSystemManagerById);    // Get a single system manager by ID
router.post("/", upload.single('image'), createSystemManager);       // Create a new system manager
router.put("/:systemManagerId", upload.single('image'), updateSystemManager);     // Update an existing system manager
router.delete("/:systemManagerId", deleteSystemManager);  // Delete a system manager
router.patch("/:systemManagerId/toggle-status", activateDeactivateSystemManager); // Activate/Deactivate system manager

export default router;