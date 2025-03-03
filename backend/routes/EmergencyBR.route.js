import express from 'express';
import { 
    getEmergencyRequests, 
    getEmergencyRequestById, 
    createEmergencyRequest, 
    updateEmergencyRequest, 
    deleteEmergencyRequest 
} from '../controllers/EmergencyBR.controller.js';

const router = express.Router();

// ✅ Get all emergency requests
router.get("/", getEmergencyRequests);

// ✅ Get a single emergency request by ID
router.get("/:id", getEmergencyRequestById);

// ✅ Create a new emergency request
router.post("/", createEmergencyRequest);

// ✅ Update an emergency request
router.put("/:id", updateEmergencyRequest);

// ✅ Delete an emergency request
router.delete("/:id", deleteEmergencyRequest);

export default router;
