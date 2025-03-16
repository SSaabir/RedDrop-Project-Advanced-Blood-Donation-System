import mongoose from "mongoose";
import validator from "validator";
import bcryptjs from "bcryptjs"; // Import bcryptjs for password comparison
import moment from "moment"; // For time validation (if needed)

// Helper function to validate time format
const validateTime = (time) => {
    return moment(time, "HH:mm", true).isValid(); // Validates time in 24-hour format (HH:mm)
};

const hospitalSchema = new mongoose.Schema({
    systemManagerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SystemManager", // Refers to a SystemManager model (must be created)
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
            message: "Invalid email format",
        },
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: false, // Image is optional
        validate: {
            validator: (value) => {
                if (value) {
                    return /\.(jpg|jpeg|png|gif|bmp)$/i.test(value); // Basic image extension validation
                }
                return true;
            },
            message: "Invalid image format",
        },
    },
    startTime: {
        type: String,
        required: true,
        validate: {
            validator: (value) => validateTime(value),
            message: "Invalid start time format. Please use HH:mm.",
        },
    },
    endTime: {
        type: String,
        required: true,
        validate: {
            validator: (value) => validateTime(value),
            message: "Invalid end time format. Please use HH:mm.",
        },
    },
    activeStatus: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

// ✅ Signin method
hospitalSchema.statics.signin = async function(email, password) {
    if (!email || !password) throw new Error("All Fields are Required");

    const hospital = await this.findOne({ email });
    if (!hospital) throw new Error("Incorrect Email");

    const match = await bcryptjs.compare(password, hospital.password);
    if (!match) throw new Error("Incorrect Password");

    return hospital;
};

hospitalSchema.pre("save", async function(next) {
    if (this.isModified("password")) {
        const salt = await bcryptjs.genSalt(10);
        this.password = await bcryptjs.hash(this.password, salt);
    }
    next();
});

export default mongoose.model("Hospital", hospitalSchema);