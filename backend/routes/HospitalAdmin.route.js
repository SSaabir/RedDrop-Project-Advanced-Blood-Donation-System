import express from 'express';
import {
    getHospitalAdmins,
    getHospitalAdminById,
    createHospitalAdmin,
    updateHospitalAdmin,
    deleteHospitalAdmin,
} from '../controllers/HospitalAdmin.controller.js';

const router = express.Router();

// Hospital Admin CRUD Routes
router.get('/', getHospitalAdmins);               // Get all hospital admins
router.get('/:id', getHospitalAdminById);         // Get a single hospital admin by ID
router.post('/', createHospitalAdmin);            // Create a new hospital admin
router.put('/:id', updateHospitalAdmin);          // Update hospital admin details
router.delete('/:id', deleteHospitalAdmin);      // Delete a hospital admin

export default router;
