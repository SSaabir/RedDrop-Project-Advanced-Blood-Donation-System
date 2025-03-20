import { useState, useEffect } from "react";

export const useBloodDonationAppointment = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // ✅ Fetch all blood donation appointments
    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/BloodDonationAppointment");
            if (!response.ok) throw new Error("Failed to fetch appointments");
            const data = await response.json();
            setAppointments(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Fetch a single blood donation appointment by ID
    const fetchAppointmentById = async (id) => {
        try {
            const response = await fetch(`/api/BloodDonationAppointment/${id}`);
            if (!response.ok) throw new Error("Failed to fetch appointment");
            return await response.json();
        } catch (err) {
            setError(err.message);
            return null;
        }
    };

    // ✅ Create a new blood donation appointment
    const createAppointment = async (appointmentData) => {
        try {
            const response = await fetch("/api/BloodDonationAppointment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(appointmentData),
            });
            if (!response.ok) throw new Error("Failed to create appointment");
            const newAppointment = await response.json();
            setAppointments((prev) => [...prev, newAppointment]);
        } catch (err) {
            setError(err.message);
        }
    };

    // ✅ Update blood donation appointment details
    const updateAppointmentDateTime = async (id, appointmentDate, appointmentTime) => {
        try {
            const response = await fetch(`/api/BloodDonationAppointment/${id}`,{
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ appointmentDate, appointmentTime }),
            });
            if (!response.ok) throw new Error("Failed to update appointment date/time");
    
            const updatedAppointment = await response.json();
            setAppointments((prev) =>
                prev.map((appointment) =>
                    appointment._id === id ? updatedAppointment : appointment
                )
            );
        } catch (err) {
            setError(err.message);
        }
    };

    // ✅ Cancel cancelAppointment
  const cancelAppointment = async (id, hospitalAdminId) => {
    try {
      const response = await fetch(`/api/BloodDonationAppointment/${id}/cancel`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ hospitalAdminId }) // Send hospitalAdminId in the request body
      });
  
      if (!response.ok) throw new Error("Failed to cancel appointment");
      const canceledAppointment = await response.json();
      setAppointments((prev) =>
        prev.map((appointment) => (appointment._id === id ? canceledAppointment : evaluation))
      );
    } catch (err) {
      setError(err.message);
    }
  };
  

  // ✅ Accept acceptAppointment
  const acceptAppointment = async (id, hospitalAdminId) => {
    try {
      const response = await fetch(`/api/BloodDonationAppointment/${id}/accept`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ hospitalAdminId }) // Send hospitalAdminId in the request body
      });
  
      if (!response.ok) throw new Error("Failed to accept Appointments");
      const acceptedAppointment = await response.json();
      setAppointments((prev) =>
        prev.map((appointment) => (appointment._id === id ? acceptedAppointment : appointment))
      );
    } catch (err) {
      setError(err.message);
    }
  };
  
  // ✅ Mark as arrivedForAppointment
  const arrivedForAppointment = async (id, receiptNumber) => {
    try {
      const response = await fetch(`/api/BloodDonationAppointment/${id}/arrived`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiptNumber }),
      });
      if (!response.ok) throw new Error("Failed to mark as arrived");
      const updatedappointment = await response.json();
      setAppointments((prev) =>
        prev.map((appointment) => (appointment._id === id ? updatedappointment : appointment))
      );
    } catch (err) {
      setError(err.message);
    }
  };


    // ✅ Delete a blood donation appointment
    const deleteAppointment = async (id) => {
        try {
            const response = await fetch(`/api/BloodDonationAppointment/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete appointment");
            setAppointments((prev) =>
                prev.filter((appointment) => appointment._id !== id)
            );
        } catch (err) {
            setError(err.message);
        }
    };

    // Fetch appointments when the hook is used
    useEffect(() => {
        fetchAppointments();
    }, []);

    return {
        appointments,
        fetchAppointments,
        fetchAppointmentById,
        createAppointment,
        updateAppointmentDateTime,
        deleteAppointment,
        arrivedForAppointment,
        acceptAppointment,
        cancelAppointment,
    };
};