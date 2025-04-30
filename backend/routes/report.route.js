import express from 'express';
import { generateHealthEvaluationReport, generateInventoryReport, generateAppointmentReport,generateSystemAdminReport } from '../controllers/report.controller.js';

const router = express.Router();

router.get('/inventory-report', generateInventoryReport);
router.get('/healthEvaluation-report', generateHealthEvaluationReport);
router.get('/appointment-report', generateAppointmentReport);
router.get('/systemAdmin-report', generateSystemAdminReport);

router.use('/reports', express.static('reports'));

export default router;