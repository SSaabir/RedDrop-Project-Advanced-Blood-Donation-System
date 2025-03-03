import SystemManager from "../models/SystemManager.model.js";

// ✅ Get all system managers
export const getSystemManagers = async (req, res) => {
    try {
        const managers = await SystemManager.find();
        res.json(managers);
    } catch (error) {
        res.status(500).json({ message: "Error fetching system managers", error });
    }
};

// ✅ Get a single system manager by ID
export const getSystemManagerById = async (req, res) => {
    try {
        const manager = await SystemManager.findById(req.params.id);
        if (!manager) return res.status(404).json({ message: "System Manager not found" });
        res.json(manager);
    } catch (error) {
        res.status(500).json({ message: "Error fetching system manager", error });
    }
};

// ✅ Create a new system manager
export const createSystemManager = async (req, res) => {
    try {
        const { firstName, lastName, phoneNumber, email, password, nic, address, image, dob, role, activeStatus } = req.body;

        const newManager = new SystemManager({
            firstName,
            lastName,
            phoneNumber,
            email,
            password,
            nic,
            address,
            image,
            dob,
            role,
            activeStatus
        });

        await newManager.save();
        res.status(201).json(newManager);
    } catch (error) {
        res.status(400).json({ message: "Error creating system manager", error });
    }
};

// ✅ Update system manager details
export const updateSystemManager = async (req, res) => {
    try {
        const updatedManager = await SystemManager.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedManager) return res.status(404).json({ message: "System Manager not found" });

        res.status(200).json(updatedManager);
    } catch (error) {
        res.status(500).json({ message: "Error updating system manager", error });
    }
};

// ✅ Delete a system manager
export const deleteSystemManager = async (req, res) => {
    try {
        const deletedManager = await SystemManager.findByIdAndDelete(req.params.id);
        if (!deletedManager) return res.status(404).json({ message: "System Manager not found" });

        res.json({ message: "System Manager deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting system manager", error });
    }
};
