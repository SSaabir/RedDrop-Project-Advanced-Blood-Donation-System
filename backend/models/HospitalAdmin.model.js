import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs'; // Kept imported but unused
import validator from 'validator';
import moment from 'moment';

const hospitalAdminSchema = new mongoose.Schema({
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
    image: {
        type: String,
        required: false,
    },
    nic: {
        type: String,
        required: true,
        unique: true, // Added unique constraint (optional)
    },
    address: {
        type: String,
        required: false,
    },
    dob: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return moment().diff(value, 'years') >= 18;
            },
            message: 'User must be at least 18 years old!',
        },
    },
    hospitalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
        required: true,
    },
    activeStatus: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

// Signin method (plaintext comparison, to be updated with bcrypt later)
hospitalAdminSchema.statics.signin = async function (email, password, hospitalId) {
    if (!email || !password || !hospitalId) {
        throw new Error("All fields are required");
    }
    const hospitalAdmin = await this.findOne({ email });
    if (!hospitalAdmin) {
        throw new Error('Incorrect email');
    }
    if (hospitalAdmin.hospitalId.toString() !== hospitalId) {
        throw new Error('Incorrect hospital ID');
    }
    const match = (password === hospitalAdmin.password);
    if (!match) {
        throw new Error('Incorrect password');
    }
    return hospitalAdmin;
};

const HospitalAdmin = mongoose.model('HospitalAdmin', hospitalAdminSchema);

export default HospitalAdmin;