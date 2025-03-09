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
      return null; // Avoid setting global error
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
      setEvaluations((prev) => [...prev, newEvaluation.data]);
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
      setError(err.message);
    }
  };

  // ✅ Cancel evaluation
  const cancelEvaluation = async (id, hospitalAdminId) => {
    try {
      const response = await fetch(`/api/healthEvaluation/${id}/cancel`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ hospitalAdminId }) // Send hospitalAdminId in the request body
      });
  
      if (!response.ok) throw new Error("Failed to cancel evaluation");
      const canceledEvaluation = await response.json();
      setEvaluations((prev) =>
        prev.map((evaluation) => (evaluation._id === id ? canceledEvaluation : evaluation))
      );
    } catch (err) {
      setError(err.message);
    }
  };
  

  // ✅ Accept evaluation
  const acceptEvaluation = async (id, hospitalAdminId) => {
    try {
      const response = await fetch(`/api/healthEvaluation/${id}/accept`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ hospitalAdminId }) // Send hospitalAdminId in the request body
      });
  
      if (!response.ok) throw new Error("Failed to accept evaluation");
      const acceptedEvaluation = await response.json();
      setEvaluations((prev) =>
        prev.map((evaluation) => (evaluation._id === id ? acceptedEvaluation : evaluation))
      );
    } catch (err) {
      setError(err.message);
    }
  };
  
  // ✅ Mark as arrived
  const arrivedForEvaluation = async (id, receiptNumber) => {
    try {
      const response = await fetch(`/api/healthEvaluation/${id}/arrived`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiptNumber }),
      });
      if (!response.ok) throw new Error("Failed to mark as arrived");
      const updatedEvaluation = await response.json();
      setEvaluations((prev) =>
        prev.map((evaluation) => (evaluation._id === id ? updatedEvaluation : evaluation))
      );
    } catch (err) {
      setError(err.message);
    }
  };

  // ✅ Complete evaluation
  const completeEvaluation = async (id, result) => {
    try {
      const response = await fetch(`/api/healthEvaluation/${id}/complete`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ result }),
      });
      if (!response.ok) throw new Error("Failed to complete evaluation");
      const updatedEvaluation = await response.json();
      setEvaluations((prev) =>
        prev.map((evaluation) => (evaluation._id === id ? updatedEvaluation : evaluation))
      );
    } catch (err) {
      setError(err.message);
    }
  };
//upload Evaluation File
  const uploadEvaluationFile = async (id, file, result) => {
    try {
      const formData = new FormData();
      formData.append("evaluationFile", file);
      formData.append("result", result); // Pass/Fail result
  
      const response = await fetch(`/api/healthEvaluation/${id}/complete`, {
        method: "PATCH",
        body: formData,
      });
  
      if (!response.ok) throw new Error("Failed to upload evaluation file");
  
      const updatedEvaluation = await response.json();
  
      // Update the evaluation list
      setEvaluations((prev) =>
        prev.map((evaluation) => (evaluation._id === id ? updatedEvaluation : evaluation))
      );
  
      return updatedEvaluation;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  // ✅ Delete an evaluation
  const deleteEvaluation = async (id) => {
    try {
      const response = await fetch(`/api/healthEvaluation/${id}`, { method: "DELETE" });
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
    loading,
    error,
    uploadEvaluationFile,
    fetchEvaluations,
    fetchEvaluationById,
    createEvaluation,
    updateEvaluationDateTime,
    cancelEvaluation,
    acceptEvaluation,
    arrivedForEvaluation,
    completeEvaluation,
    deleteEvaluation,
  };
};
