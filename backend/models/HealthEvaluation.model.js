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
    const currentDateTime = new Date(); // Get the current date and time

    const evaluations = await this.find({
        $and: [
            { evaluationDate: { $lte: currentDateTime } }, // Evaluation date is on or before the current date
            { evaluationTime: { $exists: true } } // Ensure evaluation time exists
        ]
    });

    for (const evaluation of evaluations) {
        // Combine the evaluationDate and evaluationTime into a full Date object
        const evalDateTime = new Date(evaluation.evaluationDate); // Start with the date
        const [hours, minutes, seconds] = evaluation.evaluationTime.split(':'); // Split the time into hours, minutes, and seconds
        evalDateTime.setHours(hours, minutes, seconds || 0); // Set the time on the Date object

        // Check if the evaluation's date/time is in the past
        if (evalDateTime < currentDateTime) {
            // If the evaluation date/time is in the past, cancel it
            evaluation.passStatus = 'Cancelled';
            evaluation.progressStatus = 'Cancelled';
            evaluation.activeStatus = 'Cancelled';
            await evaluation.save();

            try {
                // Update the donor's health status if necessary
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
        // If the evaluation date/time is after the current date/time, do nothing
        else if (evalDateTime > currentDateTime) {
            // Future evaluations are untouched, as they are still active
            continue;
        }
        // If the evaluation date/time is exactly the same as the current date/time, you can decide what to do
        else {
            // For evaluations exactly at the current date/time, you can either:
            // - Cancel immediately (same as past)
            // - Or leave it as is (this behavior is optional and depends on your requirements)
            // Here's an example of cancelling it (optional behavior)
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
    fiftySixDaysAgo.setDate(currentDate.getDate() - 56); // Calculate the date 56 days ago

    // Get all donor IDs with evaluations
    const donorsWithEvaluations = await this.distinct('donorId');

    for (const donorId of donorsWithEvaluations) {
        try {
            // Find the most recent evaluation for the donor
            const latestEvaluation = await this.findOne({ donorId })
                .sort({ evaluationDate: -1, evaluationTime: -1 }) // Sort by latest evaluation
                .exec();

            // Skip if no evaluation exists for the donor
            if (!latestEvaluation) {
                continue;
            }

            // Combine evaluation date and time into one Date object
            const evalDateTime = new Date(latestEvaluation.evaluationDate);
            const [hours, minutes, seconds] = latestEvaluation.evaluationTime.split(':');
            evalDateTime.setHours(hours, minutes, seconds || 0); // Set the exact time on the Date object

            // Check if the latest evaluation is older than 56 days
            if (evalDateTime < fiftySixDaysAgo) {
                // Update the healthStatus to false if it hasn't already been set
                await Donor.updateOne(
                    { _id: donorId, healthStatus: { $ne: false } },
                    { $set: { healthStatus: false } }
                );
            }
        } catch (error) {
            // Silent error handling in case of any issues with the donor or evaluation
        }
    }
};


const HealthEvaluation = mongoose.model('HealthEvaluation', healthEvaluationSchema);

export default HealthEvaluation;