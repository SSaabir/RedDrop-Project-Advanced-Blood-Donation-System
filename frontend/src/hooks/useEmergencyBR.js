import { useState, useEffect } from "react";

export const useEmergencyBR = () => {
    const [emergencyRequests, setEmergencyRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch all emergency requests
    const fetchEmergencyRequests = async () => {
        setError(null);
        try {
            const response = await fetch("/api/emergency-requests");
            if (!response.ok) throw new Error("Failed to fetch emergency requests.");
            const data = await response.json();
            setEmergencyRequests(data);
        } catch (err) {
            setError(err.message);
        }
    };

    // Fetch a single emergency request by ID
    const fetchEmergencyRequestById = async (id) => {
        try {
            const response = await fetch(`/api/emergency-requests/${id}`);
            if (!response.ok) throw new Error("Failed to fetch emergency request.");
            return await response.json();
        } catch (err) {
            setError(err.message);
            return null;
        }
    };

    // Create a new emergency request (with file upload support)
    const createEmergencyRequest = async (requestData, proofDocumentFile) => {
        console.log("first: ",requestData);
        try {
            const formData = new FormData();
            // Append all fields from requestData
            Object.keys(requestData).forEach((key) => {
                formData.append(key, requestData[key]);
            });
            // Append file if provided
            if (proofDocumentFile) {
                formData.append("proofDocument", proofDocumentFile);
            }

            const response = await fetch("/api/emergency-requests", {
                method: "POST",
                body: formData, 
            });
            if (!response.ok) throw new Error("Failed to create emergency request.");
            const newRequest = await response.json();
            console.log("second:", formData);
            setEmergencyRequests((prev) => [...prev, newRequest]);
            return newRequest;
        } catch (err) {
            setError(err.message);
            return null;
        }
    };

    // Delete an emergency request
    const deleteEmergencyRequest = async (id) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/emergency-requests/${id}`, {
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

    // Validate (activate) an emergency request
    const validateEmergencyRequest = async (id) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/emergency-requests/${id}/validate`, {
                method: "PUT",
            });
            if (!response.ok) throw new Error("Failed to validate emergency request.");
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

    // Accept an emergency request
    const acceptEmergencyRequest = async (id, acceptedBy, acceptedByType) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/emergency-requests/${id}/accept`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ acceptedBy, acceptedByType }),
            });
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
    const declineEmergencyRequest = async (id, declineReason) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/emergency-requests/${id}/decline`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ declineReason }),
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
   
    return {
        emergencyRequests,
        loading,
        error,
        fetchEmergencyRequests,
        fetchEmergencyRequestById,
        createEmergencyRequest,
        deleteEmergencyRequest,
        validateEmergencyRequest,
        acceptEmergencyRequest,
        declineEmergencyRequest,
    };
};