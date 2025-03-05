import HospitalAdmin from '../models/HospitalAdmin.model.js';

// ✅ Get all hospital admins
export const getHospitalAdmins = async (req, res) => {
    try {
        const admins = await HospitalAdmin.find();
        res.json(admins);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching hospital admins', error });
    }
};

// ✅ Get a single hospital admin by ID
export const getHospitalAdminById = async (req, res) => {
    try {
        const admin = await HospitalAdmin.findById(req.params.id);
        if (!admin) return res.status(404).json({ message: 'Hospital Admin not found' });
        res.json(admin);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching hospital admin', error });
    }
};

// ✅ Create a new hospital admin
export const createHospitalAdmin = async (req, res) => {
    try {
        const { email, password, firstName, lastName, phoneNumber, dob, hospitalId, activeStatus } = req.body;

        const newAdmin = new HospitalAdmin({
            email,
            password,
            firstName,
            lastName,
            phoneNumber,
            dob,
            hospitalId,
            activeStatus,
        });

        await newAdmin.save();
        res.status(201).json(newAdmin);
    } catch (error) {
        res.status(400).json({ message: 'Error creating hospital admin', error });
    }
};

// ✅ Update hospital admin details
export const updateHospitalAdmin = async (req, res) => {
    try {
        const updatedAdmin = await HospitalAdmin.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!updatedAdmin) return res.status(404).json({ message: 'Hospital Admin not found' });

        res.status(200).json(updatedAdmin);
    } catch (error) {
        res.status(500).json({ message: 'Error updating hospital admin', error });
    }
};

// ✅ Delete a hospital admin
export const deleteHospitalAdmin = async (req, res) => {
    try {
        const deletedAdmin = await HospitalAdmin.findByIdAndDelete(req.params.id);
        if (!deletedAdmin) return res.status(404).json({ message: 'Hospital Admin not found' });

        res.json({ message: 'Hospital Admin deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting hospital admin', error });
    }
};
