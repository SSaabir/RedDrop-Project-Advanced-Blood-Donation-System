// routes/inquiryRoutes.js
import express from 'express';
import {
    getAllInquiries,
    getInquiryById,
    createInquiry,
    updateInquiryStatus,
    deleteInquiry
} from '../controllers/inquiry.controller.js';

const router = express.Router();

// Get all inquiries
router.get('/inquiries', getAllInquiries);

// Get a specific inquiry by ID
router.get('/inquiries/:id', getInquiryById);

// Create a new inquiry
router.post('/inquiries', createInquiry);

// Update inquiry status
router.put('/inquiries/:id/status', updateInquiryStatus);

// Delete an inquiry by ID
router.delete('/inquiries/:id', deleteInquiry);

export default router;
