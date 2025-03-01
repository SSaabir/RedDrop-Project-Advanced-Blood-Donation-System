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
    appointmentDate: {
        type: Date, // Assuming you want to store the exact date and time
        required: true,
    },
    timeSlot: {
        type: String, // You can store the time slot as a string (e.g., "09:00 AM - 10:00 AM")
        required: true,
    },
    receiptNumber: {
        type: String, // Unique receipt number for the appointment
        required: true,
        unique: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Rescheduled', 'Cancelled'], // Only these values are allowed
        default: 'Pending', // Default to Pending if no status is provided
    },
}, { timestamps: true });

// Method for appointment status update (example implementation)
bloodDonationAppointmentSchema.methods.updateStatus = async function(newStatus) {
    const validStatuses = ['Pending', 'Confirmed', 'Rescheduled', 'Cancelled'];

    if (!validStatuses.includes(newStatus)) {
        throw new Error('Invalid Status');
    }

    this.status = newStatus;
    await this.save();
};

const BloodDonationAppointment = mongoose.model('BloodDonationAppointment', bloodDonationAppointmentSchema);

export default BloodDonationAppointment;