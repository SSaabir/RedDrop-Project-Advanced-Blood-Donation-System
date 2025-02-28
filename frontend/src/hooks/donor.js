import { useState, useEffect } from "react";

export const useDonor = () => {
    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // ✅ Fetch all donors
    const fetchDonors = async() => {
        setLoading(true);
        try {
            const response = await fetch("/api/donor");
            if (!response.ok) throw new Error("Failed to fetch donors");
            const data = await response.json();
            setDonors(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Fetch a single donor by ID
    const fetchDonorById = async(id) => {
        try {
            const response = await fetch(`/api/donor/${id}`);
            if (!response.ok) throw new Error("Failed to fetch donor");
            return await response.json();
        } catch (err) {
            setError(err.message);
            return null;
        }
    };

    // ✅ Create a new donor
    const createDonor = async(donorData) => {
        try {
            const response = await fetch("/api/donor", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(donorData),
            });
            if (!response.ok) throw new Error("Failed to create donor");
            const newDonor = await response.json();
            setDonors((prev) => [...prev, newDonor]);
        } catch (err) {
            setError(err.message);
        }
    };

    // ✅ Update donor details
    const updateDonor = async(id, donorData) => {
        try {
            const response = await fetch(`/api/donor/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(donorData),
            });
            if (!response.ok) throw new Error("Failed to update donor");
            const updatedDonor = await response.json();
            setDonors((prev) =>
                prev.map((donor) => (donor._id === id ? updatedDonor : donor))
            );
        } catch (err) {
            console.error(err.message);
        }
    };

    // ✅ Delete a donor
    const deleteDonor = async(id) => {
        try {
            const response = await fetch(`/api/donor/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete donor");
            setDonors((prev) => prev.filter((donor) => donor._id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    // Fetch donors when the hook is used
    useEffect(() => {
        fetchDonors();
    }, []);

    return {
        donors,
        fetchDonors,
        fetchDonorById,
        createDonor,
        updateDonor,
        deleteDonor,
    };
};