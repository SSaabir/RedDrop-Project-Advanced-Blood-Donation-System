import EmergencyBR from "../models/EmergencyBR.model.js";

// Simulated blood inventory (replace with your actual inventory system)
let bloodInventory = {
    "A+": 5,
    "A-": 3,
    "B+": 4,
    "B-": 2,
    "O+": 6,
    "O-": 3,
    "AB+": 2,
    "AB-": 1,
  };

// Get all emergency requests with search & filter functionality
export const getEmergencyRequests = async (req, res) => {
    try {
        const { search, patientBlood, criticalLevel, withinDate, activeStatus } = req.query;
        let filter = {};

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { phoneNumber: { $regex: search, $options: "i" } },
            ];
        }
        if (patientBlood) filter.patientBlood = patientBlood;
        if (criticalLevel) filter.criticalLevel = criticalLevel;
        if (withinDate) filter.withinDate = { $lte: new Date(withinDate) };
        if (activeStatus) filter.activeStatus = activeStatus;

        const requests = await EmergencyBR.find(filter);
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving emergency requests", error });
    }
};

// Get a single emergency request by emergencyBRId
export const getEmergencyRequestById = async (req, res) => {
    try {
        const request = await EmergencyBR.findOne({ emergencyBRId: req.params.emergencyBRId });
        if (!request) return res.status(404).json({ message: "Emergency request not found" });

        res.status(200).json(request);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving emergency request", error });
    }
};

// Create an emergency request
export const createEmergencyRequest = async (req, res) => {
    try {
        console.log("Request Body:", req.body);
        console.log("Uploaded File:", req.file);

        const {
            name,
            phoneNumber,
            proofOfIdentificationNumber,
            patientBlood,
            units,
            reason,
            criticalLevel,
            withinDate,
            hospitalName,
            address,
        } = req.body;

        // Check required fields
        if (!name || !phoneNumber || !proofOfIdentificationNumber || !patientBlood || !units || !reason || !criticalLevel || !withinDate || !hospitalName || !address) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const proofDocument = req.file ? `/uploads/${req.file.filename}` : null;

        const newRequest = new EmergencyBR({
            name,
            phoneNumber,
            proofOfIdentificationNumber,
            proofDocument,
            patientBlood,
            units,
            reason,
            criticalLevel,
            withinDate,
            hospitalName,
            address,
        });

        await newRequest.save();
        res.status(201).json(newRequest);
    } catch (error) {
        console.error("Error:", error);
        res.status(400).json({ message: "Error creating emergency request", error });
    }
};

// Delete an emergency request
export const deleteEmergencyRequest = async (req, res) => {
    try {
      const deletedRequest = await EmergencyBR.findOneAndDelete({
        emergencyBRId: req.params.emergencyBRId,
      });
      if (!deletedRequest) {
        return res.status(404).json({ message: "Emergency request not found" });
      }
      res.json({ message: "Emergency request deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting emergency request", error });
    }
  };

// Accept an emergency request
export const acceptEmergencyRequest = async (req, res) => {
    try {
      const request = await EmergencyBR.findOne({ emergencyBRId: req.params.emergencyBRId });
      if (!request) {
        return res.status(404).json({ message: "Emergency request not found" });
      }
  
      // Check inventory
      const { patientBlood, units } = request;
      if (bloodInventory[patientBlood] < units) {
        return res.status(400).json({ message: `Insufficient ${patientBlood} stock. Available: ${bloodInventory[patientBlood]} units.` });
      }
  
      // Reserve blood
      bloodInventory[patientBlood] -= units;
  
      // Update request
      request.activeStatus = "Accepted";
      const updatedRequest = await request.save();
      res.status(200).json(updatedRequest);
    } catch (error) {
      console.error("Accept Error:", error);
      res.status(500).json({ message: "Error accepting emergency request", error });
    }
  };

// Decline an emergency request
export const declineEmergencyRequest = async (req, res) => {
    try {
      const { reason } = req.body; // Expect reason in the request body
      const request = await EmergencyBR.findOne({ emergencyBRId: req.params.emergencyBRId });
      if (!request) {
        return res.status(404).json({ message: "Emergency request not found" });
      }
  
      // Update request with decline reason
      request.activeStatus = "Declined";
      request.declineReason = reason || "No reason provided";
      const updatedRequest = await request.save();
      res.status(200).json(updatedRequest);
    } catch (error) {
      console.error("Decline Error:", error);
      res.status(500).json({ message: "Error declining emergency request", error });
    }
  };

