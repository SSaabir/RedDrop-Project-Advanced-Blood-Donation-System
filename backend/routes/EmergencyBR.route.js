import express from 'express';
import multer from 'multer';
import fs from 'fs';
import {
    getEmergencyRequests,
    getEmergencyRequestById,
    createEmergencyRequest,
    updateEmergencyRequest,
    deleteEmergencyRequest,
    acceptEmergencyRequest,
    declineEmergencyRequest
} from '../controllers/EmergencyBR.controller.js';

const router = express.Router();

// ✅ Ensure 'uploads/' folder exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Configure Multer (Only for Emergency Requests)
const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

// ✅ Allow Only JPG, PNG, PDF Files
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    allowedTypes.includes(file.mimetype) ? cb(null, true) : cb(new Error('Only .jpg, .png, and .pdf files are allowed'), false);
};

// ✅ Set Upload Limit (100MB)
const upload = multer({ storage, fileFilter, limits: { fileSize: 100 * 1024 * 1024 } });

// ✅ Routes for Emergency Blood Requests
router.get("/", getEmergencyRequests);  // ✅ Get all requests (with search & filter support)
router.get("/:emergencyBRId", getEmergencyRequestById); // ✅ Get a single request by ID
router.post("/", upload.single('proofDocument'), createEmergencyRequest); // ✅ Create request with file upload
router.put("/:emergencyBRId", upload.single('proofDocument'), updateEmergencyRequest); // ✅ Update request with file upload
router.delete("/:emergencyBRId", deleteEmergencyRequest); // ✅ Delete request

// ✅ Accept & Decline Emergency Requests
router.put("/:emergencyBRId/accept", acceptEmergencyRequest);
router.put("/:emergencyBRId/decline", declineEmergencyRequest);

export default router;
