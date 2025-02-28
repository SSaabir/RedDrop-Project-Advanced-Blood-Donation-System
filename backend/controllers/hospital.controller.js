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
        const { hospitalName, email, password, phoneNumber, address, image, startTime, endTime, adminId } = req.body;

        const newHospital = new Hospital({
            hospitalName,
            email,
            password,
            phoneNumber,
            address,
            image,
            startTime,
            endTime,
            adminId,
        });

        await newHospital.save();
        res.status(201).json(newHospital);
    } catch (error) {
        res.status(400).json({ message: "Error creating hospital", error });
    }
};

// ✅ Update hospital details
export const updateHospital = async(req, res) => {
    try {
        const updatedHospital = await Hospital.findByIdAndUpdate(
            req.params.id,
            req.body, { new: true }
        );

        if (!updatedHospital) return res.status(404).json({ message: "Hospital not found" });

        res.status(200).json(updatedHospital);
    } catch (error) {
        res.status(500).json({ message: "Error updating hospital", error });
    }
};

// ✅ Delete a hospital
export const deleteHospital = async(req, res) => {
    try {
        const deletedHospital = await Hospital.findByIdAndDelete(req.params.id);
        if (!deletedHospital) return res.status(404).json({ message: "Hospital not found" });

        res.json({ message: "Hospital deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting hospital", error });
    }
};