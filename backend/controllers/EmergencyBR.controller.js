import EmergencyBR from '../models/EmergencyBR.model.js';

// ✅ Get all emergency requests
export const getEmergencyRequests = async (req, res) => {
    try {
        const requests = await EmergencyBR.find();
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving emergency requests", error });
    }
};

// ✅ Get a single emergency request by emergencyBRId
export const getEmergencyRequestById = async (req, res) => {
    try {
        const request = await EmergencyBR.findOne({ emergencyBRId: req.params.emergencyBRId });
        if (!request) return res.status(404).json({ message: "Emergency request not found" });

        res.status(200).json(request);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving emergency request", error });
    }
};

// ✅ Create a new emergency request
export const createEmergencyRequest = async (req, res) => {
    try {
        const {
            emergencyBRId,
            responsibleId,
            responsibleModel,
            name,
            phoneNumber,
            proofOfIdentificationNumber,
            patientBlood,
            criticalLevel,
            withinDate,
            activeStatus,
        } = req.body;

        const proofDocument = req.file ? req.file.path : null; // Get the file path

        const newRequest = new EmergencyBR({
            emergencyBRId,
            responsibleId,
            responsibleModel,
            name,
            phoneNumber,
            proofOfIdentificationNumber,
            proofDocument,
            patientBlood,
            criticalLevel,
            withinDate,
            activeStatus,
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
        const {
            emergencyBRId,
            responsibleId,
            responsibleModel,
            name,
            phoneNumber,
            proofOfIdentificationNumber,
            patientBlood,
            criticalLevel,
            withinDate,
            activeStatus,
        } = req.body;

        const proofDocument = req.file ? req.file.path : null; // Get the file path

        const updatedRequest = await EmergencyBR.findOneAndUpdate(
            { emergencyBRId: req.params.emergencyBRId }, // Match by emergencyBRId
            {
                emergencyBRId,
                responsibleId,
                responsibleModel,
                name,
                phoneNumber,
                proofOfIdentificationNumber,
                proofDocument,
                patientBlood,
                criticalLevel,
                withinDate,
                activeStatus,
            },
            { new: true } // Return the updated document
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
        const deletedRequest = await EmergencyBR.findOneAndDelete({ emergencyBRId: req.params.emergencyBRId });
        if (!deletedRequest) return res.status(404).json({ message: "Emergency request not found" });

        res.json({ message: "Emergency request deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting emergency request", error });
    }
};
