import express from 'express';
import { generateHealthEvaluationReport, generateInventoryReport } from '../controllers/report.controller.js';

const router = express.Router();

router.get('/inventory-report', generateInventoryReport);
router.get('/healthEvaluation-report', generateHealthEvaluationReport);
router.use('/reports', express.static('reports'));

export default router;