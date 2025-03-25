import { toast } from "react-toastify";

export const handleError = (err, message = "Something went wrong!") => {
  console.error("API Error:", err); // Log the error to the console for debugging

  let errorMessage = message; // Default message

  // Check if the error contains a message from the backend response
  if (err?.response?.data?.message) {
    errorMessage = err.response.data.message; // API-specific error message
  } else if (err?.message) {
    errorMessage = err.message; // Generic error message
  }

  // Show the error message in a toast notification
  toast.error(errorMessage);
};
