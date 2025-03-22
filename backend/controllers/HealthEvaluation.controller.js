import HealthEvaluation from "../models/HealthEvaluation.model.js";

// Get all health evaluations
export const getHealthEvaluations = async (req, res) => {
    try {
        const evaluations = await HealthEvaluation.find().populate("hospitalId donorId hospitalAdminId");
        res.json(evaluations);
    } catch (error) {
        res.status(500).json({ message: "Error fetching health evaluations", error });
    }
};

// Get a single health evaluation
export const getHealthEvaluationById = async (req, res) => {
    try {
        const evaluation = await HealthEvaluation.findById(req.params.id).populate("hospitalId donorId hospitalAdminId");
        if (!evaluation) return res.status(404).json({ message: "Health evaluation not found" });
        res.json(evaluation);
    } catch (error) {
        res.status(500).json({ message: "Error fetching health evaluation", error });
    }
};

// Create a new health evaluation
export const createEvaluation = async (req, res) => {
    try {
        const { hospitalId, donorId, evaluationDate, evaluationTime } = req.body;

        if (!hospitalId || !donorId || !evaluationDate || !evaluationTime) {
            return res.status(400).json({ error: "All fields are required." });
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
    } catch (err) {
        console.error("Error creating evaluation:", err);
        res.status(500).json({ success: false, error: err.message });
    }
};

// Update Date and Time of Evaluation
export const updateEvaluationDateTime = async (req, res) => {
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

        if (!updatedEvaluation) return res.status(404).json({ error: "Evaluation not found" });

        res.status(200).json(updatedEvaluation);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Cancel an Evaluation
export const cancelEvaluation = async (req, res) => {
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

        if (!canceledEvaluation) return res.status(404).json({ error: "Evaluation not found" });

        res.status(200).json(canceledEvaluation);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Accept an Evaluation
export const acceptEvaluation = async (req, res) => {
    try {
        const { hospitalAdminId } = req.body;
        const acceptEvaluation = await HealthEvaluation.findByIdAndUpdate(
            req.params.id,
            { activeStatus: "Accepted", 
              hospitalAdminId: hospitalAdminId },
            { new: true }
        );

        if (!acceptEvaluation) return res.status(404).json({ error: "Evaluation not found" });

        res.status(200).json(acceptEvaluation);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Arrived for an Evaluation
export const arrivedForEvaluation = async (req, res) => {
    try {
        const { receiptNumber } = req.body;
        const arrivedForEvaluation = await HealthEvaluation.findByIdAndUpdate(
            req.params.id,
            { receiptNumber: receiptNumber,
              progressStatus: "In Progress" },
            { new: true }
        );

        if (!arrivedForEvaluation) return res.status(404).json({ error: "Evaluation not found" });

        res.status(200).json(arrivedForEvaluation);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Complete an Evaluation
export const completeEvaluation = async (req, res) => {
    try {
        const { result } = req.body;
        const file = req.file ? req.file.path : null ; // Get uploaded file

        if (!result) {
            return res.status(400).json({ error: "Result is required" });
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
            return res.status(404).json({ error: "Evaluation not found" });
        }

        res.status(200).json(completedEvaluation);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Delete a health evaluation
export const deleteHealthEvaluation = async (req, res) => {
    try {
        const deletedEvaluation = await HealthEvaluation.findByIdAndDelete(req.params.id);
        if (!deletedEvaluation) return res.status(404).json({ message: "Health evaluation not found" });
        res.json({ message: "Health evaluation deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting health evaluation", error });
    }
};

export const getHealthEvaluationByDonorId = async (req, res) => {
    try {
        const {id} = req.params;
        const evaluation = await HealthEvaluation.find({donorId: id}).populate("hospitalId donorId hospitalAdminId");
        if (!evaluation) return res.status(404).json({ message: "Health evaluation not found" });
        res.json(evaluation);
    } catch (error) {
        res.status(500).json({ message: "Error fetching health evaluation", error });
    }
};

export const getHealthEvaluationByHospitalId = async (req, res) => {
    try {
        const {id} = req.params;
        const evaluation = await HealthEvaluation.find({hospitalId: id}).populate("hospitalId donorId hospitalAdminId");
        if (!evaluation) return res.status(404).json({ message: "Health evaluation not found" });
        res.json(evaluation);
    } catch (error) {
        res.status(500).json({ message: "Error fetching health evaluation", error });
    }
};