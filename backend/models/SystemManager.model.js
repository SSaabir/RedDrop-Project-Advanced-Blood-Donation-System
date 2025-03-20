import mongoose from 'mongoose';
//import bcryptjs, { compare } from 'bcryptjs';
import validator from 'validator';
//import moment from 'moment'; // For DOB validation

const systemManagerSchema = new mongoose.Schema({
        email: {
          type: String,
          required: true,
          unique: true,
          validate: {
            validator: (value) => /\S+@\S+\.\S+/.test(value), // Basic email validation
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
              return new Date().getFullYear() - value.getFullYear() >= 18; // Ensure 18+ age
            },
            message: (props) => `User must be at least 18 years old!`,
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
}, {timestamps: true});


// Signin method
systemManagerSchema.statics.signin = async function (email, password) {
    if (!email || !password) {
        throw new Error("All Fields are Required");
    }

    const manager = await this.findOne({ email });

    if (!manager) {
        throw new Error('Incorrect Email');
    }

    const match = (password === manager.password);

    if (!match) {
        throw new Error('Incorrect Password');
    }

    return manager;
}

const Manager = mongoose.model('Manager', systemManagerSchema);

export default Manager;