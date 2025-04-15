import mongoose from 'mongoose';
import Donor from './donor.model.js'; // Assuming you have a Donor model
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

            try {
                const donor = await Donor.findById(evaluation.donorId);
                if (donor) {
                    donor.healthStatus = false;
                    await donor.save();
                } else {
                    console.warn(`Donor with ID ${evaluation.donorId} not found for evaluation ${evaluation._id}`);
                }
            } catch (error) {
                console.error(`Failed to update healthStatus for donor ${evaluation.donorId}:`, error.message);
            }
        }
    }
}

healthEvaluationSchema.statics.updateHealthStatusAfter56Days = async function () {
    const currentDate = new Date();
    const fiftySixDaysAgo = new Date(currentDate);
    fiftySixDaysAgo.setDate(currentDate.getDate() - 56);

    // Get all donor IDs with evaluations
    const donorsWithEvaluations = await this.distinct('donorId');

    for (const donorId of donorsWithEvaluations) {
        try {
            // Find the most recent evaluation for the donor
            const latestEvaluation = await this.findOne({ donorId })
                .sort({ evaluationDate: -1, evaluationTime: -1 })
                .exec();

            // Skip if no evaluation exists
            if (!latestEvaluation) {
                continue;
            }

            // Combine evaluation date and time
            const evalDateTime = new Date(latestEvaluation.evaluationDate);
            const [hours, minutes, seconds] = latestEvaluation.evaluationTime.split(':');
            evalDateTime.setHours(hours, minutes, seconds || 0);

            // Check if the latest evaluation is older than 56 days
            if (evalDateTime < fiftySixDaysAgo) {
                // Update donor's healthStatus only if it's not already false
                await Donor.updateOne(
                    { _id: donorId, healthStatus: { $ne: false } },
                    { $set: { healthStatus: false } }
                );
            }
        } catch (error) {
            // Silent error handling
        }
    }
};

const HealthEvaluation = mongoose.model('HealthEvaluation', healthEvaluationSchema);

export default HealthEvaluation;