import { useState, useEffect } from "react";
import { handleError } from "../services/handleError.js"; // Import the handleError function
import { toast } from "react-toastify";

export const useHealthEvaluation = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch all evaluations
  const fetchEvaluations = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/healthEvaluation");
      if (!response.ok) throw new Error("Failed to fetch evaluations");
      const data = await response.json();
      setEvaluations(data);
      toast.success("Evaluations fetched successfully!"); // Success toast
    } catch (err) {
      handleError(err); // Show error using handleError (toast)
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch evaluations by donor ID
  const fetchEvaluationByDonorId = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/healthEvaluation/donor/${id}`);
      if (!response.ok) throw new Error("Failed to fetch evaluations by donor");
      const data = await response.json();
      setEvaluations(data);
      toast.success("Evaluations by donor fetched successfully!"); // Success toast
    } catch (err) {
      handleError(err); // Show error using handleError (toast)
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch evaluations by hospital ID
  const fetchEvaluationByHospitalId = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/healthEvaluation/hospital/${id}`);
      if (!response.ok) throw new Error("Failed to fetch evaluations by hospital");
      const data = await response.json();
      setEvaluations(data);
      toast.success("Evaluations by hospital fetched successfully!"); // Success toast
    } catch (err) {
      handleError(err); // Show error using handleError (toast)
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch a single evaluation by ID
  const fetchEvaluationById = async (id) => {
    try {
      const response = await fetch(`/api/healthEvaluation/${id}`);
      if (!response.ok) throw new Error("Failed to fetch evaluation");
      const data = await response.json();
      toast.success("Evaluation fetched successfully!"); // Success toast
      return data;
    } catch (err) {
      handleError(err); // Show error using handleError (toast)
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
      setEvaluations((prev) => [...prev, newEvaluation.data]);
      toast.success("Evaluation created successfully!"); // Success toast
    } catch (err) {
      handleError(err); // Show error using handleError (toast)
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
      toast.success("Date and time updated successfully!"); // Success toast
    } catch (err) {
      handleError(err); // Show error using handleError (toast)
    }
  };

  // ✅ Cancel evaluation
  const cancelEvaluation = async (id, hospitalAdminId) => {
    try {
      const response = await fetch(`/api/healthEvaluation/${id}/cancel`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ hospitalAdminId }),
      });

      if (!response.ok) throw new Error("Failed to cancel evaluation");
      const canceledEvaluation = await response.json();
      setEvaluations((prev) =>
        prev.map((evaluation) => (evaluation._id === id ? canceledEvaluation : evaluation))
      );
      toast.success("Evaluation canceled successfully!"); // Success toast
    } catch (err) {
      handleError(err); // Show error using handleError (toast)
    }
  };

  // ✅ Accept evaluation
  const acceptEvaluation = async (id, hospitalAdminId) => {
    try {
      const response = await fetch(`/api/healthEvaluation/${id}/accept`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ hospitalAdminId }),
      });

      if (!response.ok) throw new Error("Failed to accept evaluation");
      const acceptedEvaluation = await response.json();
      setEvaluations((prev) =>
        prev.map((evaluation) => (evaluation._id === id ? acceptedEvaluation : evaluation))
      );
      toast.success("Evaluation accepted successfully!"); // Success toast
    } catch (err) {
      handleError(err); // Show error using handleError (toast)
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
      toast.success("Marked as arrived successfully!"); // Success toast
    } catch (err) {
      handleError(err); // Show error using handleError (toast)
    }
  };

  // ✅ Complete evaluation
  const completeEvaluation = async (id, result, selectedFile) => {
    try {
      const formData = new FormData();
      formData.append("evaluationFile", selectedFile);
      formData.append("result", result);

      const response = await fetch(`/api/healthEvaluation/${id}/complete`, {
        method: "PATCH",
        body: formData,
      });
      if (!response.ok) throw new Error("Failed to complete evaluation");
      const updatedEvaluation = await response.json();
      setEvaluations((prev) =>
        prev.map((evaluation) => (evaluation._id === id ? updatedEvaluation : evaluation))
      );
      toast.success("Evaluation completed successfully!"); // Success toast
    } catch (err) {
      handleError(err); // Show error using handleError (toast)
    }
  };

  // ✅ Delete an evaluation
  const deleteEvaluation = async (id) => {
    try {
      const response = await fetch(`/api/healthEvaluation/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete evaluation");
      setEvaluations((prev) => prev.filter((evaluation) => evaluation._id !== id));
      toast.success("Evaluation deleted successfully!"); // Success toast
    } catch (err) {
      handleError(err); // Show error using handleError (toast)
    }
  };

  return {
    evaluations,
    loading,
    fetchEvaluations,
    fetchEvaluationById,
    fetchEvaluationByDonorId,  // Corrected
    fetchEvaluationByHospitalId,  // Corrected
    createEvaluation,
    updateEvaluationDateTime,
    cancelEvaluation,
    acceptEvaluation,
    arrivedForEvaluation,
    completeEvaluation,
    deleteEvaluation,
  };
};
