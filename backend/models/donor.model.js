import mongoose from "mongoose";
import validator from "validator";
import moment from "moment"; // For DOB validation

const donorSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(value) {
                return /^\d{10}$/.test(value); // Ensures a valid 10-digit phone number
            },
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
    dob: {
        type: Date,
        required: true,
        validate: {
            validator: function(value) {
                // Ensure the donor is at least 18 years old
                return moment().diff(value, "years") >= 18;
            },
            message: "Donor must be at least 18 years old!",
        },
    },
    bloodType: {
        type: String,
        required: true,
        enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"], // Restrict to valid blood types
    },
    image: {
        type: String, // URL or file path for the profile picture
        required: false,
    },
    activeStatus: {
        type: Boolean,
        default: true, // Default to active
    },
    healthStatus: {
        type: String,
        enum: ["Healthy", "Pending Checkup", "Unfit"],
        default: "Healthy",
    },
    appointmentStatus: {
        type: String,
        enum: ["Scheduled", "Completed", "Canceled", "Pending"],
        default: "Pending",
    },
}, { timestamps: true });

// ✅ Signup method
donorSchema.statics.signup = async function(
    firstName,
    lastName,
    phoneNumber,
    email,
    password,
    dob,
    bloodType,
    image,
    healthStatus = "Healthy",
    appointmentStatus = "Pending"
) {
    // Validation
    if (!firstName || !lastName || !phoneNumber || !email || !password || !dob || !bloodType) {
        throw new Error("All Fields are Required");
    }

    if (!validator.isEmail(email)) {
        throw new Error("Email is Not Valid");
    }

    if (!validator.isStrongPassword(password)) {
        throw new Error("Password is Not Strong Enough");
    }

    const exists = await this.findOne({ email });

    if (exists) {
        throw new Error("Email Already Exists");
    }

    const donor = await this.create({
        firstName,
        lastName,
        phoneNumber,
        email,
        password,
        dob,
        bloodType,
        image,
        healthStatus,
        appointmentStatus,
    });

    return donor;
};

// ✅ Signin method
donorSchema.statics.signin = async function(email, password) {
    if (!email || !password) {
        throw new Error("All Fields are Required");
    }

    const donor = await this.findOne({ email });

    if (!donor) {
        throw new Error("Incorrect Email");
    }

    const match = password === donor.password;

    if (!match) {
        throw new Error("Incorrect Password");
    }

    return donor;
};

const Donor = mongoose.model("Donor", donorSchema);

export default Donor;