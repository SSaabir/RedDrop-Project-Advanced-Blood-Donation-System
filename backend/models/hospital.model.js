import mongoose from 'mongoose';
import validator from 'validator';
import bcryptjs from "bcryptjs";

const hospitalSchema = new mongoose.Schema({
    systemManagerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SystemManager',
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
            message: 'Invalid email format',
        },
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: false,
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
        default: false,
    },
}, { timestamps: true });

// ✅ Signin method
hospitalSchema.statics.signin = async function(email, password) {
    if (!email || !password) {
        throw new Error("All Fields are Required");
    }

    const hospital = await this.findOne({ email });
    if (!hospital) {
        throw new Error("Incorrect Email");
    }

    const match = await bcryptjs.compare(password, hospital.password);
    if (!match) {
        throw new Error("Incorrect Password");
    }

    return hospital;
};

// ✅ Update hospital details
hospitalSchema.statics.updateHospital = async function(id, updateData) {
    const updatedHospital = await this.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedHospital) {
        throw new Error("Hospital not found");
    }
    return updatedHospital;
};

// ✅ Toggle active status
hospitalSchema.statics.toggleActiveStatus = async function(id) {
    const hospital = await this.findById(id);
    if (!hospital) {
        throw new Error("Hospital not found");
    }

    hospital.activeStatus = !hospital.activeStatus;
    await hospital.save();

    return hospital;
};

const Hospital = mongoose.model('Hospital', hospitalSchema);

export default Hospital;