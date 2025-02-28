import mongoose from 'mongoose';
import validator from 'validator';
import moment from 'moment'; // Uncomment for date validation if needed

const hospitalSchema = new mongoose.Schema({
    hospitalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HospitalAdmin', // Reference to HospitalAdmin model
        required: true,
    },
    hospitalName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: 'Invalid email format',
        },
    },
    password: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (value) => /^\d{10}$/.test(value), // Assumes 10-digit phone numbers
            message: (props) => `${props.value} is not a valid phone number!`,
        },
    },
    address: {
        type: String,
        required: true,
    },
    image: {
        type: String, // URL or file path for the image
        required: false,
    },
    startTime: {
        type: String, // Assuming you store as string (e.g., "09:00 AM")
        required: true,
    },
    endTime: {
        type: String, // Assuming you store as string (e.g., "05:00 PM")
        required: true,
    },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HospitalAdmin', // Reference to HospitalAdmin model
        required: true,
    },
    activeStatus: {
        type: Boolean,
        default: true, // Default to active
    },
}, { timestamps: true });

// Signin method (example implementation, adjust as needed)
hospitalSchema.statics.signin = async function(email, password) {
    if (!email || !password) {
        throw new Error("All Fields are Required");
    }

    const hospital = await this.findOne({ email });

    if (!hospital) {
        throw new Error('Incorrect Email');
    }

    const match = (password === hospital.password);

    if (!match) {
        throw new Error('Incorrect Password');
    }

    return hospital;
}

const Hospital = mongoose.model('Hospital', hospitalSchema);

export default Hospital;