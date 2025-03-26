import mongoose from 'mongoose';

// Function to generate a unique emergencyBRId
const generateEmergencyBRId = () => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `EBR-${timestamp}-${randomStr}`;
};

const emergencyBRSchema = new mongoose.Schema({
  emergencyBRId: {
    type: String,
    required: true,
    unique: true, // This creates the index implicitly
    default: generateEmergencyBRId,
  },
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    validate: {
      validator: (value) => /^\d{10}$/.test(value),
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  proofOfIdentificationNumber: {
    type: String,
    required: true,
    unique: true, // This also creates an index
  },
  proofDocument: {
    type: String,
    required: false,
    default: null,
  },
  patientBlood: {
    type: String,
    required: true,
    enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
  },
  units: {
    type: Number,
    required: true,
    min: 1,
  },
  reason: {
    type: String,
    required: true,
  },
  criticalLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    required: true,
  },
  withinDate: {
    type: Date,
    required: true,
    default: Date.now, // Default to current date if not provided
  },
  activeStatus: {
    type: String,
    enum: ['Pending', 'Accepted', 'Declined'],
    default: 'Pending',
  },
  hospitalName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  activeStatus: {
    type: String,
    enum: ["Pending", "Accepted", "Declined"],
    default: "Pending",
  },
  declineReason: {
    type: String,
    required: false,
    default: null,
  },
}, { timestamps: true });

// Only keep the index for patientBlood (not covered by unique: true)
emergencyBRSchema.index({ patientBlood: 1 });

const EmergencyBR = mongoose.model('EmergencyBR', emergencyBRSchema);

export default EmergencyBR;