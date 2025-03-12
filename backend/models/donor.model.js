import mongoose from "mongoose";
import bcryptjs from "bcryptjs"; // Password hashing
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
    gender: {
        type: String,
        required: true,
        enum: ["Male", "Female", "Other"], // Only accept valid gender values
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
    city: {
        type: String,
        required: true, // Ensures city is provided
        trim: true,
    },
    nic: {
        type: String,
        required: true,
        unique: true,
        trim: true,
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
        type: Boolean,
        default: true, // true = Healthy, false = Unfit/Pending Checkup
    },
    appointmentStatus: {
        type: Boolean,
        default: false, // true = Scheduled/Completed, false = Canceled/Pending
    },
}, { timestamps: true });

// ✅ Signup method
donorSchema.statics.signup = async function(
    firstName,
    lastName,
    gender,
    phoneNumber,
    email,
    password,
    dob,
    bloodType,
    city,
    nic,
    image,
    healthStatus = true,
    appointmentStatus = false
) {
    // Validation
    if (!firstName || !lastName || !gender || !phoneNumber || !email || !password || !dob || !bloodType || !city || !nic) {
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

    const hashedPassword = await bcryptjs.hash(password, 10);

    const donor = await this.create({
        firstName,
        lastName,
        gender,
        phoneNumber,
        email,
        password: hashedPassword,
        dob,
        bloodType,
        city,
        nic,
        image,
        healthStatus,
        appointmentStatus,
        activeStatus: true, // Default to active
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

    const match = await bcryptjs.compare(password, donor.password);
    if (!match) {
        throw new Error("Incorrect Password");
    }

    return donor;
};

// ✅ Update method (for profile and status update)
donorSchema.statics.updateProfile = async function(id, updateData) {
    const updatedDonor = await this.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedDonor) {
        throw new Error("Donor not found");
    }
    return updatedDonor;
};

// ✅ Deactivate method (for active status toggle)
donorSchema.statics.toggleActiveStatus = async function(id) {
    const donor = await this.findById(id);
    if (!donor) {
        throw new Error("Donor not found");
    }

    donor.activeStatus = !donor.activeStatus;
    await donor.save();

    return donor;
};

const Donor = mongoose.model("Donor", donorSchema);

export default Donor;