import Inquiry from "../models/inquiry.model.js";

// ✅ Get all inquiries
export const getInquiries = async (req, res) => {
    try {
        const inquiries = await Inquiry.find().populate('systemAdminId donorId');
        res.json(inquiries);
    } catch (error) {
        res.status(500).json({ message: "Error fetching inquiries", error });
    }
};

// ✅ Get a single inquiry by ID
export const getInquiryById = async (req, res) => {
    try {
        const inquiry = await Inquiry.findById(req.params.id).populate('systemAdminId donorId');
        if (!inquiry) return res.status(404).json({ message: "Inquiry not found" });
        res.json(inquiry);
    } catch (error) {
        res.status(500).json({ message: "Error fetching inquiry", error });
    }
};

// ✅ Create a new inquiry
export const createInquiry = async (req, res) => {
    try {
        const { systemAdminId, donorId, enroll, subject, description, category } = req.body;

        const newInquiry = new Inquiry({
            systemAdminId,
            donorId,
            enroll,
            subject,
            description,
            category,
        });

        await newInquiry.save();
        res.status(201).json(newInquiry);
    } catch (error) {
        res.status(400).json({ message: "Error creating inquiry", error });
    }
};

// ✅ Update inquiry details
export const updateInquiry = async (req, res) => {
    try {
        const updatedInquiry = await Inquiry.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedInquiry) return res.status(404).json({ message: "Inquiry not found" });

        res.status(200).json(updatedInquiry);
    } catch (error) {
        res.status(500).json({ message: "Error updating inquiry", error });
    }
};

// ✅ Delete an inquiry
export const deleteInquiry = async (req, res) => {
    try {
        const deletedInquiry = await Inquiry.findByIdAndDelete(req.params.id);
        if (!deletedInquiry) return res.status(404).json({ message: "Inquiry not found" });

        res.json({ message: "Inquiry deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting inquiry", error });
    }
};