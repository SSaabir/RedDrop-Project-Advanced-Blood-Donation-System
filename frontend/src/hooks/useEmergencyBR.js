import { useState, useEffect, useCallback } from "react";

export const useEmergencyBR = () => {
    const [emergencyRequests, setEmergencyRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // ✅ Fetch all emergency requests
    const fetchEmergencyRequests = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("/api/emergencyBR");
            if (!response.ok) throw new Error("Failed to fetch emergency requests");
            const data = await response.json();
            setEmergencyRequests(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // ✅ Fetch a single emergency request by ID
    const fetchEmergencyRequestById = async (id) => {
        try {
            const response = await fetch(`/api/emergencyBR/${id}`);
            if (!response.ok) throw new Error("Failed to fetch emergency request");
            return await response.json();
        } catch (err) {
            setError(err.message);
            return null;
        }
    };

    // ✅ Create a new emergency request with file upload
    const createEmergencyRequest = async (requestData, file) => {
        try {
            const formData = new FormData();
            Object.keys(requestData).forEach((key) => formData.append(key, requestData[key]));
            if (file) formData.append("proofDocument", file);

            const response = await fetch("/api/emergencyBR", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("Failed to create emergency request");
            const newRequest = await response.json();
            setEmergencyRequests((prev) => [...prev, newRequest]);
        } catch (err) {
            setError(err.message);
        }
    };

    // ✅ Update an emergency request with file upload
    const updateEmergencyRequest = async (id, requestData, file) => {
        try {
            const formData = new FormData();
            Object.keys(requestData).forEach((key) => formData.append(key, requestData[key]));
            if (file) formData.append("proofDocument", file);

            const response = await fetch(`/api/emergencyBR/${id}`, {
                method: "PUT",
                body: formData,
            });

            if (!response.ok) throw new Error("Failed to update emergency request");
            const updatedRequest = await response.json();
            setEmergencyRequests((prev) =>
                prev.map((request) => (request._id === id ? updatedRequest : request))
            );
        } catch (err) {
            setError(err.message);
        }
    };

    // ✅ Delete an emergency request
    const deleteEmergencyRequest = async (id) => {
        try {
            const response = await fetch(`/api/emergencyBR/${id}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Failed to delete emergency request");
            setEmergencyRequests((prev) => prev.filter((request) => request._id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    // ✅ Fetch emergency requests when the hook is used
    useEffect(() => {
        fetchEmergencyRequests();
    }, [fetchEmergencyRequests]);

    return {
        emergencyRequests,
        fetchEmergencyRequests,
        fetchEmergencyRequestById,
        createEmergencyRequest,
        updateEmergencyRequest,
        deleteEmergencyRequest,
        loading,
        error,
    };
};
