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

export const createHospitalAdmin = async (req, res) => {
    try {
        console.log('Request Body:', req.body);
        const { email, firstName, lastName, phoneNumber, dob, hospitalId, address, nic, password } = req.body;
        
        // Check if email or phone number already exists
        const existingAdmin = await HospitalAdmin.findOne({
            $or: [{ email }, { phoneNumber }]
        });

        if (existingAdmin) {
            return res.status(400).json({ message: 'Email or Phone Number already in use' });
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
       // Log the error for debugging
           res.status(400).json({ message: 'Error creating hospital admin', error: error.message });
        }
};

// ✅ Update hospital admin details (Fixed)
export const updateHospitalAdmin = async (req, res) => {
    try {
        const updates = { ...req.body };
        if (req.file) {
            updates.image = req.file.path;
        }

        const updatedAdmin = await HospitalAdmin.findByIdAndUpdate(req.params.id, updates, { new: true });

        if (!updatedAdmin) return res.status(404).json({ message: 'Hospital Admin not found' });

        res.status(200).json(updatedAdmin);
    } catch (error) {
        res.status(500).json({ message: 'Error updating hospital admin', error });
    }
};

export const deleteHospitalAdmin = async (req, res) => {
    try {
        const deletedAdmin = await HospitalAdmin.findByIdAndDelete(req.params.id);
        if (!deletedAdmin) return res.status(404).json({ message: 'Hospital Admin not found' });

        res.json({ message: 'Hospital Admin deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting hospital admin', error });
    }
};

export const activateDeactivateHospitalAdmin = async (req, res) => {
    try {
      const { id } = req.params;
  
      const admin = await HospitalAdmin.findById(id);
      if (!admin) {
        return res.status(404).json({ message: "Hospital Admin not found" });
      }
  
      const newStatus = !admin.activeStatus;
      const updatedAdmin = await HospitalAdmin.findByIdAndUpdate(
        id,
        { $set: { activeStatus: newStatus } },
        { new: true }
      );
  
      res.status(200).json({
        message: `Hospital Admin ${newStatus ? 'activated' : 'deactivated'} successfully`,
        admin: updatedAdmin,
      });
    } catch (error) {
      console.error('Activate/Deactivate error:', error);
      res.status(500).json({
        message: "Error toggling hospital admin status",
        error: error.message,
      });
    }
  };