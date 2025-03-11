import { useState, useEffect } from "react";

export const useSystemManager = () => {
    const [managers, setManagers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // ✅ Fetch all system managers
    const fetchManagers = async () => {
        try {
            const response = await fetch("/api/manager");
            const data = await response.json();
            if (!response.ok) throw new Error("Failed to fetch managers");
            setManagers(data);
        } catch (err) {
            setError(err.message);
        }
    };

    // ✅ Fetch a single system manager by ID
    const fetchManagerById = async (id) => {
        try {
            const response = await fetch(`/api/manager/${id}`);
            if (!response.ok) throw new Error("Failed to fetch manager");
            const data = await response.json();
            setManagers([data])
        } catch (err) {
            setError(err.message);
        }
    };

    // ✅ Create a new system manager
    const createManager = async (formData) => {
        try {
            const response = await fetch("/api/manager", {
                method: 'POST',
                body: formData,
            });
            const newManager = await response.json();
            if (!response.ok) throw new Error("Failed to create manager");
            setManagers((prev) => [...prev, newManager]);
        } catch (err) {
            setError(err.message);
        }
    };

    // ✅ Update system manager details
    const updateManager = async (id, formData) => {
        try {
            console.log('Updating manager with ID:', id, 'Data:', [...formData.entries()]);
            const response = await fetch(`/api/manager/${id}`, {
                method: 'PUT',
                body: formData,
            });
            const updatedManager = await response.json();
            console.log('Response:', response.status, updatedManager);
            if (!response.ok) throw new Error(updatedManager.message || "Failed to update manager");
            setManagers((prev) =>
                prev.map((manager) => (manager._id === id ? updatedManager : manager))
            );
        } catch (err) {
            console.error('UpdateManager error:', err.message);
        }
    };

    // ✅ Delete a system manager
    const deleteManager = async (id) => {
        try {
            const response = await fetch(`/api/manager/${id}`, {method: "DELETE" });
            if (!response.ok) throw new Error("Failed to delete manager");
            setManagers((prev) => prev.filter((manager) => manager._id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    const activateDeactivateManager = async (id) => {
        console.log('useSystemManager initialized');
        try {
            console.log('Toggling status for manager ID:', id);
            const response = await fetch(`/api/manager/${id}/toggle-status`, {
                method: 'PATCH',
            });
            const result = await response.json();
            console.log('Toggle response:', response.status, result);
            if (!response.ok) throw new Error(result.message || "Failed to toggle manager status");
            setManagers((prev) =>
                prev.map((manager) => 
                    manager._id === id ? { ...manager, activeStatus: !manager.activeStatus } : manager
                )
            );
        } catch (err) {
            console.error('ToggleManager error:', err.message);
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
