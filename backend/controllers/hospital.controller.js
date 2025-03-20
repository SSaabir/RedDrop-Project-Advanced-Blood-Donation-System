import Hospital from "../models/hospital.model.js";

// ✅ Get all hospitals
export const getHospitals = async(req, res) => {
    try {
        const hospitals = await Hospital.find();
        res.json(hospitals);
    } catch (error) {
        res.status(500).json({ message: "Error fetching hospitals", error });
    }
};

// ✅ Get a single hospital by ID
export const getHospitalById = async(req, res) => {
    try {
        const hospital = await Hospital.findById(req.params.id);
        if (!hospital) return res.status(404).json({ message: "Hospital not found" });
        res.json(hospital);
    } catch (error) {
        res.status(500).json({ message: "Error fetching hospital", error });
    }
};

// ✅ Create a new hospital
export const createHospital = async(req, res) => {
    try {
        const { name, city, identificationNumber, email, password, phoneNumber, address, startTime, endTime } = req.body;

        if (!name || !city || !identificationNumber || !email || !password || !phoneNumber || !address || !startTime || !endTime) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const image = req.file ? req.file.path : null;

        const newHospital = new Hospital({
            name,
            city,
            identificationNumber,
            email,
            password, // No password hashing
            phoneNumber,
            address,
            image,
            startTime,
            endTime,
        });

        await newHospital.save();
        res.status(201).json(newHospital);
    } catch (error) {
        res.status(400).json({ message: "Error creating hospital", error: error.message });
    }
};

// ✅ Update hospital details
export const updateHospital = async(req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        if (req.file) {
            updatedData.image = req.file.path; // Update image path if a new file is uploaded
        }

        const updatedHospital = await Hospital.findByIdAndUpdate(id, updatedData, {
            new: true,
            runValidators: true,
        });

        if (!updatedHospital) return res.status(404).json({ message: "Hospital not found" });

        res.status(200).json(updatedHospital);
    } catch (error) {
        res.status(500).json({ message: "Error updating hospital", error: error.message });
    }
};

// ✅ Delete a hospital
export const deleteHospital = async(req, res) => {
    try {
        const { id } = req.params;
        const deletedHospital = await Hospital.findByIdAndDelete(id);

        if (!deletedHospital) return res.status(404).json({ message: "Hospital not found" });

        res.status(200).json({ message: "Hospital deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting hospital", error: error.message });
    }
};

// ✅ Activate/Deactivate hospital status
export const activateDeactivateHospital = async(req, res) => {
    try {
        const { id } = req.params;

        const hospital = await Hospital.findById(id);
        if (!hospital) {
            return res.status(404).json({ message: "Hospital not found" });
        }

        const newStatus = !hospital.activeStatus;
        const updatedHospital = await Hospital.findByIdAndUpdate(
            id, { $set: { activeStatus: newStatus } }, { new: true }
        );

        res.status(200).json({
            message: `Hospital ${newStatus ? 'activated' : 'deactivated'} successfully`,
            hospital: updatedHospital,
        });
    } catch (error) {
        console.error('Activate/Deactivate error:', error);
        res.status(500).json({
            message: "Error toggling hospital status",
            error: error.message,
        });
    }
};

// ✅ Update hospital health status (if applicable)
export const updateHealthStatus = async(req, res) => {
    try {
        let { healthStatus } = req.body;
        healthStatus = healthStatus === "true" || healthStatus === true; // Ensure Boolean value

        const updatedHospital = await Hospital.findByIdAndUpdate(
            req.params.id, { healthStatus }, { new: true }
        );

        if (!updatedHospital) return res.status(404).json({ message: "Hospital not found" });

        res.status(200).json(updatedHospital);
    } catch (error) {
        res.status(500).json({ message: "Error updating health status", error: error.message });
    }
};