import { useState, useEffect } from "react";

export const useHospital = () => {
    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch all hospitals
    const fetchHospitals = async() => {
        setLoading(false);
        try {
            const response = await fetch("/api/hospital");
            if (!response.ok) throw new Error("Failed to fetch hospitals");
            const data = await response.json();
            setHospitals(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch a single hospital by ID
    const fetchHospitalById = async(id) => {
        setLoading(false);
        try {
            const response = await fetch(`/api/hospital/${id}`);
            if (!response.ok) throw new Error("Failed to fetch hospital");
            const data = await response.json();
            return data;
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Create a new hospital
    const createHospital = async(hospitalData) => {
        setLoading(true);
        try {
            const response = await fetch("/api/hospital", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(hospitalData),
            });
            if (!response.ok) throw new Error("Failed to create hospital");
            const newHospital = await response.json();
            setHospitals((prev) => [...prev, newHospital]);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Update hospital details
    const updateHospital = async(id, hospitalData) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/hospital/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(hospitalData),
            });
            if (!response.ok) throw new Error("Failed to update hospital");
            const updatedHospital = await response.json();
            setHospitals((prev) =>
                prev.map((hospital) => (hospital._id === id ? updatedHospital : hospital))
            );
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Delete a hospital
    const deleteHospital = async(id) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/hospital/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete hospital");
            setHospitals((prev) => prev.filter((hospital) => hospital._id !== id));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Activate/Deactivate a hospital
    const activateDeactivateHospital = async(id) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/hospital/${id}/toggle-status`, {
                method: "PATCH",
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Failed to toggle hospital status");

            setHospitals((prev) =>
                prev.map((hospital) =>
                    hospital._id === id ? {...hospital, activeStatus: !hospital.activeStatus } : hospital
                )
            );
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHospitals();
    }, []);

    return {
        hospitals,
        loading,
        error,
        fetchHospitals,
        fetchHospitalById,
        createHospital,
        updateHospital,
        deleteHospital,
        activateDeactivateHospital,
    };
};