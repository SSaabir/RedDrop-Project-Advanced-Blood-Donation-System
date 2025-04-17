import BloodInventory from '../models/BloodInventory.model.js';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import HealthEvaluation from '../models/HealthEvaluation.model.js';

export const generateHealthEvaluationReport = async (req, res) => {
  try {
    const { userId } = req.query;

    const evaluations = await HealthEvaluation.find({ donorId: userId })
      .populate('donorId', 'firstName lastName email')
      .sort({ evaluationDate: -1 });

    if (!evaluations.length) {
      return res.status(404).json({ success: false, message: 'No evaluations found for this donor' });
    }

    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    const fileName = `health_evaluation_report_${new Date().toISOString().split('T')[0]}.pdf`;
    const filePath = `./reports/${fileName}`;

    if (!fs.existsSync('./reports')) {
      fs.mkdirSync('./reports');
    }

    doc.pipe(fs.createWriteStream(filePath));

    // Add logo
    const logoPath = '../../frontend/src/assets/logo.svg';
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 40, 30, { width: 80 });
    }

    doc.fontSize(18).text('Health Evaluation Report', 0, 50, { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Generated: ${new Date().toDateString()}`, { align: 'right' });

    // Table headers
    const tableTop = 130;
    const rowHeight = 25;
    const colWidths = [25, 90, 60, 45, 50, 70, 65, 60];
    const startX = 40;

    const headers = ['No', 'Donor', 'Date', 'Time', 'Pass', 'Progress', 'Active', 'Feedback'];

    let y = tableTop;

    // Draw header background
    doc.rect(startX, y, colWidths.reduce((a, b) => a + b), rowHeight).fill('#f0f0f0').stroke();

    doc.font('Helvetica-Bold').fillColor('#000').fontSize(10);
    let x = startX;
    headers.forEach((header, i) => {
      doc.text(header, x + 2, y + 7, { width: colWidths[i], align: 'left' });
      x += colWidths[i];
    });

    y += rowHeight;

    // Draw rows
    doc.font('Helvetica').fillColor('#000');

    evaluations.forEach((item, index) => {
      x = startX;
      const donorName = `${item.donorId?.firstName || ''} ${item.donorId?.lastName || ''}`;
      const row = [
        index + 1,
        donorName,
        item.evaluationDate?.toDateString() || 'N/A',
        item.evaluationTime || 'N/A',
        item.passStatus,
        item.progressStatus,
        item.activeStatus,
        item.feedbackStatus ? 'Yes' : 'No',
      ];

      // Row background alternating color (optional)
      if (index % 2 === 0) {
        doc.rect(startX, y, colWidths.reduce((a, b) => a + b), rowHeight).fill('#ffffff').stroke();
      } else {
        doc.rect(startX, y, colWidths.reduce((a, b) => a + b), rowHeight).fill('#f9f9f9').stroke();
      }

      // Draw text for each column
      x = startX;
      row.forEach((data, i) => {
        doc.fillColor('#000').text(data, x + 2, y + 7, { width: colWidths[i], align: 'left' });
        x += colWidths[i];
      });

      y += rowHeight;
    });

    doc.end();
    res.json({ success: true, fileUrl: `/reports/${fileName}` });
  } catch (error) {
    console.error('Error generating health evaluation report:', error);
    res.status(500).json({ success: false, message: 'Error generating report' });
  }
};


export const generateInventoryReport = async (req, res) => {
    try {
        const { userId } = req.query; // Using query as per frontend

        console.log('User ID:', userId);

        // Update expired status before generating report
        await BloodInventory.updateExpiredStatus();

        // Query all inventory for this hospital
        const inventoryItems = await BloodInventory.find({
            hospitalId: userId
        }).select('bloodType availableStocks expirationDate expiredStatus createdAt updatedAt');

        if (!inventoryItems.length) {
            return res.status(404).json({ success: false, message: 'No inventory found for this hospital' });
        }

        // Generate PDF
        const doc = new PDFDocument();
        const fileName = `inventory_report_${new Date().toISOString().split('T')[0]}.pdf`;
        const filePath = `./reports/${fileName}`;
        
        if (!fs.existsSync('./reports')) {
            fs.mkdirSync('./reports');
        }

        doc.pipe(fs.createWriteStream(filePath));
        doc.fontSize(16).text('Blood Inventory Report', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Hospital ID: ${userId}`);
        doc.text(`Generated: ${new Date().toDateString()}`);
        
        doc.moveDown();
        doc.text('Inventory Details:', { underline: true });
        inventoryItems.forEach((item, index) => {
            doc.moveDown(0.5);
            doc.text(`${index + 1}. Blood Type: ${item.bloodType}`);
            doc.text(`   Stocks: ${item.availableStocks}`);
            doc.text(`   Expiration: ${item.expirationDate ? item.expirationDate.toDateString() : 'N/A'}`);
            doc.text(`   Expired: ${item.expiredStatus ? 'Yes' : 'No'}`);
            doc.text(`   Created: ${item.createdAt ? item.createdAt.toDateString() : 'N/A'}`);
            doc.text(`   Updated: ${item.updatedAt ? item.updatedAt.toDateString() : 'N/A'}`);
        });

        doc.end();

        res.json({ success: true, fileUrl: `/reports/${fileName}` });
    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({ success: false, message: 'Error generating report' });
    }
};