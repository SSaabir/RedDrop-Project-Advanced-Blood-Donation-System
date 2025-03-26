import { useState, useEffect } from "react";

export const useEmergencyBR = () => {
    const [emergencyRequests, setEmergencyRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch all emergency requests
    const fetchEmergencyRequests = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("/api/emergencyBR");
            if (!response.ok) throw new Error("Failed to fetch emergency requests.");
            const data = await response.json();
            setEmergencyRequests(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch a single emergency request by ID
    const fetchEmergencyRequestById = async (id) => {
        try {
            const response = await fetch(`/api/emergencyBR/${id}`);
            if (!response.ok) throw new Error("Failed to fetch emergency request.");
            return await response.json();
        } catch (err) {
            setError(err.message);
            return null;
        }
    };

    // Create a new emergency request
    const createEmergencyRequest = async (requestData) => {
        setLoading(true);
        try {
            const response = await fetch("/api/emergencyBR", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestData),
            });
            if (!response.ok) throw new Error("Failed to create emergency request.");
            const newRequest = await response.json();
            setEmergencyRequests((prev) => [...prev, newRequest]);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Delete an emergency request
    const deleteEmergencyRequest = async (id) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/emergencyBR/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete emergency request.");
            setEmergencyRequests((prev) => prev.filter((request) => request._id !== id));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Accept an emergency request
    const acceptEmergencyRequest = async (id) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/emergencyBR/${id}/accept`, { method: "PUT" });
            if (!response.ok) throw new Error("Failed to accept emergency request.");
            const updatedRequest = await response.json();
            setEmergencyRequests((prev) =>
                prev.map((request) => (request._id === id ? updatedRequest : request))
            );
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Decline an emergency request
    const declineEmergencyRequest = async (id, reason) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/emergencyBR/${id}/decline`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reason }),
            });
            if (!response.ok) throw new Error("Failed to decline emergency request.");
            const updatedRequest = await response.json();
            setEmergencyRequests((prev) =>
                prev.map((request) => (request._id === id ? updatedRequest : request))
            );
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch emergency requests on mount
    useEffect(() => {
        fetchEmergencyRequests();
    }, []);

    return {
        emergencyRequests,
        loading,
        error,
        fetchEmergencyRequests,
        fetchEmergencyRequestById,
        createEmergencyRequest,
        deleteEmergencyRequest,
        acceptEmergencyRequest,
        declineEmergencyRequest,
    };
};
