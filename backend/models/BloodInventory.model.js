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
    const currentDateTime = new Date(); // Current date and time
    
    console.log("Current Date and Time: ", currentDateTime); // Debugging log

    await this.updateMany(
        {
            $expr: {
                $lte: [
                    { 
                        $cond: [
                            { $gt: [{ $type: "$expirationDate" }, "date"] }, // Check if it's already an ISODate
                            "$expirationDate",
                            { $toDate: "$expirationDate" } // Convert string to Date if needed
                        ]
                    },
                    currentDateTime // Compare with currentDateTime which includes date and time
                ]
            },
            expiredStatus: { $ne: 'Expired' }
        },
        { 
            expiredStatus: 'Expired',
            updatedAt: currentDateTime
        }
    );
};

bloodInventorySchema.statics.updateExpiringSoonStatus = async function () {
    const now = new Date();
    const threshold = new Date();
    threshold.setDate(now.getDate() + 14);

    // Fetch candidates (all not-yet-expired + Soon not already set)
    const candidates = await this.find({
        expiredStatus: { $ne: 'Soon' }
    });

    const updates = [];

    for (const item of candidates) {
        let expDate = item.expirationDate;

        // If it's a string, try converting it to a Date
        if (typeof expDate === 'string') {
            expDate = new Date(expDate);
            if (isNaN(expDate.getTime())) continue; // Skip invalid date
        }

        // If valid and in the 'soon' range, prepare for update
        if (expDate > now && expDate <= threshold) {
            updates.push(item._id);
        }
    }

    if (updates.length > 0) {
        await this.updateMany(
            { _id: { $in: updates } },
            {
                expiredStatus: 'Soon',
                updatedAt: now
            }
        );
        console.log(`Marked ${updates.length} items as 'Soon'`);
    } else {
        console.log('No expiring soon items found');
    }
};


const BloodInventory = mongoose.model('BloodInventory', bloodInventorySchema);

export default BloodInventory;