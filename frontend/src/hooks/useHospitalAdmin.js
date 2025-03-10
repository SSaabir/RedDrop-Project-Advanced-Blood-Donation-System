import { useState } from 'react';

const useHospitalAdmin = () => {
    const [hospitalAdmins, setHospitalAdmins] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch all hospital admins
    const fetchHospitalAdmins = async () => {
        try {
            const response = await fetch('/api/healthAd');
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Something went wrong');
            setHospitalAdmins(data);
        } catch (err) {
            setError(err.message);
        }
    };

    // Fetch a single hospital admin by ID
    const fetchHospitalAdminById = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/healthAd/${id}`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Something went wrong');
            setHospitalAdmins([data]);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Create a new hospital admin
    const createHospitalAdmin = async (formData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/healthAd', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data?.message || 'Failed to create admin');
            setHospitalAdmins(prevAdmins => [...prevAdmins, data]);
        } catch (err) {
            setError(err?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    // Update hospital admin details
    const updateHospitalAdmin = async (id, formData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/healthAd/${id}`, {
                method: 'PUT',
                body: formData,
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data?.message || 'Failed to update admin');
            setHospitalAdmins(prevAdmins =>
                prevAdmins.map(admin => (admin._id === id ? data : admin))
            );
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Delete a hospital admin
    const deleteHospitalAdmin = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/healthAd/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete admin');
            setHospitalAdmins(prevAdmins => prevAdmins.filter(admin => admin._id !== id));
        } catch (err) {
            setError(err.message);
        } finally {
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