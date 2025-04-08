import express from 'express';
import { generateInventoryReport } from '../controllers/report.controller.js';

const router = express.Router();

router.get('/inventory-report', generateInventoryReport);
router.use('/reports', express.static('reports'));

export default router;