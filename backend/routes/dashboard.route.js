import express from 'express';
import { getDonorData, getHospitalData, getManagerData } from '../controllers/dashboard.controller.js';

const router = express.Router();

router.get('/donor', getDonorData);
router.get('/hospital', getHospitalData);
router.get('/manager', getManagerData);

export default router;