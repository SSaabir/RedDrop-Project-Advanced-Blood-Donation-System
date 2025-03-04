import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs'; // Uncommented for password hashing
import validator from 'validator';
import moment from 'moment'; // Uncommented for DOB validation

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
            validator: (value) => /^\d{10}$/.test(value), // Assumes 10-digit phone numbers
            message: (props) => `${props.value} is not a valid phone number!`,
        },
    },
    image: {
        type: String, // URL or file path for the image
        required: false,
    },
    dob: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return moment().diff(value, 'years') >= 18; // User must be at least 18
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
        default: true, // Default to active
    },
}, {timestamps: true});


// Signin method
hospitalAdminSchema.statics.signin = async function (email, password) {
    if (!email || !password) {
        throw new Error("All Fields are Required");
    }

    const hospitalAdmin = await this.findOne({ email });

    if (!hospitalAdmin) {
        throw new Error('Incorrect Email');
    }

    const match = (password === hospitalAdmin.password);

    if (!match) {
        throw new Error('Incorrect Password');
    }

    return hospitalAdmin;
}

const HospitalAdmin = mongoose.model('HospitalAdmin', hospitalAdminSchema);

export default HospitalAdmin;
