import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema({
    inquiryId: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true, // Automatically generated unique ID
    },
    systemManagerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SystemManager', // Reference to System Manager model
        required: true,
    },
    email: {
        type: String,
        required: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'], // Email validation
    },
    subject: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: ['General', 'Technical', 'Complaint', 'Other'], // Example categories
    },
    attentiveStatus: {
        type: String,
        enum: ['Pending', 'In Progress', 'Resolved'], // Example statuses
        default: 'Pending',
    },
}, { timestamps: true });

const Inquiry = mongoose.model('Inquiry', inquirySchema);

export default Inquiry;
