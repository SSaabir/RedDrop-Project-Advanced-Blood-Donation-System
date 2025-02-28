import mongoose from 'mongoose';
//import bcryptjs, { compare } from 'bcryptjs';
import validator from 'validator';
//import moment from 'moment'; // For DOB validation

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    /*
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
            validator: function (value) {
                // Simple phone number validation
                return /^\d{10}$/.test(value); // Assumes 10 digit phone numbers
            },
            message: props => `${props.value} is not a valid phone number!`
        },
    },

    
    address: {
        type: String,
        required: true,
    },
    image: {
        type: String,  // URL or file path for the image
        required: false,
    },
    dob: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                // Ensure DOB is at least 18 years ago
                const age = moment().diff(value, 'years');
                return age >= 18; // User must be 18 or older
            },
            message: props => `User must be at least 18 years old!`
        }
            
    }*/
}, {timestamps: true});


// Signin method
adminSchema.statics.signin = async function (email, password) {
    if (!email || !password) {
        throw new Error("All Fields are Required");
    }

    const admin = await this.findOne({ email });

    if (!admin) {
        throw new Error('Incorrect Email');
    }

    const match = (password === admin.password);

    if (!match) {
        throw new Error('Incorrect Password');
    }

    return Admin;
}

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;
