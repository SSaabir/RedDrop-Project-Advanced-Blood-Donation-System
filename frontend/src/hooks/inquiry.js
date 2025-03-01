import { useState, useEffect } from "react";

export const useInquiry = () => {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // ✅ Fetch all inquiries
    const fetchInquiries = async () => {
        setLoading(true);
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

    // ✅ Fetch a single inquiry by ID
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

    // ✅ Create a new inquiry
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

    // ✅ Update an inquiry
    const updateInquiry = async (id, inquiryData) => {
        try {
            const response = await fetch(`/api/inquiry/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(inquiryData),
            });
            if (!response.ok) throw new Error("Failed to update inquiry");
            const updatedInquiry = await response.json();
            setInquiries((prev) =>
                prev.map((inquiry) => (inquiry._id === id ? updatedInquiry : inquiry))
            );
        } catch (err) {
            console.error(err.message);
        }
    };

    // ✅ Delete an inquiry
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

    // Fetch inquiries when the hook is used
    useEffect(() => {
        fetchInquiries();
    }, []);

    return {
        inquiries,
        loading,
        error,
        fetchInquiries,
        fetchInquiryById,
        createInquiry,
        updateInquiry,
        deleteInquiry,
    };
};
