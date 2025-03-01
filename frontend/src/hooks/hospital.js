    import { useState, useEffect } from "react";

export const useHospital = () => {
    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // ✅ Fetch all hospitals
    const fetchHospitals = async() => {
        setLoading(true);
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

    // ✅ Fetch a single hospital by ID
    const fetchHospitalById = async(id) => {
        try {
            const response = await fetch(`/api/hospital/${id}`);
            if (!response.ok) throw new Error("Failed to fetch hospital");
            return await response.json();
        } catch (err) {
            setError(err.message);
            return null;
        }
    };

    // ✅ Create a new hospital
    const createHospital = async(hospitalData) => {
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
        }
    };

    // ✅ Update hospital details
    const updateHospital = async(id, hospitalData) => {
        try {
            const response = await fetch(`/api/hospital/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(hospitalData),
            });
            if (!response.ok) throw new Error("Failed to update hospital");
            const updatedHospital = await response.json();
            setHospitals((prev) =>
                prev.map((hospital) => (hospital._id === id ? updatedHospital : hospital))
            );
        } catch (err) {
            console.error(err.message);
        }
    };

    // ✅ Delete a hospital
    const deleteHospital = async(id) => {
        try {
            const response = await fetch(`/api/hospital/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete hospital");
            setHospitals((prev) => prev.filter((hospital) => hospital._id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    // Fetch hospitals when the hook is used
    useEffect(() => {
        fetchHospitals();
    }, []);

    return {
        hospitals,
        fetchHospitals,
        fetchHospitalById,
        createHospital,
        updateHospital,
        deleteHospital,
    };
};