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
        validate: {
            validator: (value) => value > new Date(),
            message: "Expiration date must be in the future",
        },
    },
    expiredStatus: {
        type: String,
        enum: ['Expired', 'Not Expired', 'Soon'],
        default: 'Not Expired',
    },
}, { timestamps: true });

bloodInventorySchema.statics.updateExpiredStatus = async function () {
    const currentDateTime = new Date();
    
    await this.updateMany(
        {
            expirationDate: { $lte: currentDateTime },
            expiredStatus: { $ne: 'Expired' }
        },
        { 
            expiredStatus: 'Expired',
            updatedAt: currentDateTime
        }
    );
};

bloodInventorySchema.statics.updateExpiringSoonStatus = async function () {
    const currentDateTime = new Date();
    const expiringSoonThreshold = new Date();
    expiringSoonThreshold.setDate(currentDateTime.getDate() + 14);
    
    await this.updateMany(
        {
            expirationDate: { $gt: currentDateTime, $lte: expiringSoonThreshold },
            expiredStatus: { $ne: 'Soon' }
        },
        { 
            expiredStatus: 'Soon',
            updatedAt: currentDateTime
        }
    );
};

const BloodInventory = mongoose.model('BloodInventory', bloodInventorySchema);

export default BloodInventory;