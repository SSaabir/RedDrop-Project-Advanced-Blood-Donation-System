import React, { useEffect, useState } from "react";
import { Button, Table, Modal, Label, TextInput } from "flowbite-react";
import { DashboardSidebar } from "../components/DashboardSidebar";
import { useBloodDonationAppointment } from "../hooks/useBloodDonationAppointment";
import { useSecondAuth } from "../hooks/useSecondAuth";
import { useAuthContext } from "../hooks/useAuthContext";


export default function AppointmentDashboard() {
  const {
    appointments,
    fetchAppointments,
    deleteAppointment,
    updateAppointmentDateTime,
    arrivedForAppointment,
    acceptAppointment,
    cancelAppointment,
  } = useBloodDonationAppointment();

  const [rescheduleModal, setRescheduleModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  const [openArrivedModal, setOpenArrivedModal] = useState(false);
  const [receiptNumber, setReceiptNumber] = useState("");
  

  const { user } = useAuthContext();

  const { secondUser } = useSecondAuth();
  const userId = secondUser?.userObj?._id;
  const [hospitalAdminId, sethospitalAdminId] = useState(userId);

  const Donor = user?.role === 'Donor';
  const Hospital = user?.role === 'Hospital';
  const Manager = user?.role === 'Manager';
  const HospitalAdmin = secondUser?.role === 'HospitalAdmin';

  useEffect(() => {
    fetchAppointments();
  }, []);


  // Handle Reschedule Click
  const handleRescheduleClick = (appointment) => {
    setSelectedAppointment(appointment);
    setNewDate(appointment.appointmentDate || "");
    setNewTime(appointment.appointmentTime || "");
    setRescheduleModal(true);
  };

  // Handle Reschedule Submit
  const handleRescheduleSubmit = async () => {
    if (selectedAppointment) {
      await updateAppointmentDateTime(selectedAppointment._id, newDate, newTime,hospitalAdminId);
      setRescheduleModal(false);
    }
  };

  // Handle Arrived Button Click
  const handleArrivedClick = (appointment) => {
    setSelectedEvaluation(appointment);
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
            <Table.HeadCell>Accept Status</Table.HeadCell>
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
                  <Table.Cell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              appointment.acceptStatus === "Accept" ? "bg-green-100 text-green-700" :
                              appointment.acceptStatus === "denied" ? "bg-red-100 text-red-700" :
                              "bg-yellow-100 text-yellow-700"
                            }`}>
                              {appointment.passStatus}
                            </span>
                          </Table.Cell>
                  <Table.Cell>{appointment.hospitalId?.hospitalName || "N/A"}</Table.Cell>
                  <Table.Cell>{appointment.donorId?.fullname || "N/A"}</Table.Cell>
                  <Table.Cell>{appointment.hospitalAdminId?.fullname || "N/A"}</Table.Cell>
                  <Table.Cell className="space-x-2">
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
                                {(appointment.activeStatus === "Accepted" && appointment.progressStatus === "Completed") || (appointment.progressStatus === "Cancelled" && appointment.activeStatus === "Cancelled") && (
                                  <Button size="xs" color="failure" onClick={() => deleteAppointment(appointment._id)}>
                                    Delete
                                  </Button>
                                )}

                                {(appointment.progressStatus === "Not Started" && appointment.activeStatus === "Accepted") && (
                                  <Button size="xs" color="success" onClick={() => handleArrivedClick(appointment)}>
                                    Arrived
                                  </Button>
                                )}
                                
                                
                    </>
                      )}

                      {Donor && (
                                    <>
                                               {(appointment.activeStatus === "Re-Sheduled" && appointment.activeStatus != "Cancelled") && (
                                                <Button size="xs" color="gray" onClick={() => cancelAppointment(appointment._id, hospitalAdminId)}>
                                                  Cancel
                                                </Button>
                                              )}
                                              {(appointment.activeStatus !== "Cancelled" && appointment.activeStatus !== "Accepted" && appointment.activeStatus !== "Re-Scheduled") && (
                                                <Button size="xs" color="gray" onClick={() => acceptAppointment(appointment._id, hospitalAdminId)}>
                                                  Accept
                                                </Button>
                                                )}
                                  </>
                                  )}
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
      <Modal show={rescheduleModal} onClose={() => setRescheduleModal(false)}>
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
    </div>
  );
}
