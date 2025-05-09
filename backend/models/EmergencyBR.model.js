import mongoose from 'mongoose';
import cron from 'node-cron';
import BloodInventory from './BloodInventory.model.js';
import Donor from './donor.model.js';
import sendNotification from '../utils/notification.js';

const emergencyBRSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phoneNumber: {
        type: String,
        required: true,
        validate: {
            validator: (value) => /^\d{10}$/.test(value),
            message: (props) => `${props.value} is not a valid phone number!`,
        },
    },
    proofOfIdentificationNumber: { type: String, required: true },
    proofDocument: { type: String, required: false, default: null },
    patientBlood: {
        type: String,
        required: true,
        enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
    },
    units: { type: Number, required: true, min: 1 },
    criticalLevel: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        required: true,
    },
    withinDate: { type: String, required: true }, // Removed default
    activeStatus: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Inactive",
    },
    hospitalName: { type: String, required: true },
    address: { type: String, required: true },
    acceptStatus: {
        type: String,
        enum: ["Pending", "Accepted", "Declined"],
        default: "Pending",
    },
    declineReason: { type: String, required: false, default: null },
    acceptedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        refPath: 'acceptedByType',
        default: null,
    },
    acceptedByType: {
        type: String,
        required: false,
        enum: ['Hospital', 'Donor'],
        default: null,
    },
}, { timestamps: true });
emergencyBRSchema.statics.handleEmergencyBloodRequest = async function(ebr) {
    try {
      // Skip if EBR is not pending or inactive
      if (ebr.acceptStatus !== 'Pending' || ebr.activeStatus === 'Inactive') {
        console.log(`Skipping EBR ${ebr._id}: Not pending or inactive`);
        return;
      }
  
      // Check if withinDate is in the future
      const currentDate = new Date().toISOString().split('T')[0];
      if (ebr.withinDate < currentDate) {
        console.log(`Skipping EBR ${ebr._id}: withinDate ${ebr.withinDate} is past`);
        return;
      }
  
      // 1. Check hospital blood inventory
      const currentDateTime = new Date();
      const bloodInventories = await BloodInventory.find({
        bloodType: ebr.patientBlood,
        availableStocks: { $gte: ebr.units },
        expiredStatus: false,
        expirationDate: { $gt: currentDateTime }
      }).populate('hospitalId', 'name email activeStatus');
  
      const hospitals = bloodInventories
        .filter(inventory => inventory.hospitalId && inventory.hospitalId.activeStatus)
        .map(inventory => ({
          ...inventory.hospitalId._doc,
          availableStocks: inventory.availableStocks,
          inventoryId: inventory._id
        }));
  
      // Send emails to hospitals with sufficient stock
      for (const hospital of hospitals) {
        const message = `
  An emergency blood request has been created:
  - Blood Type: ${ebr.patientBlood}
  - Units Needed: ${ebr.units}
  - Critical Level: ${ebr.criticalLevel}
  - Needed By: ${ebr.withinDate}
  - Requesting Hospital: ${ebr.hospitalName} (${ebr.address})
  
  Your hospital has ${hospital.availableStocks} units of ${ebr.patientBlood} available.
  Please confirm availability by contacting ${ebr.hospitalName} or replying to this email.
  
  Thank you,
  Red Drop Team
        `;
        await sendNotification({
          userId: hospital._id,
          userType: 'Hospital',
          subject: `Emergency Blood Request: ${ebr.patientBlood} Needed`,
          message: message.trim(),
          channels: ['email']
        });
      }
  
      // 2. Find eligible donors
      const donors = await Donor.find({
        bloodType: ebr.patientBlood,
        healthStatus: false,
        appointmentStatus: false,
        activeStatus: true
      }).select('firstName lastName email _id');
  
      // Send emails to eligible donors
      for (const donor of donors) {
        const message = `
  An emergency blood request has been created:
  - Blood Type: ${ebr.patientBlood}
  - Units Needed: ${ebr.units}
  - Critical Level: ${ebr.criticalLevel}
  - Needed By: ${ebr.withinDate}
  - Hospital: ${ebr.hospitalName} (${ebr.address})
  
  Your blood type matches this request. Please schedule a donation appointment at your earliest convenience.
  Visit our portal: http://localhost:3000/dashboard
  
  Thank you for your support,
  Red Drop Team
        `;
        await sendNotification({
          userId: donor._id,
          userType: 'Donor',
          subject: `Urgent: ${ebr.patientBlood} Blood Donation Needed`,
          message: message.trim(),
          channels: ['email']
        });
      }
  
      console.log(`Processed EBR ${ebr._id}: Notified ${hospitals.length} hospitals and ${donors.length} donors`);
    } catch (error) {
      console.error(`Error handling EBR ${ebr._id}:`, error);
    }
  };
  
  // Middleware to trigger automation on EBR creation
  emergencyBRSchema.post('save', async function(doc) {
    if (this.isNew) {
      await this.constructor.handleEmergencyBloodRequest(doc);
    }
  });
  
  // Cron job to check pending EBRs every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    try {
      const currentDate = new Date().toISOString().split('T')[0];
      const pendingEBRs = await mongoose.model('EmergencyBR').find({
        acceptStatus: 'Pending',
        activeStatus: 'Active',
        withinDate: { $gte: currentDate }
      });
      for (const ebr of pendingEBRs) {
        await mongoose.model('EmergencyBR').handleEmergencyBloodRequest(ebr);
      }
      console.log(`Cron job processed ${pendingEBRs.length} pending EBRs`);
    } catch (error) {
      console.error('Cron job error:', error);
    }
  });
  
  // Existing cancelExpiredRequests
  emergencyBRSchema.statics.cancelExpiredRequests = async function () {
    const currentDateTime = new Date();

    // Find the requests where the withinDate has passed
    const requests = await this.find({
        withinDate: { $lt: currentDateTime.toISOString().split('T')[0] }
    });

    for (const request of requests) {
        // Convert withinDate to ISO Date if it is a string
        let requestDate = new Date(request.withinDate);

        // If withinDate is stored as a string, convert it into ISO Date format
        if (typeof request.withinDate === 'string') {
            requestDate = new Date(request.withinDate);
        }

        // Compare with the current date
        if (requestDate < currentDateTime) {
            // Update request status to 'Declined' and 'Inactive' if expired
            request.acceptStatus = 'Declined';
            request.activeStatus = 'Inactive';
            
            // Save the updated request
            await request.save();
        }
    }
};

const EmergencyBR = mongoose.model('EmergencyBR', emergencyBRSchema);

export default EmergencyBR;