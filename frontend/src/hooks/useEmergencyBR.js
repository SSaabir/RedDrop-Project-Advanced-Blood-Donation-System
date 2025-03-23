import { useState, useEffect, useCallback } from "react";

export const useEmergencyBR = () => {
    const [emergencyRequests, setEmergencyRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // ✅ Fetch all emergency requests with optional filtering
    const fetchEmergencyRequests = useCallback(async (filters = {}) => {
        setLoading(true);
        setError(null);
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const response = await fetch(`/api/emergencyBR?${queryParams}`, {
                headers: { "Content-Type": "application/json" },
            });

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
            const response = await fetch(`/api/emergencyBR/${id}`, {
                headers: { "Content-Type": "application/json" },
            });
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
            Object.entries(requestData).forEach(([key, value]) => formData.append(key, value));
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
            Object.entries(requestData).forEach(([key, value]) => formData.append(key, value));
            if (file) formData.append("proofDocument", file);

            const response = await fetch(`/api/emergencyBR/${id}`, {
                method: "PUT",
                body: formData,
            });

            if (!response.ok) throw new Error("Failed to update emergency request");

            const updatedRequest = await response.json();
            setEmergencyRequests((prev) =>
                prev.map((request) => (request._id === updatedRequest._id ? updatedRequest : request))
            );
        } catch (err) {
            setError(err.message);
        }
    };

    // ✅ Delete an emergency request
    const deleteEmergencyRequest = async (id) => {
        try {
            const response = await fetch(`/api/emergencyBR/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });
            if (!response.ok) throw new Error("Failed to delete emergency request");

            setEmergencyRequests((prev) => prev.filter((request) => request._id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    // ✅ Accept an emergency request
    const acceptEmergencyRequest = async (id) => {
        try {
            const response = await fetch(`/api/emergencyBR/${id}/accept`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "accepted" }),
            });

            if (!response.ok) throw new Error("Failed to accept emergency request");

            const updatedRequest = await response.json();
            setEmergencyRequests((prev) =>
                prev.map((request) => (request._id === updatedRequest._id ? updatedRequest : request))
            );
        } catch (err) {
            setError(err.message);
        }
    };

    // ✅ Decline an emergency request
    const declineEmergencyRequest = async (id) => {
        try {
            const response = await fetch(`/api/emergencyBR/${id}/decline`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "declined" }),
            });

            if (!response.ok) throw new Error("Failed to decline emergency request");

            const updatedRequest = await response.json();
            setEmergencyRequests((prev) =>
                prev.map((request) => (request._id === updatedRequest._id ? updatedRequest : request))
            );
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
        acceptEmergencyRequest,
        declineEmergencyRequest,
        loading,
        error,
    };
};
