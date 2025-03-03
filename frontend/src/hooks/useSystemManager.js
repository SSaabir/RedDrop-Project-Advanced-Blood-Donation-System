import { useState, useEffect } from "react";

export const useSystemManager = () => {
    const [managers, setManagers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // ✅ Fetch all system managers
    const fetchManagers = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/manager");
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
        try {
            const response = await fetch(`/api/manager/${id}`);
            if (!response.ok) throw new Error("Failed to fetch manager");
            return await response.json();
        } catch (err) {
            setError(err.message);
            return null;
        }
    };

    // ✅ Create a new system manager
    const createManager = async (managerData) => {
        try {
            const response = await fetch("/api/manager", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(managerData),
            });
            if (!response.ok) throw new Error("Failed to create manager");
            const newManager = await response.json();
            setManagers((prev) => [...prev, newManager]);
        } catch (err) {
            setError(err.message);
        }
    };

    // ✅ Update system manager details
    const updateManager = async (id, managerData) => {
        try {
            const response = await fetch(`/api/manager/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(managerData),
            });
            if (!response.ok) throw new Error("Failed to update manager");
            const updatedManager = await response.json();
            setManagers((prev) =>
                prev.map((manager) => (manager._id === id ? updatedManager : manager))
            );
        } catch (err) {
            console.error(err.message);
        }
    };

    // ✅ Delete a system manager
    const deleteManager = async (id) => {
        try {
            const response = await fetch(`/api/manager/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete manager");
            setManagers((prev) => prev.filter((manager) => manager._id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    // Fetch managers when the hook is used
    useEffect(() => {
        fetchManagers();
    }, []);

    return {
        managers,
        fetchManagers,
        fetchManagerById,
        createManager,
        updateManager,
        deleteManager,
    };
};
