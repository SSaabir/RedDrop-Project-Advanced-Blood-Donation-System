import Donor from "../models/donor.model.js";

// Get all donors
export const getDonors = async (req, res) => {
    try {
        const donors = await Donor.find();
        res.json(donors);
    } catch (error) {
        res.status(500).json({ message: "Error fetching donors" });
    }
};

// Get a single donor by ID
export const getDonorById = async (req, res) => {
    try {
        const donor = await Donor.findById(req.params.id);
        if (!donor) return res.status(404).json({ message: "Donor not found" });
        res.json(donor);
    } catch (error) {
        res.status(500).json({ message: "Error fetching donor" });
    }
};

// Create a new donor
export const createDonor = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            gender,
            phoneNumber,
            email,
            password,
            dob,
            bloodType,
            city,
            nic
        } = req.body;

        if (!firstName || !lastName || !gender || !phoneNumber || !email || !password || !dob || !bloodType || !city || !nic) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const image = req.file ? req.file.path : null;

        const newDonor = new Donor({
            firstName,
            lastName,
            gender,
            phoneNumber,
            email,
            password,
            dob,
            bloodType,
            city,
            nic,
            image,
        });

        await newDonor.save();
        res.status(201).json(newDonor);
    } catch (error) {
        res.status(400).json({ message: "Error creating donor" });
    }
};

// Update donor details
export const updateDonor = async (req, res) => {
    try {
        let { password, ...otherUpdates } = req.body;

        if (password) {
            password = await bcrypt.hash(password, 10);
            otherUpdates.password = password;
        }

        const updatedDonor = await Donor.findByIdAndUpdate(
            req.params.id,
            otherUpdates,
            { new: true, runValidators: true }
        );

        if (!updatedDonor) return res.status(404).json({ message: "Donor not found" });

        res.status(200).json(updatedDonor);
    } catch (error) {
        res.status(500).json({ message: "Error updating donor" });
    }
};

// Delete a donor
export const deleteDonor = async (req, res) => {
    try {
        const deletedDonor = await Donor.findByIdAndDelete(req.params.id);
        if (!deletedDonor) return res.status(404).json({ message: "Donor not found" });

        res.json({ message: "Donor deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting donor" });
    }
};

// Update health status
export const updateHealthStatus = async (req, res) => {
    try {
        let { healthStatus } = req.body;
        healthStatus = healthStatus === "true" || healthStatus === true;

        const updatedDonor = await Donor.findByIdAndUpdate(
            req.params.id,
            { healthStatus },
            { new: true }
        );

        if (!updatedDonor) return res.status(404).json({ message: "Donor not found" });

        res.status(200).json(updatedDonor);
    } catch (error) {
        res.status(500).json({ message: "Error updating health status" });
    }
};

// Update appointment status
export const updateAppointmentStatus = async (req, res) => {
    try {
        let { appointmentStatus } = req.body;
        appointmentStatus = appointmentStatus === "true" || appointmentStatus === true;

        const updatedDonor = await Donor.findByIdAndUpdate(
            req.params.id,
            { appointmentStatus },
            { new: true }
        );

        if (!updatedDonor) return res.status(404).json({ message: "Donor not found" });

        res.status(200).json(updatedDonor);
    } catch (error) {
        res.status(500).json({ message: "Error updating appointment status" });
    }
};

// Activate/Deactivate donor status
export const activateDeactivateDonor = async (req, res) => {
    try {
        const { id } = req.params;

        const donor = await Donor.findById(id);
        if (!donor) {
            return res.status(404).json({ message: "Donor not found" });
        }

        const newStatus = !donor.activeStatus;
        const updatedDonor = await Donor.findByIdAndUpdate(
            id,
            { $set: { activeStatus: newStatus } },
            { new: true }
        );

        res.status(200).json({
            message: `Donor ${newStatus ? 'activated' : 'deactivated'} successfully`,
            donor: updatedDonor,
        });
    } catch (error) {
        res.status(500).json({ message: "Error toggling donor status" });
    }
};