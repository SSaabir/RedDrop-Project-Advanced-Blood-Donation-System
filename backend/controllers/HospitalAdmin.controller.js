import HospitalAdmin from '../models/HospitalAdmin.model.js';
import { errorHandler } from '../utils/error.js'; // Assuming errorHandler is in a utility file

// ✅ Get all hospital admins
export const getHospitalAdmins = async (req, res, next) => {
    try {
        const admins = await HospitalAdmin.find();
        res.json(admins);
    } catch (error) {
        next(errorHandler(500, 'Error fetching hospital admins')); // Pass the error to the next middleware
    }
};

// ✅ Get all hospital admins by hospital ID
export const getHospitalAdminsByHospitalId = async (req, res, next) => {
    try {
        const admins = await HospitalAdmin.find({ hospitalId: req.params.id });
        res.json(admins);
    } catch (error) {
        next(errorHandler(500, 'Error fetching hospital admins')); // Pass the error to the next middleware
    }
};

// ✅ Get a single hospital admin by ID
export const getHospitalAdminById = async (req, res, next) => {
    try {
        const admin = await HospitalAdmin.findById(req.params.id);
        if (!admin) return res.status(404).json({ message: 'Hospital Admin not found' });
        res.json(admin);
    } catch (error) {
        next(errorHandler(500, 'Error fetching hospital admin')); // Pass the error to the next middleware
    }
};

export const createHospitalAdmin = async (req, res, next) => {
    try {
        console.log('Request Body:', req.body);
        const { email, firstName, lastName, phoneNumber, dob, hospitalId, address, nic, password } = req.body;

        // Check if email or phone number already exists
        const existingAdmin = await HospitalAdmin.findOne({
            $or: [{ email }, { phoneNumber }]
        });

        if (existingAdmin) {
            return next(errorHandler(400, 'Email or Phone Number already in use'));
        }

        // Set image URL if an image is uploaded
        const image = req.file ? req.file.path : null;

        const newAdmin = new HospitalAdmin({
            email: email,
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
            dob: dob,
            hospitalId: hospitalId,
            address: address,
            nic: nic,
            image: image, // Include the image path
            password: password,
            activeStatus: true // Default to active
        });

        await newAdmin.save();
        res.status(201).json(newAdmin);
    } catch (error) {
        next(errorHandler(400, 'Error creating hospital admin')); // Pass the error to the next middleware
    }
};

// ✅ Update hospital admin details (Fixed)
export const updateHospitalAdmin = async (req, res, next) => {
    try {
        const updates = { ...req.body };
        if (req.file) {
            updates.image = req.file.path;
        }

        const updatedAdmin = await HospitalAdmin.findByIdAndUpdate(req.params.id, updates, { new: true });

        if (!updatedAdmin) return res.status(404).json({ message: 'Hospital Admin not found' });

        res.status(200).json(updatedAdmin);
    } catch (error) {
        next(errorHandler(500, 'Error updating hospital admin')); // Pass the error to the next middleware
    }
};

export const deleteHospitalAdmin = async (req, res, next) => {
    try {
        const deletedAdmin = await HospitalAdmin.findByIdAndDelete(req.params.id);
        if (!deletedAdmin) return res.status(404).json({ message: 'Hospital Admin not found' });

        res.json({ message: 'Hospital Admin deleted successfully' });
    } catch (error) {
        next(errorHandler(500, 'Error deleting hospital admin')); // Pass the error to the next middleware
    }
};

export const activateDeactivateHospitalAdmin = async (req, res, next) => {
    try {
        const { id } = req.params;

        const admin = await HospitalAdmin.findById(id);
        if (!admin) {
            return next(errorHandler(404, "Hospital Admin not found"));
        }

        const newStatus = !admin.activeStatus;
        const updatedAdmin = await HospitalAdmin.findByIdAndUpdate(id, { $set: { activeStatus: newStatus } }, { new: true });

        res.status(200).json({
            message: `Hospital Admin ${newStatus ? 'activated' : 'deactivated'} successfully`,
            admin: updatedAdmin,
        });
    } catch (error) {
        next(errorHandler(500, "Error toggling hospital admin status")); // Pass the error to the next middleware
    }
};
