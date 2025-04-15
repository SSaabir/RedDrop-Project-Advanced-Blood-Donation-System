import BloodDonationAppointment from "../models/BloodDonationAppointment.model.js";
import Donor from "../models/donor.model.js";
// Get all blood donation appointments
export const getAppointments = async (req, res) => {
    try {
        const appointments = await BloodDonationAppointment.find();
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching appointments" });
    }
};

// Get a single blood donation appointment by ID
export const getAppointmentById = async (req, res) => {
    try {
        const appointment = await BloodDonationAppointment.findById(req.params.id);
        if (!appointment) return res.status(404).json({ message: "Appointment not found" });
        res.json(appointment);
    } catch (error) {
        res.status(500).json({ message: "Error fetching appointment" });
    }
};

// Create a new blood donation appointment
export const createAppointment = async (req, res) => {
    try {
        const { hospitalId, donorId, appointmentDate, appointmentTime } = req.body;

        if (!hospitalId || !donorId || !appointmentDate || !appointmentTime) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newAppointment = new BloodDonationAppointment({
            progressStatus: 'Not Started',
            donorId,
            hospitalId,
            appointmentDate,
            appointmentTime,
        });
        await Donor.findByIdAndUpdate(donorId, {appointmentStatus: true})
        await newAppointment.save();
        res.status(201).json({ success: true, data: newAppointment });
    } catch (error) {
        res.status(500).json({ message: "Error creating appointment" });
    }
};

// Update Date and Time of appointment
export const updateAppointmentDateTime = async (req, res) => {
    try {
        const { appointmentDate, appointmentTime, hospitalAdminId } = req.body;
        const updatedAppointment = await BloodDonationAppointment.findByIdAndUpdate(
            req.params.id,
            { 
                appointmentDate, 
                appointmentTime, 
                activeStatus: "Re-Scheduled",
                hospitalAdminId
            },
            { new: true }
        );

        if (!updatedAppointment) return res.status(404).json({ message: "Appointment not found" });

        res.status(200).json(updatedAppointment);
    } catch (error) {
        res.status(500).json({ message: "Error updating appointment date and time" });
    }
};

// Cancel an Appointment
export const cancelAppointment = async (req, res) => {
    try {
        const { hospitalAdminId } = req.body;
        const canceledAppointment = await BloodDonationAppointment.findByIdAndUpdate(
            req.params.id,
            {
                activeStatus: "Cancelled",
                progressStatus: "Cancelled",
                hospitalAdminId
            },
            { new: true }
        );

        if (!canceledAppointment) return res.status(404).json({ message: "Appointment not found" });

        res.status(200).json(canceledAppointment);
    } catch (error) {
        res.status(500).json({ message: "Error cancelling appointment" });
    }
};

// Accept an Appointment
export const acceptAppointment = async (req, res) => {
    try {
        const { hospitalAdminId } = req.body;
        const acceptAppointment = await BloodDonationAppointment.findByIdAndUpdate(
            req.params.id,
            { 
                activeStatus: "Accepted", 
                hospitalAdminId 
            },
            { new: true }
        );

        if (!acceptAppointment) return res.status(404).json({ message: "Appointment not found" });

        res.status(200).json(acceptAppointment);
    } catch (error) {
        res.status(500).json({ message: "Error accepting appointment" });
    }
};

// Arrived for an Appointment
export const arrivedForAppointment = async (req, res) => {
    try {
        const { receiptNumber } = req.body;
        const arrivedForAppointment = await BloodDonationAppointment.findByIdAndUpdate(
            req.params.id,
            { 
                receiptNumber,
                progressStatus: "In Progress" 
            },
            { new: true }
        );

        if (!arrivedForAppointment) return res.status(404).json({ message: "Appointment not found" });

        res.status(200).json(arrivedForAppointment);
    } catch (error) {
        res.status(500).json({ message: "Error marking appointment as arrived" });
    }
};

// Complete a blood donation appointment
export const completeAppointment = async (req, res) => {
    try {
        const completedAppointment = await BloodDonationAppointment.findByIdAndUpdate(
            req.params.id,
            { 
                progressStatus: "Completed"
            },
            { new: true }
        );

        if (!completedAppointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }
        res.status(200).json(completedAppointment);
    } catch (error) {
        res.status(500).json({ message: "Error completing appointment" });
    }
};

// Delete a blood donation appointment
export const deleteAppointment = async (req, res) => {
    try {
        const deletedAppointment = await BloodDonationAppointment.findByIdAndDelete(req.params.id);
        if (!deletedAppointment) return res.status(404).json({ message: "Appointment not found" });

        res.json({ message: "Appointment deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting appointment" });
    }
};

// Get blood donation appointments by donor ID
export const getBloodDonationAppointmentByDonorId = async (req, res) => {
    try {
        const { id } = req.params;
        const appointments = await BloodDonationAppointment.find({ donorId: id });
        if (!appointments || appointments.length === 0) return res.status(404).json({ message: "Appointments not found" });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching appointments" });
    }
};

// Get blood donation appointments by hospital ID
export const getBloodDonationAppointmentByHospitalId = async (req, res) => {
    try {
        const { id } = req.params;
        const appointments = await BloodDonationAppointment.find({ hospitalId: id });
        if (!appointments || appointments.length === 0) return res.status(404).json({ message: "Appointments not found" });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching appointments" });
    }
};

// Cancel appointment by donor
export const cancelAppointmentDonor = async (req, res) => {
    try {
        const canceledAppointment = await BloodDonationAppointment.findByIdAndUpdate(
            req.params.id,
            {
                activeStatus: "Cancelled",
                progressStatus: "Cancelled"
            },
            { new: true }
        );

        if (!canceledAppointment) return res.status(404).json({ message: "Appointment not found" });

        res.status(200).json(canceledAppointment);
    } catch (error) {
        res.status(500).json({ message: "Error cancelling appointment" });
    }
};