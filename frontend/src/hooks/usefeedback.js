import { useState, useEffect, useCallback } from "react";

export const useFeedback = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch all feedback
    const fetchFeedbacks = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("/api/feedback");
            if (!response.ok) throw new Error("Failed to fetch feedback");
            const data = await response.json();
            setFeedbacks(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch a single feedback by ID
    const fetchFeedbackById = useCallback(async (id) => {
        try {
            const response = await fetch(`/api/feedback/${id}`);
            if (!response.ok) throw new Error("Failed to fetch feedback");
            return await response.json();
        } catch (err) {
            setError(err.message);
            return null;
        }
    }, []);

    // Create new feedback
    const createFeedback = useCallback(async (feedbackData) => {
        setLoading(true);
        console.log("Hooks: ",feedbackData);
        try {
            const response = await fetch("/api/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(feedbackData),
            });
            if (!response.ok) throw new Error("Failed to create feedback");
            const newFeedback = await response.json();
            setFeedbacks((prev) => [...prev, newFeedback]);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Update feedback details
    const updateFeedback = useCallback(async (id, feedbackData) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/feedback/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(feedbackData),
            });
            if (!response.ok) throw new Error("Failed to update feedback");
            const updatedFeedback = await response.json();
            setFeedbacks((prev) =>
                prev.map((feedback) => (feedback._id === id ? updatedFeedback : feedback))
            );
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Delete a feedback
    const deleteFeedback = useCallback(async (id) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/feedback/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete feedback");
            setFeedbacks((prev) => prev.filter((feedback) => feedback._id !== id));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch feedbacks when the hook is used
   
    return {
        feedbacks,
        loading,
        error,
        fetchFeedbacks,
        fetchFeedbackById,
        createFeedback,
        updateFeedback,
        deleteFeedback,
    };
};