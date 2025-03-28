import { useState, useEffect } from "react";

export const useBloodDonationAppointment = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // ✅ Fetch all blood donation appointments
    const fetchAppointments = useCallback(async() => {
        setLoading(true);
        try {
            const response = await fetch("/api/blooddonationappointment");
            if (!response.ok) throw new Error("Failed to fetch appointments");
            const data = await response.json();
            setAppointments(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // ✅ Fetch a single blood donation appointment by ID
    const fetchAppointmentById = useCallback(async(id) => {
        try {
            const response = await fetch(`/api/blooddonationappointment/${id}`);
            if (!response.ok) throw new Error("Failed to fetch appointment");
            return await response.json();
        } catch (err) {
            setError(err.message);
            return null;
        }
    }, []);

    // ✅ Create a new blood donation appointment
    const createAppointment = async(appointmentData) => {
        try {
            const response = await fetch("/api/blooddonationappointment", {
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
    const updateAppointmentDateTime = async(id, appointmentDate, appointmentTime, hospitalAdminId) => {
        try {
            const response = await fetch(`/api/blooddonationappointment/${id}/date-time`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ appointmentDate, appointmentTime, hospitalAdminId }),
            });
            if (!response.ok) throw new Error("Failed to update appointment date/time");

            const updatedAppointment = await response.json();
            setAppointments((prev) =>
                prev.map((appointment) => (appointment._id === id ? updatedAppointment : appointment))
            );
        } catch (err) {
            setError(err.message);
        }
    };

    // ✅ Cancel cancelAppointment
    const cancelAppointment = async(id, hospitalAdminId) => {
        try {
            const response = await fetch(`/api/blooddonationappointment/${id}/cancel`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ hospitalAdminId }) // Send hospitalAdminId in the request body
            });

            if (!response.ok) throw new Error("Failed to cancel appointment");
            const canceledAppointment = await response.json();
            setAppointments((prev) =>
                prev.map((appointment) => (appointment._id === id ? canceledAppointment : appointment))
            );
        } catch (err) {
            setError(err.message);
        }
    };


    // ✅ Accept acceptAppointment
    const acceptAppointment = async(id, hospitalAdminId) => {
        try {
            const response = await fetch(`/api/blooddonationappointment/${id}/accept`, {
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
    const arrivedForAppointment = async(id, receiptNumber) => {
        try {
            const response = await fetch(`/api/blooddonationappointment/${id}/arrived`, {
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

    // ✅ Complete blood donation appointment

    const completeAppointment = async(id) => {
        try {
            const response = await fetch(`/api/blooddonationappointment/${id}/complete`, { method: "PATCH" });
            if (!response.ok) throw new Error("Failed to complete Appointment");
            const updatedAppointment = await response.json();
            setAppointments((prev) =>
                prev.map((appointment) => (appointment._id === id ? updatedAppointment : appointment))
            );
        } catch (err) {
            setError(err.message);
        }
    };


    // ✅ Delete a blood donation appointment
    const deleteAppointment = async(id) => {
        try {
            const response = await fetch(`/api/blooddonationappointment/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete appointment");
            setAppointments((prev) =>
                prev.filter((appointment) => appointment._id !== id));

        } catch (err) {
            setError(err.message);
        }
    };

    const fetchBloodDonationAppointmentByDonorId = async(id) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/blooddonationappointment/donor/${id}`);
            if (!response.ok) throw new Error("Failed to fetch Appointment");
            const data = await response.json();
            setAppointments(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchBloodDonationAppointmentByHospitalId = useCallback(async(id) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/blooddonationappointment/hospital/${id}`);
            if (!response.ok) throw new Error("Failed to fetch Appointment");
            const data = await response.json();
            setAppointments(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const cancelAppointmentDonor = async(id, hospitalAdminId) => {
        try {
            const response = await fetch(`/api/blooddonationappointment/${id}/cancelD`, { method: "PATCH" });

            if (!response.ok) throw new Error("Failed to cancel appointment");
            const canceledAppointment = await response.json();
            setAppointments((prev) =>
                prev.map((appointment) => (appointment._id === id ? canceledAppointment : appointment))
            );
        } catch (err) {
            setError(err.message);
        }
    };

    return {
        appointments,
        loading,
        error,
        fetchAppointments,
        fetchAppointmentById,
        createAppointment,
        updateAppointmentDateTime,
        deleteAppointment,
        arrivedForAppointment,
        acceptAppointment,
        completeAppointment,
        cancelAppointment,
        fetchBloodDonationAppointmentByHospitalId,
        fetchBloodDonationAppointmentByDonorId,
    };
};