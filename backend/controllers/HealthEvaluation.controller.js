import HealthEvaluation from "../models/HealthEvaluation.model.js";
import { errorHandler } from "../utils/error.js";
// Get all health evaluations
export const getHealthEvaluations = async (req, res, next) => {
    try {
        const evaluations = await HealthEvaluation.find().populate("hospitalId donorId hospitalAdminId");
        res.json(evaluations);
    } catch (error) {
        next(errorHandler(500, "Error fetching health evaluations"));
    }
};

// Get a single health evaluation
export const getHealthEvaluationById = async (req, res, next) => {
    try {
        const evaluation = await HealthEvaluation.findById(req.params.id).populate("hospitalId donorId hospitalAdminId");
        if (!evaluation) return next(errorHandler(404, "Health evaluation not found"));
        res.json(evaluation);
    } catch (error) {
        next(errorHandler(500, "Error fetching health evaluation"));
    }
};

// Create a new health evaluation
export const createEvaluation = async (req, res, next) => {
    try {
        const { hospitalId, donorId, evaluationDate, evaluationTime } = req.body;

        if (!hospitalId || !donorId || !evaluationDate || !evaluationTime) {
            next(errorHandler(400, "All fields are required"));
        }

        const newEvaluation = new HealthEvaluation({
            progressStatus: 'Not Started',
            hospitalId: hospitalId,
            donorId: donorId,
            evaluationDate: evaluationDate,
            evaluationTime: evaluationTime,
        });

        await newEvaluation.save();

        res.status(201).json({ success: true, data: newEvaluation });
    } catch (error) {
       next(errorHandler(400, "Error creating health evaluation"));
}
};

// Update Date and Time of Evaluation
export const updateEvaluationDateTime = async (req, res, next) => {
    try {
        const { evaluationDate, evaluationTime, hospitalAdminId } = req.body;
        const updatedEvaluation = await HealthEvaluation.findByIdAndUpdate(
            req.params.id,
            { 
                evaluationDate: evaluationDate, 
                evaluationTime: evaluationTime, 
                activeStatus: "Re-Scheduled", 
                hospitalAdminId: hospitalAdminId
            },
            { new: true }
        );

        if (!updatedEvaluation) return next(errorHandler(404, "Evaluation not found"));
        res.status(200).json(updatedEvaluation);
    } catch (error) {
        next(errorHandler(500, "Error updating evaluation date and time"));
    }
};

// Cancel an Evaluation
export const cancelEvaluation = async (req, res, next) => {
    try {
        const { hospitalAdminId } = req.body;
        const canceledEvaluation = await HealthEvaluation.findByIdAndUpdate(
            req.params.id,
            {
                passStatus: "Cancelled",
                activeStatus: "Cancelled",
                progressStatus: "Cancelled",
                hospitalAdminId: hospitalAdminId
            },
            { new: true }
        );

        if (!canceledEvaluation) return next(errorHandler(404, "Evaluation not found"));
        res.status(200).json(canceledEvaluation);
    } catch (error) {
        next(errorHandler(500, "Error cancelling evaluation"));
    }
};

// Accept an Evaluation
export const acceptEvaluation = async (req, res, next) => {
    try {
        const { hospitalAdminId } = req.body;
        const acceptEvaluation = await HealthEvaluation.findByIdAndUpdate(
            req.params.id,
            { activeStatus: "Accepted", 
              hospitalAdminId: hospitalAdminId },
            { new: true }
        );

        if (!acceptEvaluation) return next(errorHandler(404, "Evaluation not found"));

        res.status(200).json(acceptEvaluation);
    } catch (error) {
        next(errorHandler(500, "Error accepting evaluation"));
    }
};

// Arrived for an Evaluation
export const arrivedForEvaluation = async (req, res, next) => {
    try {
        const { receiptNumber } = req.body;
        const arrivedForEvaluation = await HealthEvaluation.findByIdAndUpdate(
            req.params.id,
            { receiptNumber: receiptNumber,
              progressStatus: "In Progress" },
            { new: true }
        );

        if (!arrivedForEvaluation) return next(errorHandler(404, "Evaluation not found"));

        res.status(200).json(arrivedForEvaluation);
    } catch (error) {
        next(errorHandler(500, "Error marking evaluation as arrived"));
    }
};

// Complete an Evaluation
export const completeEvaluation = async (req, res, next) => {
    try {
        const { result } = req.body;
        const file = req.file ? req.file.path : null ; // Get uploaded file
        console.log(file, result);
        if (!result) {
            return next(errorHandler(400, "Result is required"));
        }

        // Find evaluation and update status
        const completedEvaluation = await HealthEvaluation.findByIdAndUpdate(
            req.params.id,
            { 
                passStatus: result, 
                progressStatus: "Completed",
                evaluationFile: file // Store file as buffer (or file path if saving to disk)
            },
            { new: true }
        );

        if (!completedEvaluation) {
            return next(errorHandler(404, "Evaluation not found"));
        }

        res.status(200).json(completedEvaluation);
    } catch (error) {
        next(errorHandler(500, "Error completing evaluation"));
    }
};


// Delete a health evaluation
export const deleteHealthEvaluation = async (req, res, next) => {
    try {
        const deletedEvaluation = await HealthEvaluation.findByIdAndDelete(req.params.id);
        if (!deletedEvaluation) return next(errorHandler(404, "Health evaluation not found"));
        res.json({ message: 'Health Evaluation deleted successfully' });
    } catch (error) {
        next(errorHandler(500, "Error deleting health evaluation"));}
};

export const getHealthEvaluationByDonorId = async (req, res, next) => {
    try {
        const {id} = req.params;
        const evaluation = await HealthEvaluation.find({donorId: id}).populate("hospitalId donorId hospitalAdminId");
        if (!evaluation) return next(errorHandler(404, "Health evaluation not found"));
        res.json(evaluation);
    } catch (error) {
        next(errorHandler(500, "Error fetching health evaluation"));
    }   
};

export const getHealthEvaluationByHospitalId = async (req, res, next) => {
    try {
        const {id} = req.params;
        const evaluation = await HealthEvaluation.find({hospitalId: id}).populate("hospitalId donorId hospitalAdminId");
        if (!evaluation) return next(errorHandler(404, "Health evaluation not found"));
                res.json(evaluation);
    } catch (error) {
        next(errorHandler(500, "Error fetching health evaluation"));
    }
};