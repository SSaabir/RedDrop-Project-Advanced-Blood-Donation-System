import EmergencyBR from '../models/EmergencyBR.model.js';

// ✅ Get all emergency requests
export const getEmergencyRequests = async (req, res) => {
    try {
        const requests = await EmergencyBR.find();
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: "Error fetching emergency requests", error });
    }
};

// ✅ Get a single emergency request by ID
export const getEmergencyRequestById = async (req, res) => {
    try {
        const request = await EmergencyBR.findById(req.params.id);
        if (!request) return res.status(404).json({ message: "Emergency request not found" });
        res.json(request);
    } catch (error) {
        res.status(500).json({ message: "Error fetching emergency request", error });
    }
};

// ✅ Create a new emergency request
export const createEmergencyRequest = async (req, res) => {
    try {
        const { name, phoneNumber, ID, email, proofDocument, neededBlood, criticalLevel, expiry, responsibleId, responsibleModel } = req.body;

        const newRequest = new EmergencyBR({
            name,
            phoneNumber,
            ID,
            email,
            proofDocument,
            neededBlood,
            criticalLevel,
            expiry,
            responsibleId,
            responsibleModel,
        });

        await newRequest.save();
        res.status(201).json(newRequest);
    } catch (error) {
        res.status(400).json({ message: "Error creating emergency request", error });
    }
};

// ✅ Update an emergency request
export const updateEmergencyRequest = async (req, res) => {
    try {
        const updatedRequest = await EmergencyBR.findByIdAndUpdate(
            req.params.id,
            req.body, { new: true }
        );

        if (!updatedRequest) return res.status(404).json({ message: "Emergency request not found" });

        res.status(200).json(updatedRequest);
    } catch (error) {
        res.status(500).json({ message: "Error updating emergency request", error });
    }
};

// ✅ Delete an emergency request
export const deleteEmergencyRequest = async (req, res) => {
    try {
        const deletedRequest = await EmergencyBR.findByIdAndDelete(req.params.id);
        if (!deletedRequest) return res.status(404).json({ message: "Emergency request not found" });

        res.json({ message: "Emergency request deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting emergency request", error });
    }
};
