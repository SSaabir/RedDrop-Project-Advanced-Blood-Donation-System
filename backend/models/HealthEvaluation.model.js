import mongoose from 'mongoose';

const healthEvaluationSchema = new mongoose.Schema(
    {
        receiptNumber: {
            type: String,
            required: true,
            unique: true,
        },
        passStatus: {
            type: String,
            enum: ['Pending', 'Passed', 'Failed'],
            default: 'Pending',
        },
        progressStatus: {
            type: String,
            enum: ['Not Started', 'In Progress', 'Completed'],
            default: 'Not Started',
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
            type: String, // URL or file path for the evaluation file
            required: false,
        },
        hospitalAdminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'HospitalAdmin',
            required: true,
        },
        evaluationDate: {
            type: String, // Storing as a string for better readability
            required: true,
            default: function () {
                return new Date().toISOString().split('T')[0]; // Extracts YYYY-MM-DD
            },
        },
        evaluationTime: {
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
    },
    { timestamps: true }
);

const HealthEvaluation = mongoose.model('HealthEvaluation', healthEvaluationSchema);

export default HealthEvaluation;
