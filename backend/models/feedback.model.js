import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
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
    systemAdminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SystemAdmin', // Reference to System Admin model
        required: true,
    },
    comments: {
        type: String,
        required: true,
    },
    feedbackType: {
        type: String,
        enum: ['Positive', 'Negative', 'Neutral'], // Define feedback types
        required: true,
    },
}, { timestamps: true });

const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback;    