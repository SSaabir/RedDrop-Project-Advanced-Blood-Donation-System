import { useCallback, useState } from 'react';
import { handleError } from '../services/handleError';
import { toast } from 'react-toastify';

export const useHospitalAdmin = () => {
    const [hospitalAdmins, setHospitalAdmins] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch all hospital admins
    const fetchHospitalAdmins = useCallback( async () => {
        try {
            const response = await fetch('/api/healthAd');
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Something went wrong');
            setHospitalAdmins(data);
        } catch (err) {
            handleError(err);
        }
    },[]);

    // Fetch all hospital admins by hospital ID
    const fetchHospitalAdminsByHospitalId = useCallback( async (id) => {
        try {
            const response = await fetch(`/api/healthAd/hospital/${id}`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to fetch hospital admins');
            setHospitalAdmins(data);
        } catch (err) {
            handleError(err);
        }
    },[]);


    // Fetch a single hospital admin by ID
    const fetchHospitalAdminById = useCallback( async (id) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/healthAd/${id}`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Something went wrong');
            setHospitalAdmins([data]);
            toast.success('Hospital Admin fetched successfully!');
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    },[]);

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
            toast.success('Hospital Admin created successfully!');
        } catch (err) {
        handleError(err);  
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
            toast.success('Hospital Admin updated successfully!');
        } catch (err) {
            handleError(err); 
        }
    };

    // Delete a hospital admin
    const deleteHospitalAdmin = async (id) => {
        try {
            const response = await fetch(`/api/healthAd/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete admin');
            setHospitalAdmins(prevAdmins => prevAdmins.filter(admin => admin._id !== id));
            toast.success('Hospital Admin deleted successfully!');
        } catch (err) {
            handleError(err);
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
            handleError(err);    
        }
      };

    return {
        hospitalAdmins,
        loading,
        fetchHospitalAdmins,
        fetchHospitalAdminById,
        fetchHospitalAdminsByHospitalId,
        createHospitalAdmin,
        updateHospitalAdmin,
        deleteHospitalAdmin,
        activateDeactivateHospitalAdmin
    };
};
