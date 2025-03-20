import { useState, useEffect } from "react";

export const useSystemManager = () => {
    const [managers, setManagers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // ✅ Fetch all system managers
    const fetchManagers = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/system-managers");
            if (!response.ok) throw new Error("Failed to fetch managers");
            const data = await response.json();
            setManagers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Fetch a single system manager by ID
    const fetchManagerById = async (id) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/system-managers/${id}`);
            if (!response.ok) throw new Error("Failed to fetch manager");
            const data = await response.json();
            setManagers([data]);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Create a new system manager
    const createManager = async (formData) => {
        setLoading(true);
        try {
            const response = await fetch("/api/system-managers", {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) throw new Error("Failed to create manager");
            const newManager = await response.json();
            setManagers((prev) => [...prev, newManager]);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Update system manager details
    const updateManager = async (id, formData) => {
        setLoading(true);
        try {
            console.log('Updating manager with ID:', id, 'Data:', [...formData.entries()]);
            const response = await fetch(`/api/system-managers/${id}`, {
                method: 'PUT',
                body: formData,
            });
            if (!response.ok) throw new Error("Failed to update manager");
            const updatedManager = await response.json();
            setManagers((prev) =>
                prev.map((manager) => (manager._id === id ? updatedManager : manager))
            );
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Delete a system manager
    const deleteManager = async (id) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/system-managers/${id}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Failed to delete manager");
            setManagers((prev) => prev.filter((manager) => manager._id !== id));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Activate/Deactivate system manager
    const activateDeactivateManager = async (id) => {
        setLoading(true);
        try {
            console.log('Toggling status for manager ID:', id);
            const response = await fetch(`/api/system-managers/${id}/toggle-status`, {
                method: 'PATCH',
            });
            if (!response.ok) throw new Error("Failed to toggle manager status");
            const updatedManager = await response.json();
            setManagers((prev) =>
                prev.map((manager) =>
                    manager._id === id ? { ...manager, activeStatus: updatedManager.activeStatus } : manager
                )
            );
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return {
        managers,
        loading,
        error,
        activateDeactivateManager,
        fetchManagers,
        fetchManagerById,
        createManager,
        updateManager,
        deleteManager,
    };
};
