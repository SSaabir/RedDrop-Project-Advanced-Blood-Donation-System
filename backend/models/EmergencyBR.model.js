import mongoose from 'mongoose';

const emergencyBRSchema = new mongoose.Schema({
    
    emergencyBRId: { // Primary Key (P)
        type: String,
        required: true,
        unique: true,
    },
    responsibleId: { // Foreign Key (F)
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'responsibleModel', // Can be either a hospitalId or donorId
    },
    responsibleModel: {
        type: String,
        required: true,
        enum: ['Hospital', 'Donor'], // To specify whether responsibleId is hospital or donor
    },
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
    proofOfIdentificationNumber: { 
        type: String,
        required: true,
        unique: true,
    },
    proofDocument: {
        type: String, // Store the file path or URL of the document
        required: true,
    },
    patientBlood: {
        type: String,
        required: true,
        enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'], // Ensures only valid blood types
    },
    criticalLevel: {
        type: String,
        enum: ['Low', 'Medium', 'High'], // Restrict to valid values
        required: true,
    },    
    withinDate: { 
        type: Date,
        required: true,
    },
    activeStatus: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

const EmergencyBR = mongoose.model('EmergencyBR', emergencyBRSchema);

export default EmergencyBR;