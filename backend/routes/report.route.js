import express from 'express';
import { generateHealthEvaluationReport, generateInventoryReport, generateDonorReport ,generateHospitalReport} from '../controllers/report.controller.js';

const router = express.Router();

router.get('/inventory-report', generateInventoryReport);
router.get('/healthEvaluation-report', generateHealthEvaluationReport);
router.get('/donor-report',generateDonorReport);
router.get('/hospital-report',generateHospitalReport);
router.use('/reports', express.static('reports'));

export default router;