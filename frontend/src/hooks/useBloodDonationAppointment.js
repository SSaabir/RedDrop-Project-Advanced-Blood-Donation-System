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
    const updateAppointment = async (id, appointmentDate, appointmentTime) => {
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
        updateAppointment,
        deleteAppointment,
    };
};