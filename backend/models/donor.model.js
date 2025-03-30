import mongoose from "mongoose";
import validator from "validator";
import moment from "moment";

const donorSchema = new mongoose.Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    gender: { type: String, required: true, enum: ["Male", "Female", "Other"] },
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
    password: { type: String, required: true },
    dob: {
        type: Date,
        required: true,
        validate: {
            validator: (value) => moment().diff(value, "years") >= 18,
            message: "Donor must be at least 18 years old!",
        },
    },
    bloodType: {
        type: String,
        required: true,
        enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
    },
    city: { type: String, required: true, trim: true },
    nic: { type: String, required: true, unique: true, trim: true },
    image: { type: String, required: false },
    activeStatus: { type: Boolean, default: true },
    healthStatus: { type: Boolean, default: false },
    appointmentStatus: { type: Boolean, default: false },
}, { timestamps: true });

// Signin method (plaintext comparison, to be updated with bcrypt later)
donorSchema.statics.signin = async function(email, password) {
    if (!email || !password) {
        throw new Error("All Fields are Required");
    }
    const donor = await this.findOne({ email });
    if (!donor) {
        throw new Error("Incorrect Email");
    }
    const match = (password === donor.password);
    if (!match) {
        throw new Error("Incorrect Password");
    }
    return donor;
};

const Donor = mongoose.model("Donor", donorSchema);

export default Donor;