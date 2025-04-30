import express from 'express';
import { generateHealthEvaluationReport, generateInventoryReport,generateFeedbackReport,generateInquiryReport } from '../controllers/report.controller.js';

const router = express.Router();

router.get('/inventory-report', generateInventoryReport);
router.get('/healthEvaluation-report', generateHealthEvaluationReport);
router.get('/feedback-report', generateFeedbackReport);
router.get('/inquiry-report', generateInquiryReport);


router.use('/reports', express.static('reports'));

export default router;