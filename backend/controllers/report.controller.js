import BloodInventory from '../models/BloodInventory.model.js';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import HealthEvaluation from '../models/HealthEvaluation.model.js';
import Feedback from '../models/feedback.model.js';
import Inquiry from '../models/inquiry.model.js';
import Appointment from '../models/BloodDonationAppointment.model.js';
import Manager from '../models/SystemManager.model.js';
import Donor from '../models/donor.model.js';
import Hospital from '../models/hospital.model.js';

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

export const generateFeedbackReport = async (req, res) => {
  try {
    // Fetch feedback for the user (donorId or systemManagerId)
    const feedbackItems = await Feedback.find()
      .select('subject comments feedbackType starRating sessionModel createdAt')
      .sort({ createdAt: -1 });

    // Generate PDF
    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    const fileName = `feedback_report_${new Date().toISOString().split('T')[0]}.pdf`;
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

    doc.fontSize(18).text('Feedback Report', 0, 50, { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Generated: ${new Date().toDateString()}`, { align: 'right' });

    // Table headers
    const tableTop = 130;
    const rowHeight = 25;
    const colWidths = [30, 100, 100, 80, 50, 80, 80];
    const startX = 40;

    const headers = ['No', 'Subject', 'Comments', 'Type', 'Rating', 'Session', 'Created'];

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

    feedbackItems.forEach((item, index) => {
      x = startX;
      const row = [
        index + 1,
        item.subject || 'N/A',
        item.comments ? item.comments.substring(0, 20) + (item.comments.length > 20 ? '...' : '') : 'N/A',
        item.feedbackType || 'N/A',
        item.starRating || 'N/A',
        item.sessionModel || 'N/A',
        item.createdAt ? item.createdAt.toDateString() : 'N/A',
      ];

      // Row background alternating color
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
    console.error('Error generating feedback report:', error);
    res.status(500).json({ success: false, message: 'Error generating report' });
  }
};

export const generateInquiryReport = async (req, res) => {
  try {
    // Fetch inquiries
    const inquiries = await Inquiry.find()
      .select('email subject message category attentiveStatus createdAt')
      .sort({ createdAt: -1 });

    // Generate PDF
    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    const fileName = `inquiry_report_${new Date().toISOString().split('T')[0]}.pdf`;
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

    doc.fontSize(18).text('Inquiry Report', 0, 50, { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Generated: ${new Date().toDateString()}`, { align: 'right' });

    // Table headers
    const tableTop = 130;
    const rowHeight = 25;
    const colWidths = [30, 100, 100, 80, 80, 80, 80];
    const startX = 40;

    const headers = ['No', 'Email', 'Subject', 'Message', 'Category', 'Status', 'Created'];

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

    inquiries.forEach((item, index) => {
      x = startX;
      const row = [
        index + 1,
        item.email || 'N/A',
        item.subject || 'N/A',
        item.message ? item.message.substring(0, 20) + (item.message.length > 20 ? '...' : '') : 'N/A',
        item.category || 'N/A',
        item.attentiveStatus || 'N/A',
        item.createdAt ? item.createdAt.toDateString() : 'N/A',
      ];

      // Row background alternating color
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
    console.error('Error generating inquiry report:', error);
    res.status(500).json({ success: false, message: 'Error generating report' });
  }
};

export const generateAppointmentReport = async (req, res) => {
  try {
    const { userId } = req.query;

    const appointments = await Appointment.find({ hospitalId: userId })
      .populate('donorId', 'firstName lastName email')
      .populate('hospitalId', 'name')
      .sort({ appointmentDate: -1 });

    if (!appointments.length) {
      return res.status(404).json({ success: false, message: 'No appointments found for this donor' });
    }

    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    const fileName = `appointment_report_${new Date().toISOString().split('T')[0]}.pdf`;
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

    doc.fontSize(18).text('Blood Donation Appointment Report', 0, 50, { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Generated: ${new Date().toDateString()}`, { align: 'right' });

    // Table headers
    const tableTop = 130;
    const rowHeight = 25;
    const colWidths = [25, 90, 80, 60, 45, 50, 65, 60];
    const startX = 40;

    const headers = ['No', 'Donor', 'Hospital', 'Date', 'Time', 'Progress', 'Active', 'Feedback'];

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

    appointments.forEach((item, index) => {
      x = startX;
      const donorName = `${item.donorId?.firstName || ''} ${item.donorId?.lastName || ''}`;
      const row = [
        index + 1,
        donorName,
        item.hospitalId?.name || 'N/A',
        item.appointmentDate || 'N/A',
        item.appointmentTime || 'N/A',
        item.progressStatus,
        item.activeStatus,
        item.feedbackStatus ? 'Yes' : 'No',
      ];

      // Row background alternating color
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
    console.error('Error generating appointment report:', error);
    res.status(500).json({ success: false, message: 'Error generating report' });
  }
};

export const generateSystemAdminReport = async (req, res) => {
  try {
    const managers = await Manager.find({})
      .select('firstName lastName email phoneNumber nic address dob role activeStatus')
      .sort({ createdAt: -1 });

    if (!managers.length) {
      return res.status(404).json({ success: false, message: 'No system managers found' });
    }

    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    const fileName = `system_admin_report_${new Date().toISOString().split('T')[0]}.pdf`;
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

    doc.fontSize(18).text('System Admin Report', 0, 50, { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Generated: ${new Date().toDateString()}`, { align: 'right' });

    // Table headers
    const tableTop = 130;
    const rowHeight = 25;
    const colWidths = [25, 80, 80, 60, 60, 70, 60, 40, 40];
    const startX = 40;

    const headers = ['No', 'Name', 'Email', 'Phone', 'NIC', 'Address', 'DOB', 'Role', 'Active'];

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

    managers.forEach((item, index) => {
      x = startX;
      const managerName = `${item.firstName} ${item.lastName}`;
      const row = [
        index + 1,
        managerName,
        item.email || 'N/A',
        item.phoneNumber || 'N/A',
        item.nic || 'N/A',
        item.address || 'N/A',
        item.dob ? item.dob.toDateString() : 'N/A',
        item.role || 'N/A',
        item.activeStatus ? 'Yes' : 'No',
      ];

      // Row background alternating color
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
    console.error('Error generating system admin report:', error);
    res.status(500).json({ success: false, message: 'Error generating report' });
  }
};

export const generateDonorReport = async (req, res) => {
  try {
    const donors = await Donor.find({})
      .select('firstName lastName email phoneNumber bloodType city dob activeStatus')
      .sort({ createdAt: -1 });

    if (!donors.length) {
      return res.status(404).json({ success: false, message: 'No donors found' });
    }

    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    const fileName = `donor_report_${new Date().toISOString().split('T')[0]}.pdf`;
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

    doc.fontSize(18).text('Donor Report', 0, 50, { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Generated: ${new Date().toDateString()}`, { align: 'right' });

    // Table headers
    const tableTop = 130;
    const rowHeight = 25;
    const colWidths = [25, 80, 80, 60, 50, 60, 60, 40];
    const startX = 40;

    const headers = ['No', 'Name', 'Email', 'Phone', 'Blood Type', 'City', 'DOB', 'Active'];

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

    donors.forEach((item, index) => {
      x = startX;
      const donorName = `${item.firstName} ${item.lastName}`;
      const row = [
        index + 1,
        donorName,
        item.email || 'N/A',
        item.phoneNumber || 'N/A',
        item.bloodType || 'N/A',
        item.city || 'N/A',
        item.dob ? item.dob.toDateString() : 'N/A',
        item.activeStatus ? 'Yes' : 'No',
      ];

      // Row background alternating color
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
    console.error('Error generating donor report:', error);
    res.status(500).json({ success: false, message: 'Error generating report' });
  }
};

export const generateHospitalReport = async (req, res) => {
  try {
    const hospitals = await Hospital.find({})
      .select('name email phoneNumber city address startTime endTime activeStatus')
      .sort({ createdAt: -1 });

    if (!hospitals.length) {
      return res.status(404).json({ success: false, message: 'No hospitals found' });
    }

    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    const fileName = `hospital_report_${new Date().toISOString().split('T')[0]}.pdf`;
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

    doc.fontSize(18).text('Hospital Report', 0, 50, { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Generated: ${new Date().toDateString()}`, { align: 'right' });

    // Table headers
    const tableTop = 130;
    const rowHeight = 25;
    const colWidths = [25, 80, 80, 60, 60, 70, 50, 50, 40];
    const startX = 40;

    const headers = ['No', 'Name', 'Email', 'Phone', 'City', 'Address', 'Start Time', 'End Time', 'Active'];

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

    hospitals.forEach((item, index) => {
      x = startX;
      const row = [
        index + 1,
        item.name || 'N/A',
        item.email || 'N/A',
        item.phoneNumber || 'N/A',
        item.city || 'N/A',
        item.address || 'N/A',
        item.startTime || 'N/A',
        item.endTime || 'N/A',
        item.activeStatus ? 'Yes' : 'No',
      ];

      // Row background alternating color
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
    console.error('Error generating hospital report:', error);
    res.status(500).json({ success: false, message: 'Error generating report' });
  }
};