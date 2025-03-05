import { useState } from 'react';
import axios from 'axios';

const useHospitalAdmin = () => {
    const [hospitalAdmins, setHospitalAdmins] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch all hospital admins
    const fetchHospitalAdmins = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/hospitaladmins');
            setHospitalAdmins(response.data);
            setLoading(false);
        } catch (err) {
            setError('Error fetching hospital admins');
            setLoading(false);
        }
    };

    // Fetch a single hospital admin by ID
    const fetchHospitalAdminById = async (id) => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/hospitaladmins/${id}`);
            setHospitalAdmins([response.data]); // Assuming you want to overwrite the state with single hospital admin
            setLoading(false);
        } catch (err) {
            setError('Error fetching hospital admin');
            setLoading(false);
        }
    };

    // Create a new hospital admin
    const createHospitalAdmin = async (adminData) => {
        setLoading(true);
        try {
            const response = await axios.post('/api/hospitaladmins', adminData);
            setHospitalAdmins([...hospitalAdmins, response.data]); // Append the new admin
            setLoading(false);
        } catch (err) {
            setError('Error creating hospital admin');
            setLoading(false);
        }
    };

    // Update hospital admin details
    const updateHospitalAdmin = async (id, adminData) => {
        setLoading(true);
        try {
            const response = await axios.put(`/api/hospitaladmins/${id}`, adminData);
            setHospitalAdmins(hospitalAdmins.map(admin => admin._id === id ? response.data : admin));
            setLoading(false);
        } catch (err) {
            setError('Error updating hospital admin');
            setLoading(false);
        }
    };

    // Delete a hospital admin
    const deleteHospitalAdmin = async (id) => {
        setLoading(true);
        try {
            await axios.delete(`/api/hospitaladmins/${id}`);
            setHospitalAdmins(hospitalAdmins.filter(admin => admin._id !== id)); // Remove the deleted admin
            setLoading(false);
        } catch (err) {
            setError('Error deleting hospital admin');
            setLoading(false);
        }
    };

    return {
        hospitalAdmins,
        loading,
        error,
        fetchHospitalAdmins,
        fetchHospitalAdminById,
        createHospitalAdmin,
        updateHospitalAdmin,
        deleteHospitalAdmin,
    };
};

export default useHospitalAdmin;
