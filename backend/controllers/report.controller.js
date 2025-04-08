import BloodInventory from '../models/BloodInventory.model.js';
import PDFDocument from 'pdfkit';
import fs from 'fs';

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