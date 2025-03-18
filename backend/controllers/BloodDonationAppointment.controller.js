import BloodDonationAppointment from "../models/BloodDonationAppointment.model.js";

//  Get all blood donation appointments
export const getAppointments = async (req, res) => {
    try {
        const appointments = await BloodDonationAppointment.find()
            .populate('hospitalId donorId hospitalAdminId');// Populate donor details if needed
            
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching appointments", error });
    }
};

//  Get a single blood donation appointment by ID
export const getAppointmentById = async (req, res) => {
    try {
        const appointment = await BloodDonationAppointment.findById(req.params.id)
            .populate('hospitalId donorId hospitalAdminId');
            
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
            donorId:donorId,
            hospitalId: hospitalId,
            appointmentDate:appointmentDate,
            appointmentTime:appointmentTime,
            receiptNumber: `REC-${Date.now()}`, // Generate unique receipt number
        });
        

        await newAppointment.save();
        res.status(201).json( {success:true , data:newAppointment});
    } catch (error) {
        console.error("Error creating appointment:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};


// Update Date and Time of Evaluation
export const updateAppointmentDateTime = async (req, res) => {
    try {
        const { appointmentDate, appointmentTime, hospitalAdminId } = req.body;
        const updatedAppointment = await BloodDonationAppointment.findByIdAndUpdate(
            req.params.id,
            { 
                appointmentDate: appointmentDate, 
                appointmentTime: appointmentTime, 
                activeStatus: "Re-Scheduled", 
                hospitalAdminId: hospitalAdminId
            },
            { new: true }
        );

        if (!updatedAppointment) return res.status(404).json({ error: "Appointment not found" });

        res.status(200).json(updatedAppointment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Cancel an Evaluation
export const cancelAppointment = async (req, res) => {
    try {
        const { hospitalAdminId } = req.body;
        const canceledAppointment = await BloodDonationAppointment.findByIdAndUpdate(
            req.params.id,
            {
                
                activeStatus: "Cancelled",
                progressStatus: "Cancelled",
                hospitalAdminId: hospitalAdminId
            },
            { new: true }
        );

        if (!canceledAppointment) return res.status(404).json({ error: "Appointment not found" });

        res.status(200).json(canceledAppointment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Accept an Evaluation
export const acceptAppointment = async (req, res) => {
    try {
        const { hospitalAdminId } = req.body;
        const acceptAppointment = await BloodDonationAppointment.findByIdAndUpdate(
            req.params.id,
            { activeStatus: "Accepted", 
              hospitalAdminId: hospitalAdminId },
            { new: true }
        );

        if (!acceptAppointment) return res.status(404).json({ error: "Appointment not found" });

        res.status(200).json(acceptAppointment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Arrived for an Evaluation
export const arrivedForAppointment = async (req, res) => {
    try {
        const { receiptNumber } = req.body;
        const arrivedForAppointment = await BloodDonationAppointment.findByIdAndUpdate(
            req.params.id,
            { receiptNumber: receiptNumber,
              progressStatus: "In Progress" },
            { new: true }
        );

        if (!arrivedForAppointment) return res.status(404).json({ error: "Appointment not found" });

        res.status(200).json(arrivedForAppointment);
    } catch (err) {
        res.status(500).json({ error: err.message });
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