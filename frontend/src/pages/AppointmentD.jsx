import React, { useEffect, useState } from "react";
import { Button, Table, Modal, Label, TextInput, Textarea, Select } from "flowbite-react";
import { DashboardSidebar } from "../components/DashboardSidebar";
import { useBloodDonationAppointment } from "../hooks/useBloodDonationAppointment";
import { useSecondAuth } from "../hooks/useSecondAuth";
import { useAuthContext } from "../hooks/useAuthContext";
import { useFeedback } from "../hooks/useFeedback";

export default function HealthEvaluationD() {
  const {
    appointments,
    fetchAppointments,
    deleteAppointment,
    updateAppointmentDateTime,
    arrivedForAppointment,
    acceptAppointment,
    cancelAppointment,
    completeAppointment,
    cancelAppointmentDonor,
    fetchBloodDonationAppointmentByHospitalId,
    fetchBloodDonationAppointmentByDonorId,
  } = useBloodDonationAppointment();

  const [openRescheduleModal, setOpenRescheduleModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  const { createFeedback} = useFeedback();
  const [openArrivedModal, setOpenArrivedModal] = useState(false);
  const [receiptNumber, setReceiptNumber] = useState("");

  const { user } = useAuthContext();
  const userId = user?.userObj?._id;

  const { secondUser } = useSecondAuth();

  const Donor = user?.role === 'Donor';
  const Hospital = user?.role === 'Hospital';
  const Manager = user?.role === 'Manager';
  const HospitalAdmin = secondUser?.role === 'HospitalAdmin';

  const SecondUserId = secondUser?.userObj?._id;
  const [hospitalAdminId, sethospitalAdminId] = useState(SecondUserId);

  const [openFeedbackModal, setOpenFeedbackModal] = useState(false);
  const [subject, setSubject] = useState("");
  const [comments, setComments] = useState("");
  const [feedbackType, setFeedbackType] = useState("");
  const [starRating, setStarRating] = useState("");  
  
  useEffect(() => {
      if (!userId) {
        return;
    }
    if (Donor) {
      fetchBloodDonationAppointmentByDonorId(userId);
    }
    else if (Hospital) {
      fetchBloodDonationAppointmentByHospitalId(userId);
    } else {
      fetchAppointments();
    }
    }, [userId, Donor, Hospital, fetchAppointments, fetchBloodDonationAppointmentByDonorId, fetchBloodDonationAppointmentByHospitalId]);


  // Handle Reschedule Click
  const handleRescheduleClick = (appointment) => {
    setSelectedAppointment(appointment);
    setNewDate(appointment.appointmentDate || "");
    setNewTime(appointment.appointmentTime || "");
    setOpenRescheduleModal(true);
  };

  // Handle Reschedule Submit
  const handleRescheduleSubmit = async () => {
    try {
      if (selectedAppointment) {
        await updateAppointmentDateTime(selectedAppointment._id, newDate, newTime, hospitalAdminId);
        setOpenRescheduleModal(false);
      }  
    } catch (error) {
      console.log(error);
    }
    
  };

  // Handle Arrived Button Click
  const handleArrivedClick = (appointment) => {
    setSelectedAppointment(appointment);
    setReceiptNumber(appointment.receiptNumber || "");
    setOpenArrivedModal(true);
  };

  // Submit Arrived Status
  const handleArrivedSubmit = async () => {
    if (selectedAppointment) {
      await arrivedForAppointment(selectedAppointment._id, receiptNumber);
      setOpenArrivedModal(false);
    }
  };

  const handleFeedbackClick = (appointment) => {
    setSelectedAppointment(appointment);
    setOpenFeedbackModal(true);
  };

  const handleFeedbackSubmit = async () => {
    if (!selectedAppointment || !subject || !comments || !feedbackType) {
      alert("Please fill in all required fields.");
      return;
    }

    const feedbackData = {
      donorId: userId,
      sessionId: selectedAppointment._id,
      sessionModel: "BloodDonationAppointment",
      subject,
      comments,
      feedbackType,
      starRating,
    };

    try {
      console.log("Submitting feedback:", feedbackData);
      await createFeedback(feedbackData); 
      setOpenFeedbackModal(false);
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />

      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Appointments</h1>
          <Button>Add New Appointment</Button>
        </div>

        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>Receipt No.</Table.HeadCell>
            <Table.HeadCell>Date</Table.HeadCell>
            <Table.HeadCell>Time</Table.HeadCell>
            <Table.HeadCell>Progress Status</Table.HeadCell>
            <Table.HeadCell>Hospital</Table.HeadCell>
            <Table.HeadCell>Donor</Table.HeadCell>
            <Table.HeadCell>Admin</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {appointments.length > 0 ? (
              appointments.map((appointment) => (
                <Table.Row key={appointment._id}>
                  <Table.Cell>{appointment.receiptNumber}</Table.Cell>
                  <Table.Cell>{new Date(appointment.appointmentDate).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>{appointment.appointmentTime}</Table.Cell>


                  <Table.Cell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        appointment.progressStatus === "Completed" ? "bg-green-100 text-green-700" :
                        appointment.progressStatus === "In Progress" ? "bg-blue-100 text-blue-700" :
                              "bg-gray-100 text-gray-700"
                        }`}>
                       {appointment.progressStatus}
                    </span>
                  </Table.Cell>
                  
                  <Table.Cell>{appointment.hospitalId?.hospitalName || "N/A"}</Table.Cell>
                  <Table.Cell>{appointment.donorId?.fullname || "N/A"}</Table.Cell>
                  <Table.Cell>{appointment.hospitalAdminId?.fullname || "N/A"}</Table.Cell>
                  <Table.Cell className="space-x-2">

                  <div className="flex flex-row gap-3">
                    {Hospital && HospitalAdmin && (
                        <>
                                {(appointment.activeStatus !== "Cancelled" && appointment.activeStatus !== "Re-Scheduled" && appointment.activeStatus !== "Accepted") && (
                                  <Button size="xs" color="warning" onClick={() => handleRescheduleClick(appointment)}>
                                    Reschedule
                                  </Button>
                                )}
                                {(appointment.activeStatus !== "Cancelled" && appointment.activeStatus !== "Accepted") && (
                                  <Button size="xs" color="gray" onClick={() => cancelAppointment(appointment._id, hospitalAdminId)}>
                                    Cancel
                                  </Button>
                                )}
                                {(appointment.activeStatus !== "Cancelled" && appointment.activeStatus !== "Accepted" && appointment.activeStatus !== "Re-Scheduled") && (
                                  <Button size="xs" color="gray" onClick={() => acceptAppointment(appointment._id, hospitalAdminId)}>
                                    Accept
                                  </Button>
                                )}
                               {((appointment.activeStatus === "Accepted" && appointment.progressStatus === "Completed") || 
  (appointment.activeStatus === "Cancelled" && appointment.progressStatus === "Cancelled")) && (
  <Button size="xs" color="failure" onClick={() => deleteAppointment(appointment._id)}>
    Delete
  </Button>
)}


                                {(appointment.progressStatus === "Not Started" && appointment.activeStatus === "Accepted") && (
                                  <Button size="xs" color="success" onClick={() => handleArrivedClick(appointment)}>
                                    Arrived
                                  </Button>
                                )}
                                  {(appointment.progressStatus === "In Progress" && appointment.activeStatus === "Accepted") && (
                                  <Button size="xs" color="success" onClick={() => completeAppointment(appointment._id, hospitalAdminId)}>
                                    Completed
                                  </Button>
                                )}
                                
                                
                    </>
                      )}

                      {Donor && (
                                    <>
                                               {(appointment.activeStatus === "Re-Scheduled" && appointment.activeStatus != "Cancelled") && (
                                                <Button size="xs" color="gray" onClick={() => cancelAppointmentDonor(appointment._id)}>
                                                  Cancel
                                                </Button>
                                              )}
                                              {(appointment.activeStatus !== "Cancelled" && appointment.activeStatus !== "Accepted" && appointment.activeStatus === "Re-Scheduled") && (
                                                <Button size="xs" color="gray" onClick={() => acceptAppointment(appointment._id, hospitalAdminId)}>
                                                  Accept
                                                </Button>
                                                )}
                                                {appointment.activeStatus !== "Cancelled"  && (
                                                <Button size="xs" color="gray" onClick={() => handleFeedbackClick(appointment)}>
                                                  Feedback
                                                </Button>
                                                )}
                                  </>
                                  )}
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan="9" className="text-center py-4 text-gray-500">
                  No appointments found
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>

      {/* Reschedule Modal */}
      <Modal show={openRescheduleModal} onClose={() => setOpenRescheduleModal(false)}>
        <Modal.Header>Reschedule Appointment</Modal.Header>
        <Modal.Body>
          <Label value="New Date" />
          <TextInput type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} required />
          <Label value="New Time" />
          <TextInput type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} required />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleRescheduleSubmit}>Save</Button>
        </Modal.Footer>
      </Modal>

      {/* Arrived Modal */}
            <Modal show={openArrivedModal} onClose={() => setOpenArrivedModal(false)}>
              <Modal.Header>Confirm Arrival</Modal.Header>
              <Modal.Body>
                <Label value="Receipt Number" />
                <TextInput value={receiptNumber} onChange={(e) => setReceiptNumber(e.target.value)} required />
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={handleArrivedSubmit}>Confirm</Button>
              </Modal.Footer>
            </Modal>

{/* Feedback Modal */}
            <Modal show={openFeedbackModal} onClose={() => setOpenFeedbackModal(false)}>
              <Modal.Header>Submit Feedback</Modal.Header>
              <Modal.Body>
                <Label value="Subject" />
                <TextInput value={subject} onChange={(e) => setSubject(e.target.value)} required />
                <Label value="Comments" />
                <Textarea value={comments} onChange={(e) => setComments(e.target.value)} required />
                <Label value="Feedback Type" />
                <Select value={feedbackType} onChange={(e) => setFeedbackType(e.target.value)} required>
                  <option value="">Select Feedback Type</option>
                  <option value="General Feedback">General Feedback</option>
                  <option value="Technical Feedback">Technical Feedback</option>
                  <option value="Complaint Feedback">Complaint Feedback</option>
                </Select>
                <Label value="Star Rating (Optional)" />
                <TextInput type="number" min="1" max="5" value={starRating} onChange={(e) => setStarRating(e.target.value)} />
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={handleFeedbackSubmit}>Submit</Button>
              </Modal.Footer>
            </Modal>
    </div>
  );
}
