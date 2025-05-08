import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
    donorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Donor',
        required: true,
    },
    systemManagerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SystemManager', // Ensure this matches your SystemManager model name
        required: false,
    },
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'sessionModel',
        required: true,
    },
    sessionModel: {
        type: String,
        enum: ['BloodDonationAppointment', 'HealthEvaluation'],
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    comments: {
        type: String,
        required: true,
    },
    feedbackType: {
        type: String,
        enum: ['General', 'Technical', 'Complaint'],
        required: true,
    },
    starRating: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
    },
}, { timestamps: true });

const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback;