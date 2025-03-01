import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema({
    systemAdminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SystemAdmin',
        required: true,
    },
    donorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Donor',
        required: true,
    },
    enroll: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    dateSubmitted: {
        type: Date,
        default: Date.now,
    },
    category: {
        type: String,
        required: true,
        enum: ['General', 'Technical', 'Complaint', 'Other'], // Example categories
    },
}, { timestamps: true });

const Inquiry = mongoose.model('Inquiry', inquirySchema);

export default Inquiry;