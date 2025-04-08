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


healthEvaluationSchema.statics.cancelExpiredEvaluations = async function () {
    const currentDateTime = new Date();
    
    const evaluations = await this.find({
        $and: [
            // Date is less than or equal to current date
            { evaluationDate: { $lte: currentDateTime } },
            // Time has passed (only matters if date is today)
            { evaluationTime: { $lt: currentDateTime } }
        ]
    });

    for (const evaluation of evaluations) {
        // Only cancel if the evaluation date/time is actually in the past
        const evalDateTime = new Date(evaluation.evaluationDate);
        evalDateTime.setHours(
            evaluation.evaluationTime.getHours(),
            evaluation.evaluationTime.getMinutes(),
            evaluation.evaluationTime.getSeconds()
        );

        if (evalDateTime < currentDateTime) {
            evaluation.passStatus = 'Cancelled';
            evaluation.progressStatus = 'Cancelled';
            evaluation.activeStatus = 'Cancelled';
            await evaluation.save();
        }
    }
}

const HealthEvaluation = mongoose.model('HealthEvaluation', healthEvaluationSchema);

export default HealthEvaluation;