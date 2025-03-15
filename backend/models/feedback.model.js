import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
    feedbackId: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true, // Automatically generated unique ID
    },
    donorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Donor', // Reference to Donor model
        required: true,
    },
    systemManagerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SystemManager', // Reference to System Manager model
        required: true,
    },
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'sessionModel', // Dynamic reference
        required: true,
    },
    sessionModel: {
        type: String,
        enum: ['Evaluation', 'Appointment'], // Determines the model being referenced
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
        enum: ['Positive', 'Negative', 'Neutral'], // Define feedback types
        required: true,
    },
    starRating: {
        type: Number,
        min: 1,
        max: 5,
        required: false, // Optional field
    },
}, { timestamps: true });

const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback;
