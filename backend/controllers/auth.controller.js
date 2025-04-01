import Donor from '../models/donor.model.js';
import createToken from '../utils/token.js';
import Hospital from '../models/hospital.model.js';
import Manager from '../models/SystemManager.model.js';
import HospitalAdmin from '../models/HospitalAdmin.model.js';

export const signinHD = async (req, res) => {
    const { email, password, userId } = req.body;

    if (!email || !password || email === '' || password === '') {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const user = await HospitalAdmin.signin(email, password, userId);
        const role = 'HospitalAdmin';

        const token = createToken(user._id);
        const userObj = user.toObject();
        delete userObj.password;

        res.status(200).json({ token, userObj, role });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const signinD = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password || email === '' || password === '') {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const user = await Donor.signin(email, password);
        const role = 'Donor';

        const token = createToken(user._id);
        const userObj = user.toObject();
        delete userObj.password;

        res.status(200).json({ token, userObj, role });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const signinH = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password || email === '' || password === '') {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const user = await Hospital.signin(email, password);
        const role = 'Hospital';

        const token = createToken(user._id);
        const userObj = user.toObject();
        delete userObj.password;

        res.status(200).json({ token, userObj, role });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const signinA = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password || email === '' || password === '') {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const user = await Manager.signin(email, password);
        const role = 'Manager';

        const token = createToken(user._id);
        const userObj = user.toObject();
        delete userObj.password;

        res.status(200).json({ token, userObj, role });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};