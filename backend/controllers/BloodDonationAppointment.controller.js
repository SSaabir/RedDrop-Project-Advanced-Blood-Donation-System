import BloodDonationAppointment from "../models/BloodDonationAppointment.model.js";

//  Get all blood donation appointments
export const getAppointments = async (req, res) => {
    try {
        const appointments = await BloodDonationAppointment.find()
            .populate('donorId', 'name email') // Populate donor details if needed
            .populate('hospitalId', 'hospitalName address'); // Populate hospital details if needed
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching appointments", error });
    }
};

//  Get a single blood donation appointment by ID
export const getAppointmentById = async (req, res) => {
    try {
        const appointment = await BloodDonationAppointment.findById(req.params.id)
            .populate('donorId', 'name email')
            .populate('hospitalId', 'hospitalName address');
        if (!appointment) return res.status(404).json({ message: "Appointment not found" });
        res.json(appointment);
    } catch (error) {
        res.status(500).json({ message: "Error fetching appointment", error });
    }
};

//  Create a new blood donation appointment
export const createAppointment = async (req, res) => {
    try {
        const { donorId, hospitalId, appointmentDate, appointmentTime, receiptNumber } = req.body;

        const newAppointment = new BloodDonationAppointment({
            donorId,
            hospitalId,
            appointmentDate,
            appointmentTime,
            receiptNumber: `REC-${Date.now()}`, // Generate unique receipt number
        });
        

        await newAppointment.save();
        res.status(201).json(newAppointment);
    } catch (error) {
        res.status(400).json({ message: "Error creating appointment", error });
    }
};

//  Update blood donation appointment details
export const updateAppointment = async (req, res) => {
    try {
        const updatedAppointment = await BloodDonationAppointment.findByIdAndUpdate(
            req.params.id,
            req.body, { new: true }
        );

        if (!updatedAppointment) return res.status(404).json({ message: "Appointment not found" });

        res.status(200).json(updatedAppointment);
    } catch (error) {
        res.status(500).json({ message: "Error updating appointment", error });
    }
};

//  Delete a blood donation appointment
export const deleteAppointment = async (req, res) => {
    try {
        const deletedAppointment = await BloodDonationAppointment.findByIdAndDelete(req.params.id);
        if (!deletedAppointment) return res.status(404).json({ message: "Appointment not found" });

        res.json({ message: "Appointment deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting appointment", error });
    }
};