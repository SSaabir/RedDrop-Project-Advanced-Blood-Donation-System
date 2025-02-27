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

export const createEvaluation = async (req, res) => {
    try {
      const { receiptNumber, passStatus, progressStatus, hospitalId, donorId, hospitalAdminId, evaluationDate, evaluationTime } = req.body;
  
      const newEvaluation = new HealthEvaluation({
        receiptNumber,
        passStatus,
        progressStatus,
        hospitalId,
        donorId,
        hospitalAdminId,
        evaluationDate,
        evaluationTime,
      });
  
      await newEvaluation.save();
      res.status(201).json(newEvaluation);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  
// Create a new health evaluation
export const updateEvaluationDateTime = async (req, res) => {
    try {
      const { evaluationDate, evaluationTime } = req.body;
      const updatedEvaluation = await HealthEvaluation.findByIdAndUpdate(
        req.params.id,
        { evaluationDate, evaluationTime },
        { new: true }
      );
  
      if (!updatedEvaluation) return res.status(404).json({ error: "Evaluation not found" });
  
      res.status(200).json(updatedEvaluation);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  // ✅ Cancel an Evaluation
  export const cancelEvaluation = async (req, res) => {
    try {
      const canceledEvaluation = await HealthEvaluation.findByIdAndUpdate(
        req.params.id,
        { progressStatus: "Cancelled" },
        { new: true }
      );
  
      if (!canceledEvaluation) return res.status(404).json({ error: "Evaluation not found" });
  
      res.status(200).json(canceledEvaluation);
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
