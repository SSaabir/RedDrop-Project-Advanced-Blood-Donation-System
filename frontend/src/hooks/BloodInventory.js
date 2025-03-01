import { useState, useEffect } from "react";

export const useBloodInventory = () => {
    const [bloodInventory, setBloodInventory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    //  Fetch all blood inventory records
    const fetchBloodInventory = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/blood-inventory");
            if (!response.ok) throw new Error("Failed to fetch blood inventory");
            const data = await response.json();
            setBloodInventory(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    //  Fetch a single blood inventory record by ID
    const fetchBloodInventoryById = async (id) => {
        try {
            const response = await fetch(/api/blood-inventory/ $ ,{id});
            if (!response.ok) throw new Error("Failed to fetch blood inventory record");
            return await response.json();
        } catch (err) {
            setError(err.message);
            return null;
        }
    };

    //  Create a new blood inventory record
    const createBloodInventory = async (inventoryData) => {
        try {
            const response = await fetch("/api/blood-inventory", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(inventoryData),
            });
            if (!response.ok) throw new Error("Failed to create blood inventory record");
            const newRecord = await response.json();
            setBloodInventory((prev) => [...prev, newRecord]);
        } catch (err) {
            setError(err.message);
        }
    };

    //  Update a blood inventory record
    const updateBloodInventory = async (id, inventoryData) => {
        try {
            const response = await fetch(/api/blood-inventory/$ ,{id}, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(inventoryData),
            });
            if (!response.ok) throw new Error("Failed to update blood inventory record");
            const updatedRecord = await response.json();
            setBloodInventory((prev) =>
                prev.map((record) => (record._id === id ? updatedRecord : record))
            );
        } catch (err) {
            console.error(err.message);
        }
    };

    //  Delete a blood inventory record
    const deleteBloodInventory = async (id) => {
        try {
            const response = await fetch(/api/blood-inventory/$,{id}, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete blood inventory record");
            setBloodInventory((prev) => prev.filter((record) => record._id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    // Fetch blood inventory records when the hook is used
    useEffect(() => {
        fetchBloodInventory();
    }, []);

    return {
        bloodInventory,
        fetchBloodInventory,
        fetchBloodInventoryById,
        createBloodInventory,
        updateBloodInventory,
        deleteBloodInventory,
    };
};