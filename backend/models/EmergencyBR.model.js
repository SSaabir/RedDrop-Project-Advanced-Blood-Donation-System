import mongoose from 'mongoose';

const emergencyBRSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        validate: {
            validator: (value) => /^\d{10}$/.test(value), // Assumes 10-digit phone numbers
            message: (props) => `${props.value} is not a valid phone number!`,
        },
    },
    ID: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: (value) => /\S+@\S+\.\S+/.test(value), // Basic email validation
            message: (props) => `${props.value} is not a valid email!`,
        },
    },
    proofDocument: {
        type: String, // Store the file path or URL of the document
        required: true,
    },
    neededBlood: {
        type: String,
        required: true, // e.g., A+, O-
    },
    criticalLevel: {
        type: String, // e.g., "Low", "Medium", "High"
        required: true,
    },
    expiry: {
        type: Date,
        required: true,
    },
    activeStatus: {
        type: Boolean,
        default: true,
    },
    responsibleId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'responsibleModel', // Can be either a hospitalId or donorId
    },
    responsibleModel: {
        type: String,
        required: true,
        enum: ['Hospital', 'Donor'], // To specify whether responsibleId is hospital or donor
    }
}, {timestamps: true});

const EmergencyBR = mongoose.model('EmergencyBR', emergencyBRSchema);

export default EmergencyBR;
