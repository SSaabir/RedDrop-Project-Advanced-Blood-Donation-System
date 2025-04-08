import mongoose from 'mongoose';

const bloodDonationAppointmentSchema = new mongoose.Schema({
    donorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Donor',
        required: true,
    },
    hospitalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
        required: true,
    },
    hospitalAdminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HospitalAdmin',
        required: false,
    },
    feedbackStatus: {
        type: Boolean,
        required: false,
        default: false
    },
    appointmentDate: {
        type: String, // Changed to Date for better handling
        required: true,
    },
    appointmentTime: {
        type: String,
        required: true,
    },
    receiptNumber: {
        type: String,
        required: false,
    },
    progressStatus: {
        type: String,
        enum: ['Not Started', 'In Progress', 'Completed', 'Cancelled'],
        default: 'Not Started',
    },
    activeStatus: {
        type: String,
        enum: ['Scheduled', 'Re-Scheduled', 'Accepted', 'Cancelled'],
        default: 'Scheduled',
    },
}, { timestamps: true });

bloodDonationAppointmentSchema.statics.cancelExpiredAppointments = async function () {
    const currentDateTime = new Date();
    
    const appointments = await this.find({
        $and: [
            // Date is less than or equal to current date
            { appointmentDate: { $lte: currentDateTime } },
            // Time has passed (only matters if date is today)
            { appointmentTime: { $lt: currentDateTime } }
        ]
    });

    for (const appointment of appointments) {
        // Combine date and time for accurate comparison
        const apptDateTime = new Date(appointment.appointmentDate);
        apptDateTime.setHours(
            appointment.appointmentTime.getHours(),
            appointment.appointmentTime.getMinutes(),
            appointment.appointmentTime.getSeconds()
        );

        if (apptDateTime < currentDateTime) {
            appointment.progressStatus = 'Cancelled';
            appointment.activeStatus = 'Cancelled';
            await appointment.save();
        }
    }
}


const BloodDonationAppointment = mongoose.model('BloodDonationAppointment', bloodDonationAppointmentSchema);


export default BloodDonationAppointment;