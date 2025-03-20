import mongoose from 'mongoose';
import validator from 'validator';

const systemManagerSchema = new mongoose.Schema({
    systemManagerId: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(),
        unique: true,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (value) => validator.isEmail(value),
            message: (props) => `${props.value} is not a valid email!`,
        },
    },
    password: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
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
    nic: {
        type: String,
        required: true,
        unique: true,
    },
    address: {
        type: String,
        required: true,
    },
    image: {
        type: String, // URL or file path
        required: false,
    },
    dob: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return new Date().getFullYear() - value.getFullYear() >= 18;
            },
            message: () => `User must be at least 18 years old!`,
        },
    },
    role: {
        type: String,
        enum: ["Master", "Junior"],
        required: true,
    },
    activeStatus: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

// Sign-in method
systemManagerSchema.statics.signin = async function (email, password) {
    if (!email || !password) {
        throw new Error("All fields are required");
    }

    const manager = await this.findOne({ email });
    if (!manager) {
        throw new Error('Incorrect email');
    }

    const match = password === manager.password; // Replace with bcrypt comparison if hashing is used
    if (!match) {
        throw new Error('Incorrect password');
    }

    return manager;
};

const Manager = mongoose.model('Manager', systemManagerSchema);

export default Manager;

