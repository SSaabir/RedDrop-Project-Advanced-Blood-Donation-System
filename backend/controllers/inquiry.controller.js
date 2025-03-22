// controllers/inquiryController.js
import Inquiry from '../models/inquiry.model.js';
import SystemManager from '../models/SystemManager.model.js';

// Controller to fetch all inquiries with system manager details populated
export const getAllInquiries = async (req, res) => {
    try {
        const inquiries = await Inquiry.find()
            .populate('systemManagerId', 'name email');  // Populate system manager's name and email
        res.json(inquiries);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching inquiries', error });
    }
};

// Controller to fetch a specific inquiry by ID
export const getInquiryById = async (req, res) => {
    try {
        const inquiry = await Inquiry.findById(req.params.id)
            .populate('systemManagerId', 'name email');
        if (!inquiry) {
            return res.status(404).json({ message: 'Inquiry not found' });
        }
        res.json(inquiry);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching inquiry', error });
    }
};

// Controller to create a new inquiry
export const createInquiry = async (req, res) => {
    const { systemManagerId, email, subject, message, category, attentiveStatus } = req.body;
    
    try {
        // Validate if the systemManagerId exists in the SystemManager collection
        const systemManager = await SystemManager.findById(systemManagerId);
        if (!systemManager) {
            return res.status(400).json({ message: 'System Manager not found' });
        }

        const newInquiry = new Inquiry({
            systemManagerId,
            email,
            subject,
            message,
            category,
            attentiveStatus,
        });

        await newInquiry.save();
        res.status(201).json({ message: 'Inquiry created successfully', inquiry: newInquiry });
    } catch (error) {
        res.status(500).json({ message: 'Error creating inquiry', error });
    }
};

// Controller to update an inquiry's status
export const updateInquiryStatus = async (req, res) => {
    const { status } = req.body;
    const validStatuses = ['Pending', 'In Progress', 'Resolved'];

    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    try {
        const inquiry = await Inquiry.findByIdAndUpdate(
            req.params.id,
            { attentiveStatus: status },
            { new: true }
        );
        
        if (!inquiry) {
            return res.status(404).json({ message: 'Inquiry not found' });
        }

        res.json({ message: 'Inquiry updated successfully', inquiry });
    } catch (error) {
        res.status(500).json({ message: 'Error updating inquiry', error });
    }
};

// Controller to delete an inquiry by ID
export const deleteInquiry = async (req, res) => {
    try {
        const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
        if (!inquiry) {
            return res.status(404).json({ message: 'Inquiry not found' });
        }
        res.json({ message: 'Inquiry deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting inquiry', error });
    }
};
