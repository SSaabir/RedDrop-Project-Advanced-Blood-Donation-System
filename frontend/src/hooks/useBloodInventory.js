import { useState, useEffect } from "react";

export const useBloodInventory = () => {
    const [bloodInventory, setBloodInventory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    //  Fetch all blood inventory records
    const fetchBloodInventory = useCallback(async() => {
        setLoading(true);

        try {
            const response = await fetch("/api/blood-inventory");
            if (!response.ok) throw new Error("Failed to fetch blood inventory records.");
            const data = await response.json();
            setBloodInventory(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    //  Fetch all blood inventory by HospitalId
    const fetchBloodInventoryByHospital = useCallback(async(id) => {
        setLoading(true);

        try {
            const response = await fetch(`/api/blood-inventory/hospital/${id}`);
            if (!response.ok) throw new Error("Failed to fetch blood inventory records.");
            const data = await response.json();
            setBloodInventory(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    //  Fetch a single blood inventory record by ID
    const fetchBloodInventoryById = useCallback(async(id) => {
        setError(null);
        try {
            const response = await fetch(`/api/blood-inventory/${id}`);
            if (!response.ok) throw new Error("Failed to fetch blood inventory record.");
            return await response.json();
        } catch (err) {
            setError(err.message);
            return null;
        }
    }, []);

    //  Create a new blood inventory record
    const createBloodInventory = async(inventoryData) => {

        try {
            const response = await fetch("/api/blood-inventory", {

                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(inventoryData),
            });
            if (!response.ok) throw new Error("Failed to create blood inventory record.");
            const newIventory = await response.json();
            setBloodInventory((prev) => [...prev, newIventory.data]);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    //  Update a blood inventory record
    const updateBloodInventory = async(id, inventoryData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/blood-inventory/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(inventoryData),
            });
            if (!response.ok) throw new Error("Failed to update blood inventory record.");
            const updatedRecord = await response.json();
            setBloodInventory((prev) =>
                prev.map((record) => (record._id === id ? updatedRecord : record))
            );
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    //  Delete a blood inventory record
    const deleteBloodInventory = async(id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/blood-inventory/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete blood inventory record.");
            setBloodInventory((prev) => prev.filter((record) => record._id !== id));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleExpired = async(id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/blood-inventory/toggle-expired/${id}`, {
                method: "PATCH",
            });
            if (!response.ok) throw new Error("Failed to toggle expired status.");
            const updatedRecord = await response.json();
            setBloodInventory((prev) =>
                prev.map((record) => (record._id === id ? updatedRecord : record))
            );
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return {
        bloodInventory,
        loading,
        error,
        fetchBloodInventory,
        fetchBloodInventoryById,
        fetchBloodInventoryByHospital,
        createBloodInventory,
        updateBloodInventory,
        deleteBloodInventory,
        toggleExpired
    };
};