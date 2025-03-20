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
    appointmentDate: {
        type: Date, // Assuming you want to store the exact date and time
        required: true,
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
        required: true,
        unique: true,
    },
    passStatus: {
        type: String,
        enum: ['Pending', 'Passed', 'Failed', 'Cancelled'],
        default: 'Pending',
    },
    acceptStatus: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Rescheduled', 'Cancelled'], // Only these values are allowed
        default: 'Pending', // Default to Pending if no status is provided
    },
}, { timestamps: true });




const BloodDonationAppointment = mongoose.model('BloodDonationAppointment', bloodDonationAppointmentSchema);

export default BloodDonationAppointment;