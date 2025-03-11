import { useState } from 'react';

export const useHospitalAdmin = () => {
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
        try {
            const response = await fetch(`/api/healthAd/${id}`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Something went wrong');
            setHospitalAdmins([data]);
        } catch (err) {
            setError(err.message);
        } 
    };

    // Create a new hospital admin
    const createHospitalAdmin = async (formData) => {
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
        }
    };

    // Update hospital admin details
    const updateHospitalAdmin = async (id, formData) => {
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
        }
    };

    // Delete a hospital admin
    const deleteHospitalAdmin = async (id) => {
        try {
            const response = await fetch(`/api/healthAd/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete admin');
            setHospitalAdmins(prevAdmins => prevAdmins.filter(admin => admin._id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    const activateDeactivateHospitalAdmin = async (id) => {
        try {
          console.log('Toggling status for hospital admin ID:', id);
          const response = await fetch(`/api/healthAd/${id}/toggle-status`, {
            method: 'PATCH',
          });
          const result = await response.json();
          console.log('Toggle response:', response.status, result);
          if (!response.ok) throw new Error(result.message || "Failed to toggle hospital admin status");
          setHospitalAdmins((prev) =>
            prev.map((admin) =>
              admin._id === id ? { ...admin, activeStatus: !admin.activeStatus } : admin
            )
          );
        } catch (err) {
          console.error('ToggleHospitalAdmin error:', err.message);
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
        activateDeactivateHospitalAdmin
    };
};
