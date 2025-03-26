import BloodDonationAppointment from "../models/BloodDonationAppointment.model.js";

//  Get all blood donation appointments
export const getAppointments = async (req, res) => {
    try {
        const appointments = await BloodDonationAppointment.find();
            
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching appointments", error });
    }
};

//  Get a single blood donation appointment by ID
export const getAppointmentById = async (req, res) => {
    try {
        const appointment = await BloodDonationAppointment.findById(req.params.id);
            
        if (!appointment) return res.status(404).json({ message: "Appointment not found" });
        res.json(appointment);
    } catch (error) {
        res.status(500).json({ message: "Error fetching appointment", error });
    }
};

//  Create a new blood donation appointment
export const createAppointment = async (req, res) => {
    try {
        const {  hospitalId,donorId, appointmentDate, appointmentTime} = req.body;

        if ( !hospitalId || !donorId || !appointmentDate || !appointmentTime) {
            return res.status(400).json({ error: "All fields are required." });
        }

        const newAppointment = new BloodDonationAppointment({
            
            progressStatus: 'Not Started',
            donorId:donorId,
            hospitalId: hospitalId,
            appointmentDate:appointmentDate,
            appointmentTime:appointmentTime,
            
        });
        

        await newAppointment.save();
        res.status(201).json( {success:true , data: newAppointment});
    } catch (err) {
        console.error("Error creating appointment:", err);
        res.status(500).json({ success: false, err: err.message });
    }
};


// Update Date and Time of appointment
export const updateAppointmentDateTime = async (req, res) => {
    try {
        const { appointmentDate, appointmentTime, hospitalAdminId } = req.body;
        console.log(req.body);
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

// Cancel an Appointment
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

// Accept an Appointment
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

// Arrived for an Appointment
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

//  Complete  a blood donation appointment
export const completeAppointment = async (req, res) => {
    try {
        // Find Appointment and update status
        const completedAppointment = await BloodDonationAppointment.findByIdAndUpdate(
            req.params.id,
            { 
                progressStatus: "Completed",       
            },
            { new: true }
        );

        if (!completedAppointment) {
            return res.status(404).json({ error: "Appointment not found" });
        }
        res.status(200).json(completedAppointment);
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
export const getBloodDonationAppointmentByDonorId = async (req, res) => {
    try {
        const {id} = req.params;
        const appointment = await BloodDonationAppointment.find({donorId: id});
        if (!appointment) return res.status(404).json({ message: "appointment not found" });
        res.json(appointment);
    } catch (error) {
        res.status(500).json({ message: "Error fetching appointment", error });
    }
};

export const getBloodDonationAppointmentByHospitalId = async (req, res) => {
    try {
        const {id} = req.params;
        const appointment = await BloodDonationAppointment.find({hospitalId: id});
        if (!appointment) return res.status(404).json({ message: "appointment not found" });
        res.json(appointment);
    } catch (error) {
        res.status(500).json({ message: "Error fetching appointment", error });
    }
};

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

        if (!canceledAppointment) return res.status(404).json({ error: "Appointment not found" });

        res.status(200).json(canceledAppointment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
