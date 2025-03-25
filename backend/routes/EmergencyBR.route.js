import express from 'express';
import upload from '../utils/Multer.js';

import {
    getEmergencyRequests,
    getEmergencyRequestById,
    createEmergencyRequest,
    deleteEmergencyRequest,
    acceptEmergencyRequest,
    declineEmergencyRequest
} from '../controllers/EmergencyBR.controller.js';

const router = express.Router();

// Emergency Blood Request Routes
router.get("/", getEmergencyRequests);
router.get("/:emergencyBRId", getEmergencyRequestById);
router.post("/", upload.single('proofDocument'), createEmergencyRequest);
router.delete("/:emergencyBRId", deleteEmergencyRequest);
router.put("/:emergencyBRId/accept", acceptEmergencyRequest);
router.put("/:emergencyBRId/decline", declineEmergencyRequest);

export default router;
