import { useState } from "react";

export const useDonor = () => {
    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch all donors
    const fetchDonors = async() => {
        setLoading(false);
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

    // Fetch a single donor by ID
    const fetchDonorById = async(id) => {
        setLoading(false);
        try {
            const response = await fetch(`/api/donor/${id}`);
            if (!response.ok) throw new Error("Failed to fetch donor");
            const data = await response.json();
            setDonors([data]);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Create a new donor
    const createDonor = async(donorData) => {
        try {
            const response = await fetch("/api/donor", {
                method: "POST",
                body: donorData,
            });

            const newDonor = await response.json();
            if (!response.ok) throw new Error(newDonor.message || 'Failed to create admin');
            setDonors((prev) => [...prev, newDonor]);
        } catch (err) {
            setError(err.message);
        }
    };

    // Update donor details
    const updateDonor = async(id, donorData) => {
        setLoading(true);
        try {
            const formData = new FormData();
            for (const key in donorData) {
                formData.append(key, donorData[key]);
            }

            const response = await fetch(`/api/donor/${id}`, {
                method: "PUT",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to update donor");
            }

            const updatedDonor = await response.json();
            setDonors((prev) =>
                prev.map((donor) => (donor._id === id ? updatedDonor : donor))
            );
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Delete a donor
    const deleteDonor = async(id) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/donor/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("Failed to delete donor");
            }
            setDonors((prev) => prev.filter((donor) => donor._id !== id));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Activate/Deactivate a donor
    const activateDeactivateDonor = async(id) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/donor/${id}/toggle-status`, {
                method: "PATCH",
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Failed to toggle donor status");

            setDonors((prev) =>
                prev.map((donor) =>
                    donor._id === id ? {...donor, activeStatus: !donor.activeStatus } : donor
                )
            );
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return {
        donors,
        loading,
        error,
        fetchDonors,
        fetchDonorById,
        createDonor,
        updateDonor,
        deleteDonor,
        activateDeactivateDonor,
    };
};