import Donor from "../models/donor.model.js";

// ✅ Get all donors
export const getDonors = async(req, res) => {
    try {
        const donors = await Donor.find();
        res.json(donors);
    } catch (error) {
        res.status(500).json({ message: "Error fetching donors", error });
    }
};

// ✅ Get a single donor by ID
export const getDonorById = async(req, res) => {
    try {
        const donor = await Donor.findById(req.params.id);
        if (!donor) return res.status(404).json({ message: "Donor not found" });
        res.json(donor);
    } catch (error) {
        res.status(500).json({ message: "Error fetching donor", error });
    }
};

// ✅ Create a new donor
export const createDonor = async(req, res) => {
    try {
        const { firstName, lastName, phoneNumber, email, password, dob, bloodType, image } = req.body;

        const newDonor = new Donor({
            firstName,
            lastName,
            phoneNumber,
            email,
            password,
            dob,
            bloodType,
            image,
        });

        await newDonor.save();
        res.status(201).json(newDonor);
    } catch (error) {
        res.status(400).json({ message: "Error creating donor", error });
    }
};

// ✅ Update donor details
export const updateDonor = async(req, res) => {
    try {
        const updatedDonor = await Donor.findByIdAndUpdate(
            req.params.id,
            req.body, { new: true }
        );

        if (!updatedDonor) return res.status(404).json({ message: "Donor not found" });

        res.status(200).json(updatedDonor);
    } catch (error) {
        res.status(500).json({ message: "Error updating donor", error });
    }
};

// ✅ Delete a donor
export const deleteDonor = async(req, res) => {
    try {
        const deletedDonor = await Donor.findByIdAndDelete(req.params.id);
        if (!deletedDonor) return res.status(404).json({ message: "Donor not found" });

        res.json({ message: "Donor deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting donor", error });
    }
};