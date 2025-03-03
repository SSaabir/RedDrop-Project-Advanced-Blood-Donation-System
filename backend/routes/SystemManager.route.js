import express from "express";
import {
    getSystemManagers,
    getSystemManagerById,
    createSystemManager,
    updateSystemManager,
    deleteSystemManager
} from "../controllers/SystemManager.controller.js";

const router = express.Router();

router.get("/", getSystemManagers);          // Get all system managers
router.get("/:id", getSystemManagerById);    // Get a single system manager by ID
router.post("/", createSystemManager);       // Create a new system manager
router.put("/:id", updateSystemManager);     // Update an existing system manager
router.delete("/:id", deleteSystemManager);  // Delete a system manager

export default router;
