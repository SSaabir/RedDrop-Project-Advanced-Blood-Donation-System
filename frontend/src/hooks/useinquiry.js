import { useState, useEffect } from "react";

export const useInquiry = () => {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

// Fetch all inquiries
const fetchInquiries = async () => {
    setLoading(true);
    setError(null); // Reset error before making the request
    try {
        const response = await fetch("/api/inquiry");
        if (!response.ok) throw new Error("Failed to fetch inquiries");
        const data = await response.json();
        setInquiries(data);
    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
};

// Use effect to fetch inquiries once on mount
useEffect(() => {
    fetchInquiries();  // Fetch inquiries when the component is mounted
}, []); // Empty dependency array to run it only once


    // Fetch a single inquiry by ID
    const fetchInquiryById = async (id) => {
        try {
            const response = await fetch(`/api/inquiry/${id}`);
            if (!response.ok) throw new Error("Failed to fetch inquiry");
            return await response.json();
        } catch (err) {
            setError(err.message);
            return null;
        }
    };

    // Create a new inquiry
    const createInquiry = async (inquiryData) => {
        try {
            const response = await fetch("/api/inquiry", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(inquiryData),
            });
            if (!response.ok) throw new Error("Failed to create inquiry");
            const newInquiry = await response.json();
            setInquiries((prev) => [...prev, newInquiry]);
        } catch (err) {
            setError(err.message);
        }
    };

    // Update an inquiry's status
    const updateInquiryStatus = async (id, status) => {
        try {
            const response = await fetch(`/api/inquiry/${id}`, {  // Remove "/status"
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            if (!response.ok) throw new Error("Failed to update inquiry status");
            const updatedInquiry = await response.json();
            setInquiries((prev) =>
                prev.map((inquiry) => (inquiry._id === id ? updatedInquiry.inquiry : inquiry)) // Adjust to match response structure
            );
        } catch (err) {
            setError(err.message);  // Set error state instead of console.error
        }
    };

    // Delete an inquiry
    const deleteInquiry = async (id) => {
        try {
            const response = await fetch(`/api/inquiry/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete inquiry");
            setInquiries((prev) => prev.filter((inquiry) => inquiry._id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    // Fetch inquiries when the hook is used (only once on mount)
    useEffect(() => {
        fetchInquiries();
    }, []); // Dependency array empty to run only once on component mount

    return {
        inquiries,
        loading,
        error,
        fetchInquiries,  // Return the fetch function for manual refetching if needed
        fetchInquiryById,
        createInquiry,
        updateInquiryStatus,
        deleteInquiry,
    };
};
