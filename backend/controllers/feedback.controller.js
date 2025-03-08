import Feedback from "../models/feedback.model.js";

// ✅ Get all feedback
export const getFeedbacks = async(req, res) => {
    try {
        const feedbacks = await Feedback.find();
        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: "Error fetching feedback", error });
    }
};

// ✅ Get a single feedback by ID
export const getFeedbackById = async(req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id);
        if (!feedback) return res.status(404).json({ message: "Feedback not found" });
        res.json(feedback);
    } catch (error) {
        res.status(500).json({ message: "Error fetching feedback", error });
    }
};

// ✅ Create a new feedback
export const createFeedback = async(req, res) => {
    try {
        const { donorId, hospitalId, systemManagerId, comments, feedbackType } = req.body;

        const newFeedback = new Feedback({
            donorId,
            hospitalId,
            systemManagerId,
            comments,
            feedbackType,
        });

        await newFeedback.save();
        res.status(201).json(newFeedback);
    } catch (error) {
        res.status(400).json({ message: "Error creating feedback", error });
    }
};

// ✅ Update feedback details
export const updateFeedback = async(req, res) => {
    try {
        const updatedFeedback = await Feedback.findByIdAndUpdate(
            req.params.id,
            req.body, { new: true }
        );

        if (!updatedFeedback) return res.status(404).json({ message: "Feedback not found" });

        res.status(200).json(updatedFeedback);
    } catch (error) {
        res.status(500).json({ message: "Error updating feedback", error });
    }
};

// ✅ Delete a feedback
export const deleteFeedback = async(req, res) => {
    try {
        const deletedFeedback = await Feedback.findByIdAndDelete(req.params.id);
        if (!deletedFeedback) return res.status(404).json({ message: "Feedback not found" });

        res.json({ message: "Feedback deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting feedback", error });
    }
};
