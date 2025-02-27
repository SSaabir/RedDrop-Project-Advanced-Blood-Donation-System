import React, { useEffect, useState } from "react";
import { Button, Table, Modal, Label, TextInput } from "flowbite-react";
import { DashboardSidebar } from "../components/DashboardSidebar";
import { useHealthEvaluation } from "../hooks/useHealthEvaluation";

export default function AppointmentD() {
  const { evaluations, fetchEvaluations, deleteEvaluation, updateEvaluationDateTime, cancelEvaluation } =
    useHealthEvaluation();

  const [openModal, setOpenModal] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  useEffect(() => {
    fetchEvaluations();
  }, []);

  // Handle Reschedule Button Click
  const handleRescheduleClick = (evaluation) => {
    setSelectedEvaluation(evaluation);
    setNewDate(evaluation.evaluationDate || ""); // Pre-fill with existing date
    setNewTime(evaluation.evaluationTime || ""); // Pre-fill with existing time
    setOpenModal(true);
  };

  // Handle Rescheduling Submission
  const handleRescheduleSubmit = async () => {
    if (selectedEvaluation) {
      await updateEvaluationDateTime(selectedEvaluation._id, newDate, newTime);
      setOpenModal(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <DashboardSidebar />

      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Health Evaluations</h1>
          <Button>Add New Evaluation</Button>
        </div>

        <Table hoverable>
        <Table.Head>
  <Table.HeadCell>Receipt No.</Table.HeadCell>
  <Table.HeadCell>Date</Table.HeadCell> {/* Added */}
  <Table.HeadCell>Time</Table.HeadCell> {/* Added */}
  <Table.HeadCell>Pass Status</Table.HeadCell>
  <Table.HeadCell>Progress Status</Table.HeadCell>
  <Table.HeadCell>Hospital</Table.HeadCell>
  <Table.HeadCell>Donor</Table.HeadCell>
  <Table.HeadCell>Admin</Table.HeadCell>
  <Table.HeadCell>Actions</Table.HeadCell>
</Table.Head>
<Table.Body>
  {evaluations.length > 0 ? (
    evaluations.map((evaluation) => (
      <Table.Row key={evaluation._id}>
        <Table.Cell>{evaluation.receiptNumber}</Table.Cell>
        <Table.Cell>{evaluation.evaluationDate || "N/A"}</Table.Cell> {/* Added */}
        <Table.Cell>{evaluation.evaluationTime || "N/A"}</Table.Cell> {/* Added */}
        <Table.Cell>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              evaluation.passStatus === "Passed"
                ? "bg-green-100 text-green-700"
                : evaluation.passStatus === "Failed"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {evaluation.passStatus}
          </span>
        </Table.Cell>
        <Table.Cell>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              evaluation.progressStatus === "Completed"
                ? "bg-green-100 text-green-700"
                : evaluation.progressStatus === "In Progress"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {evaluation.progressStatus}
          </span>
        </Table.Cell>
        <Table.Cell>{evaluation.hospitalId?.email || "N/A"}</Table.Cell>
        <Table.Cell>{evaluation.donorId?.email || "N/A"}</Table.Cell>
        <Table.Cell>{evaluation.hospitalAdminId?.email || "N/A"}</Table.Cell>
        <Table.Cell className="space-x-2">
          <Button size="xs" color="warning" onClick={() => handleRescheduleClick(evaluation)}>
            Reschedule
          </Button>
          <Button size="xs" color="gray" onClick={() => cancelEvaluation(evaluation._id)}>
            Cancel
          </Button>
          <Button size="xs" color="failure" onClick={() => deleteEvaluation(evaluation._id)}>
            Delete
          </Button>
        </Table.Cell>
      </Table.Row>
    ))
  ) : (
    <Table.Row>
      <Table.Cell colSpan="9" className="text-center py-4 text-gray-500">
        No evaluations found
      </Table.Cell>
    </Table.Row>
  )}
</Table.Body>
  
        </Table>
      </div>

      {/* Reschedule Modal */}
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Reschedule Health Evaluation</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <div>
              <Label htmlFor="date" value="New Date" />
              <TextInput
                id="date"
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="time" value="New Time" />
              <TextInput
                id="time"
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                required
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleRescheduleSubmit}>Save Changes</Button>
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
