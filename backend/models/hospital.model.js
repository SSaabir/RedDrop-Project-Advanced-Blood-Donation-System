import mongoose from "mongoose";
import validator from "validator";
import moment from "moment"; // For time validation

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
    },
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
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

// ✅ Update method (for profile and status update)
hospitalSchema.statics.updateProfile = async function(id, updateData) {
    const updatedHospital = await this.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedHospital) {
        throw new Error("Hospital not found");
    }
    return updatedHospital;
};

// ✅ Deactivate method (for active status toggle)
hospitalSchema.statics.toggleActiveStatus = async function(id) {
    const hospital = await this.findById(id);
    if (!hospital) {
        throw new Error("Hospital not found");
    }

    hospital.activeStatus = !hospital.activeStatus;
    await hospital.save();

    return hospital;
};

const Hospital = mongoose.model("Hospital", hospitalSchema);

export default Hospital;