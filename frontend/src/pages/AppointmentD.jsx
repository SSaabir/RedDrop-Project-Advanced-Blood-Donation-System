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
    updateAppointment,
    acceptAppointment,
    cancelAppointment,
  } = useBloodDonationAppointment();

  const [rescheduleModal, setRescheduleModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  const { user } = useAuthContext();
  const { secondUser } = useSecondAuth();
  const hospitalAdminId = secondUser?.userObj?._id;

  const isHospitalAdmin = secondUser?.role === "HospitalAdmin";

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleRescheduleClick = (appointment) => {
    setSelectedAppointment(appointment);
    setNewDate(appointment.appointmentDate || "");
    setNewTime(appointment.appointmentTime || "");
    setRescheduleModal(true);
  };

  const handleRescheduleSubmit = async () => {
    if (selectedAppointment) {
      await updateAppointment(selectedAppointment._id, newDate, newTime);
      setRescheduleModal(false);
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
                  <Table.Cell>{appointment.passStatus}</Table.Cell>
                  <Table.Cell>{appointment.acceptStatus}</Table.Cell>
                  <Table.Cell>{appointment.hospitalId?.hospitalName || "N/A"}</Table.Cell>
                  <Table.Cell>{appointment.donorId?.name || "N/A"}</Table.Cell>
                  <Table.Cell>{appointment.hospitalAdminId?.name || "N/A"}</Table.Cell>
                  <Table.Cell className="space-x-2">
                    {isHospitalAdmin && (
                      <>
                        <Button size="xs" color="warning" onClick={() => handleRescheduleClick(appointment)}>
                          Reschedule
                        </Button>
                        <Button size="xs" color="gray" onClick={() => cancelAppointment(appointment._id)}>
                          Cancel
                        </Button>
                        <Button size="xs" color="success" onClick={() => acceptAppointment(appointment._id)}>
                          Accept
                        </Button>
                        <Button size="xs" color="failure" onClick={() => deleteAppointment(appointment._id)}>
                          Delete
                        </Button>
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
    </div>
  );
}
