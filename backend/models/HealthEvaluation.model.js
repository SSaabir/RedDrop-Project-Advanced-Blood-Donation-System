import mongoose from 'mongoose';

const healthEvaluationSchema = new mongoose.Schema({
    receiptNumber: {
        type: String,
        required: false,
        unique: false,
    },
    passStatus: {
        type: String,
        enum: ['Pending', 'Passed', 'Failed', 'Cancelled'],
        default: 'Pending',
    },
    progressStatus: {
        type: String,
        enum: ['Not Started', 'In Progress', 'Completed', 'Cancelled'],
        default: 'Not Started',
    },
    feedbackStatus: {
        type: Boolean,
        required: false,
        default: false,
    },
    activeStatus: {
        type: String,
        enum: ['Scheduled', 'Re-Scheduled', 'Accepted', 'Cancelled'],
        default: 'Scheduled',
    },
    hospitalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
        required: true,
    },
    donorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Donor',
        required: true,
    },
    evaluationFile: {
        type: String,
        required: false,
    },
    hospitalAdminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HospitalAdmin',
        required: false,
    },
    evaluationDate: {
        type: Date, // Changed to Date for better handling
        required: true,
    },
    evaluationTime: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const HealthEvaluation = mongoose.model('HealthEvaluation', healthEvaluationSchema);

export default HealthEvaluation;