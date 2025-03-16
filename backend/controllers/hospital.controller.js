import Hospital from "../models/hospital.model.js";
import bcrypt from 'bcryptjs'; // Ensure bcrypt is imported if it's used for password comparison

// ✅ Get all hospitals
export const getHospitals = async(req, res) => {
    try {
        const hospitals = await Hospital.find();
        res.json(hospitals);
    } catch (error) {
        console.error(error); // Logging the error for debugging
        res.status(500).json({ message: "Error fetching hospitals", error: error.message });
    }
};

// ✅ Get a single hospital by ID
export const getHospitalById = async(req, res) => {
    try {
        const hospital = await Hospital.findById(req.params.id);
        if (!hospital) return res.status(404).json({ message: "Hospital not found" });
        res.json(hospital);
    } catch (error) {
        console.error(error); // Logging the error for debugging
        res.status(500).json({ message: "Error fetching hospital", error: error.message });
    }
};

// ✅ Create a new hospital
export const createHospital = async(req, res) => {
    try {
        const { systemManagerId, name, city, identificationNumber, email, password, phoneNumber, address, image, startTime, endTime } = req.body;

        // ✅ Check for required fields
        if (!systemManagerId || !name || !city || !identificationNumber || !email || !password || !phoneNumber || !address || !startTime || !endTime) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // ✅ Check for duplicate hospital based on identificationNumber or phoneNumber
        const existingHospital = await Hospital.findOne({ $or: [{ identificationNumber }, { phoneNumber }] });
        if (existingHospital) {
            return res.status(400).json({ message: "Hospital with this identification number or phone number already exists" });
        }

        const newHospital = new Hospital({
            systemManagerId,
            name,
            city,
            identificationNumber,
            email,
            password,
            phoneNumber,
            address,
            image,
            startTime,
            endTime,
        });

        await newHospital.save();
        res.status(201).json({ message: "Hospital created successfully", hospital: newHospital });
    } catch (error) {
        console.error(error); // Logging the error for debugging
        res.status(400).json({ message: "Error creating hospital", error: error.message });
    }
};

// ✅ Update hospital details
export const updateHospital = async(req, res) => {
    try {
        const updatedHospital = await Hospital.findByIdAndUpdate(
            req.params.id,
            req.body, { new: true, runValidators: true }
        );

        if (!updatedHospital) return res.status(404).json({ message: "Hospital not found" });

        res.status(200).json({ message: "Hospital updated successfully", hospital: updatedHospital });
    } catch (error) {
        console.error(error); // Logging the error for debugging
        res.status(500).json({ message: "Error updating hospital", error: error.message });
    }
};

// ✅ Delete a hospital
export const deleteHospital = async(req, res) => {
    try {
        const deletedHospital = await Hospital.findByIdAndDelete(req.params.id);
        if (!deletedHospital) return res.status(404).json({ message: "Hospital not found" });

        res.status(200).json({ message: "Hospital deleted successfully" });
    } catch (error) {
        console.error(error); // Logging the error for debugging
        res.status(500).json({ message: "Error deleting hospital", error: error.message });
    }
};

// ✅ Update hospital operating hours
export const updateOperatingHours = async(req, res) => {
    try {
        const { startTime, endTime } = req.body;
        const updatedHospital = await Hospital.findByIdAndUpdate(
            req.params.id, { startTime, endTime }, { new: true }
        );
        if (!updatedHospital) return res.status(404).json({ message: "Hospital not found" });
        res.status(200).json({ message: "Hospital operating hours updated successfully", hospital: updatedHospital });
    } catch (error) {
        console.error(error); // Logging the error for debugging
        res.status(500).json({ message: "Error updating operating hours", error: error.message });
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
        console.error(error); // Logging the error for debugging
        res.status(500).json({
            message: "Error toggling hospital status",
            error: error.message,
        });
    }
};

// ✅ Hospital Sign-in
export const signinHospital = async(req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new Error("All fields are required");
        }

        const hospital = await Hospital.findOne({ email });
        if (!hospital) {
            throw new Error("Incorrect email");
        }

        const match = await bcrypt.compare(password, hospital.password);
        if (!match) {
            throw new Error("Incorrect password");
        }

        res.status(200).json(hospital);
    } catch (error) {
        console.error(error); // Logging the error for debugging
        res.status(400).json({ message: error.message });
    }
};