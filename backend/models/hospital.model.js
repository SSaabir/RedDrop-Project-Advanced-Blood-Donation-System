import mongoose from "mongoose";
import validator from "validator";
import moment from "moment";

const hospitalSchema = new mongoose.Schema({
    systemManagerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SystemManager",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    identificationNumber: {
        type: String,
        required: true,
        unique: true,
    },
    address: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (value) => /^\d{10}$/.test(value),
            message: (props) => `${props.value} is not a valid phone number!`,
        },
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: (props) => `${props.value} is not a valid email address!`,
        },
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String, // URL or file path
        required: false,
    },
    startTime: {
        type: String,
        required: true,
        validate: {
            validator: (value) => moment(value, "HH:mm", true).isValid(),
            message: "Invalid start time format (HH:mm required)",
        },
    },
    endTime: {
        type: String,
        required: true,
        validate: {
            validator: (value) => moment(value, "HH:mm", true).isValid(),
            message: "Invalid end time format (HH:mm required)",
        },
    },
    activeStatus: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

// Sign-in method
hospitalSchema.statics.signin = async function(email, password) {
    if (!email || !password) {
        throw new Error("All fields are required");
    }

    const hospital = await this.findOne({ email });

    if (!hospital) {
        throw new Error("Incorrect email");
    }

    const match = password === hospital.password;

    if (!match) {
        throw new Error("Incorrect password");
    }

    return hospital;
};

const Hospital = mongoose.model("Hospital", hospitalSchema);

export default Hospital;