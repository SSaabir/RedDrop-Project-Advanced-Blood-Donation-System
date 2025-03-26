import BloodInventory from "../models/BloodInventory.model.js";

// Get all blood inventory records
export const getBloodInventory = async (req, res) => {
    try {
        const inventory = await BloodInventory.find();
        res.json(inventory);
        console.log("Blood Inventory:", inventory);
    } catch (error) {
        res.status(500).json({ message: "Error fetching blood inventory", error });
    }
};

//  Get all blood inventory records by Hospital ID
export const getBloodInventoryByHospital = async (req, res) => {
    try {
        const inventory = await BloodInventory.find({ hospitalId: req.params.id });
        res.json(inventory);
    } catch (error) {
        res.status(500).json({ message: "Error fetching blood inventory", error });
    }
};

//  Get a single blood inventory record by ID
export const getBloodInventoryById = async (req, res) => {
    try {
        const record = await BloodInventory.findById(req.params.id).populate('hospitalId');
        res.json(record);
    } catch (error) {
        res.status(500).json({ message: "Error fetching blood inventory", error });
    }
};

//  Create a new blood inventory record


export const createBloodInventory = async (req, res) => {
    try {
        
        const { hospitalId, bloodType, availableStocks, expirationDate } = req.body;

        if (!hospitalId || !bloodType || !availableStocks || !expirationDate) {
            console.error("Validation failed: Missing required fields", req.body);
            return res.console.error(400).json({ message: "All fields are required!" });
        }

        const newInventory = new BloodInventory({
            hospitalId,
            bloodType,
            availableStocks,
            expirationDate,
        });
        console.log("Received Dat:", newInventory); // Debugging

        await newInventory.save();
        res.status(201).json({ success: true, data: newInventory});
    } catch (error) {
        console.error("Error in createBloodInventory:", error);
        res.status(400).json({ message: "Error creating blood inventory record", error });
    }
};



//  Update blood inventory details
export const updateBloodInventory = async (req, res) => {
    try {
        const updatedInventory = await BloodInventory.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedInventory) return res.status(404).json({ message: "Blood inventory record not found" });

        res.status(200).json(updatedInventory);
    } catch (error) {
        res.status(500).json({ message: "Error updating blood inventory record", error });
    }
};

//  Delete a blood inventory record
export const deleteBloodInventory = async (req, res) => {
    try {
        const deletedInventory = await BloodInventory.findByIdAndDelete(req.params.id);
        if (!deletedInventory) return res.status(404).json({ message: "Blood inventory record not found" });

        res.json({ message: "Blood inventory record deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting blood inventory record", error });
    }
};


export const toggleExpired = async (req, res) => {
    try {
        console.log("Received ID:", req.params.id);
        const inventory = await BloodInventory.findByIdAndUpdate(
            req.params.id,
            { expiredStatus: true },
            { new: true }
        );
        res.json(inventory);
    }
    catch (error) {
        res.status(500).json({ message: "Error toggling expired status", error });
    }
};