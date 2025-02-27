import { useState, useEffect } from "react";

export const useHealthEvaluation = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Fetch all evaluations
  const fetchEvaluations = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/healthEvaluation");
      if (!response.ok) throw new Error("Failed to fetch evaluations");
      const data = await response.json();
      setEvaluations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch a single evaluation by ID
  const fetchEvaluationById = async (id) => {
    try {
      const response = await fetch(`/api/healthEvaluation/${id}`);
      if (!response.ok) throw new Error("Failed to fetch evaluation");
      return await response.json();
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  // ✅ Create a new evaluation
  const createEvaluation = async (evaluationData) => {
    try {
      const response = await fetch("/api/healthEvaluation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(evaluationData),
      });
      if (!response.ok) throw new Error("Failed to create evaluation");
      const newEvaluation = await response.json();
      setEvaluations((prev) => [...prev, newEvaluation]);
    } catch (err) {
      setError(err.message);
    }
  };

  // ✅ Update only date & time
  const updateEvaluationDateTime = async (id, evaluationDate, evaluationTime) => {
    try {
      const response = await fetch(`/api/healthEvaluation/${id}/date-time`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ evaluationDate, evaluationTime }),
      });
      if (!response.ok) throw new Error("Failed to update date/time");
      const updatedEvaluation = await response.json();
      setEvaluations((prev) =>
        prev.map((evaluation) => (evaluation._id === id ? updatedEvaluation : evaluation))
      );
    } catch (err) {
      console.error(err.message);
    }
  };

  // ✅ Cancel evaluation
  const cancelEvaluation = async (id) => {
    try {
      const response = await fetch(`/api/healthEvaluation/${id}/cancel`, { method: "PATCH" });
      if (!response.ok) throw new Error("Failed to cancel evaluation");
      const canceledEvaluation = await response.json();
      setEvaluations((prev) =>
        prev.map((evaluation) => (evaluation._id === id ? canceledEvaluation : evaluation))
      );
    } catch (err) {
      console.error(err.message);
    }
  };

  // ✅ Delete an evaluation
  const deleteEvaluation = async (id) => {
    try {
      const response = await fetch(`/api/healthEvaluation/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete evaluation");
      setEvaluations((prev) => prev.filter((evaluation) => evaluation._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch evaluations when the hook is used
  useEffect(() => {
    fetchEvaluations();
  }, []);

  return {
    evaluations,
    fetchEvaluations,
    fetchEvaluationById,
    createEvaluation,
    updateEvaluationDateTime,
    cancelEvaluation,
    deleteEvaluation,
  };
};
