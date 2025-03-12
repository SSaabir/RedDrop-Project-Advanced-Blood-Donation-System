import mongoose from 'mongoose';

const bloodInventorySchema = new mongoose.Schema({
    hospitalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
        required: true,
    },
    bloodType: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
        required: true,
    },
   
    availableStocks: {
        type: Number,
        required: true,
        min: 0,
    },
    expirationDate: {
        type: Date,
        required: true,
    }
}, { timestamps: true });

const BloodInventory = mongoose.model('BloodInventory', bloodInventorySchema);

export default BloodInventory;