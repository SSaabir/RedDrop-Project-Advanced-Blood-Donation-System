import mongoose from 'mongoose';

const bloodDonationAppointmentSchema = new mongoose.Schema({
    donorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Donor', // Reference to Donor model
        required: true,
    },
    hospitalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital', // Reference to Hospital model
        required: true,
    },
     hospitalAdminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HospitalAdmin',
        required: false,
     },
     feedbackStatus: {
        type: Boolean, // URL or file path for the image
        required: false,
        default: false
    },
    appointmentDate: {
        type: String, // Assuming you want to store the exact date and time
        required: true,
        default: function () {
            return new Date().toISOString().split('T')[0]; // Extracts YYYY-MM-DD
        },
    },
    appointmentTime: {
        type: String, // Storing as a string in AM/PM format
        required: true,
        default: function () {
            const now = new Date();
            let hours = now.getHours();
            const minutes = now.getMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12; // Convert 24-hour to 12-hour format

            return `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
        },
    },
    receiptNumber: {
        type: String, // Unique receipt number for the appointment
        required: false,
        unique: false,
    },
    progressStatus: {
        type: String,
        enum: ['Not Started', 'In Progress', 'Completed', 'Cancelled'],
        default: 'Not Started',
    },
    activeStatus: {
        type: String,
        enum: ['Scheduled', 'Re-Scheduled', 'Accepted', 'Cancelled'], // Only these values are allowed
        default: 'Scheduled', // Default to Pending if no status is provided
    },
}, { timestamps: true });




const BloodDonationAppointment = mongoose.model('BloodDonationAppointment', bloodDonationAppointmentSchema);

export default BloodDonationAppointment;