import express from 'express';
import multer from 'multer';
import {
    getEmergencyRequests,
    getEmergencyRequestById,
    createEmergencyRequest,
    updateEmergencyRequest,
    deleteEmergencyRequest
} from '../controllers/EmergencyBR.controller.js';

import fs from 'fs';

const router = express.Router();

// ✅ Ensure 'uploads/' folder exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Save files in 'uploads/' folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Unique filename
    },
});

// ✅ File filter to allow only certain types (PDF, JPG, PNG)
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only .jpg, .png, and .pdf files are allowed'), false);
    }
};

// ✅ Set upload limits (10MB max)
const upload = multer({ 
    storage, 
    fileFilter, 
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// ✅ Get all emergency requests
router.get("/", getEmergencyRequests);

// ✅ Get a single emergency request by emergencyBRId
router.get("/:emergencyBRId", getEmergencyRequestById);

// ✅ Create a new emergency request with file upload
router.post("/", upload.single('proofDocument'), createEmergencyRequest);

// ✅ Update an emergency request with file upload
router.put("/:emergencyBRId", upload.single('proofDocument'), updateEmergencyRequest);

// ✅ Delete an emergency request by emergencyBRId
router.delete("/:emergencyBRId", deleteEmergencyRequest);

export default router;

