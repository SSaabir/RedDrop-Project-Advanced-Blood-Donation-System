import React, { useEffect, useState } from "react";
import { Button, Table, Modal, Label, TextInput, FileInput, Spinner } from "flowbite-react";
import { DashboardSidebar } from "../components/DashboardSidebar";
import { useHealthEvaluation } from "../hooks/useHealthEvaluation";
import { useSecondAuth } from "../hooks/useSecondAuth";
import { useAuthContext } from "../hooks/useAuthContext";

export default function AppointmentD() {
  const { evaluations, fetchEvaluationByDonorId, fetchEvaluationByHospitalId, fetchEvaluations, deleteEvaluation, updateEvaluationDateTime, acceptEvaluation, cancelEvaluation, arrivedForEvaluation, completeEvaluation, cancelEvaluationDonor } = useHealthEvaluation();

  const [openRescheduleModal, setOpenRescheduleModal] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  const [openArrivedModal, setOpenArrivedModal] = useState(false);
  const [receiptNumber, setReceiptNumber] = useState("");

  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [evaluationResult, setEvaluationResult] = useState("");

  const { user } = useAuthContext();
  const userId = user?.userObj?._id;
  
  const { secondUser } = useSecondAuth();
  const SecondUserId = secondUser?.userObj?._id;
  const [hospitalAdminId, sethospitalAdminId] = useState(SecondUserId);

  const Donor = user?.role === 'Donor';
  const Hospital = user?.role === 'Hospital';
  const Manager = user?.role === 'Manager';
  const HospitalAdmin = secondUser?.role === 'HospitalAdmin';

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!userId) return;

    if (Donor) {
      fetchEvaluationByDonorId(userId);
    } else if (Hospital) {
      fetchEvaluationByHospitalId(userId);
    } else {
      fetchEvaluations();
    }
  }, [userId, Donor, Hospital]);

  // Handle Reschedule Click
  const handleRescheduleClick = (evaluation) => {
    setSelectedEvaluation(evaluation);
    setNewDate(evaluation.evaluationDate || "");
    setNewTime(evaluation.evaluationTime || "");
    setOpenRescheduleModal(true);
  };

  // Handle Reschedule Submit
  const handleRescheduleSubmit = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      if (selectedEvaluation) {
        await updateEvaluationDateTime(selectedEvaluation._id, newDate, newTime, hospitalAdminId);
        setOpenRescheduleModal(false);
      }
    } catch (err) {
      setErrorMessage("Failed to reschedule. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Arrived Button Click
  const handleArrivedClick = (evaluation) => {
    setSelectedEvaluation(evaluation);
    setReceiptNumber(evaluation.receiptNumber || "");
    setOpenArrivedModal(true);
  };

  // Submit Arrived Status
  const handleArrivedSubmit = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      if (selectedEvaluation) {
        await arrivedForEvaluation(selectedEvaluation._id, receiptNumber);
        setOpenArrivedModal(false);
      }
    } catch (err) {
      setErrorMessage("Failed to confirm arrival. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle File Upload Click
  const handleUploadClick = (evaluation) => {
    setSelectedEvaluation(evaluation);
    setOpenUploadModal(true);
  };

  // Submit File Upload
  const handleUploadSubmit = async () => {
    if (!selectedEvaluation || !selectedFile || !evaluationResult) {
      alert("Please select a file and an evaluation result before uploading.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    try {
      await completeEvaluation(selectedEvaluation._id, evaluationResult, selectedFile);
      setOpenUploadModal(false);
    } catch (err) {
      setErrorMessage("Failed to upload file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />

      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Health Evaluations</h1>
          <Button>Add New Evaluation</Button>
        </div>

        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>Receipt No.</Table.HeadCell>
            <Table.HeadCell>Date</Table.HeadCell>
            <Table.HeadCell>Time</Table.HeadCell>
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
                  <Table.Cell>{new Date(evaluation.evaluationDate).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>{evaluation.evaluationTime}</Table.Cell>
                  <Table.Cell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      evaluation.passStatus === "Passed" ? "bg-green-100 text-green-700" :
                      evaluation.passStatus === "Failed" ? "bg-red-100 text-red-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>
                      {evaluation.passStatus}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      evaluation.progressStatus === "Completed" ? "bg-green-100 text-green-700" :
                      evaluation.progressStatus === "In Progress" ? "bg-blue-100 text-blue-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {evaluation.progressStatus}
                    </span>
                  </Table.Cell>
                  <Table.Cell>{evaluation.hospitalId?.name || "N/A"}</Table.Cell>
                  <Table.Cell>{evaluation.donorId?.fullName || "N/A"}</Table.Cell>
                  <Table.Cell>{evaluation.hospitalAdminId?.fullName || "N/A"}</Table.Cell>
                  <Table.Cell className="space-x-2">
                    <div className="flex flex-row gap-3">
                      {Hospital && HospitalAdmin && (
                        <>
                          {(evaluation.activeStatus !== "Cancelled" && evaluation.activeStatus !== "Re-Scheduled" && evaluation.activeStatus !== "Accepted") && (
                            <Button size="xs" color="warning" onClick={() => handleRescheduleClick(evaluation)}>
                              Reschedule
                            </Button>
                          )}
                          {(evaluation.activeStatus !== "Cancelled" && evaluation.activeStatus !== "Accepted") && (
                            <Button size="xs" color="gray" onClick={() => cancelEvaluation(evaluation._id, hospitalAdminId)}>
                              Cancel
                            </Button>
                          )}
                          {(evaluation.activeStatus !== "Cancelled" && evaluation.activeStatus !== "Accepted" && evaluation.activeStatus !== "Re-Scheduled") && (
                            <Button size="xs" color="gray" onClick={() => acceptEvaluation(evaluation._id, hospitalAdminId)}>
                              Accept
                            </Button>
                          )}
                          {(evaluation.progressStatus === "Completed" || evaluation.activeStatus === "Cancelled") && (
                            <Button size="xs" color="failure" onClick={() => deleteEvaluation(evaluation._id)}>
                              Delete
                            </Button>
                          )}
                          {(evaluation.progressStatus === "Not Started" && evaluation.activeStatus === "Accepted") && (
                            <Button size="xs" color="success" onClick={() => handleArrivedClick(evaluation)}>
                              Arrived
                            </Button>
                          )}
                          {(evaluation.progressStatus === "In Progress" && evaluation.passStatus === "Pending" && evaluation.activeStatus === "Accepted") && (
                            <Button size="xs" color="lime" onClick={() => handleUploadClick(evaluation)}>
                              Upload
                            </Button>
                          )}
                        </>
                      )}
                      {Donor && (
                        <>
                          {(evaluation.activeStatus === "Re-Scheduled" && evaluation.activeStatus !== "Cancelled") && (
                            <Button size="xs" color="gray" onClick={() => cancelEvaluationDonor(evaluation._id)}>
                              Cancel
                            </Button>
                          )}
                          {(evaluation.activeStatus !== "Cancelled" && evaluation.activeStatus !== "Accepted" && evaluation.activeStatus === "Re-Scheduled") && (
                            <Button size="xs" color="gray" onClick={() => acceptEvaluation(evaluation._id, hospitalAdminId)}>
                              Accept
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
                  No evaluations found
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>

      {/* Reschedule Modal */}
      <Modal show={openRescheduleModal} onClose={() => setOpenRescheduleModal(false)}>
        <Modal.Header>Reschedule Evaluation</Modal.Header>
        <Modal.Body>
          <Label value="New Date" />
          <TextInput type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} required />
          <Label value="New Time" />
          <TextInput type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} required />
        </Modal.Body>
        <Modal.Footer>
          {loading ? (
            <Button disabled>
              <Spinner aria-label="Rescheduling..." />
            </Button>
          ) : (
            <Button onClick={handleRescheduleSubmit}>Save</Button>
          )}
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
          {loading ? (
            <Button disabled>
              <Spinner aria-label="Confirming arrival..." />
            </Button>
          ) : (
            <Button onClick={handleArrivedSubmit}>Confirm</Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* Upload File Modal */}
      <Modal show={openUploadModal} onClose={() => setOpenUploadModal(false)}>
        <Modal.Header>Upload Evaluation File</Modal.Header>
        <Modal.Body>
          <FileInput accept=".jpg, .pdf,.docx,.xlsx" id="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
          {/* Pass/Fail Radio Group */}
          <div className="mt-4">
            <label className="font-semibold">Evaluation Result:</label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-2">
                <input type="radio" name="evaluationResult" value="Passed" onChange={(e) => setEvaluationResult(e.target.value)} />
                Pass
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="evaluationResult" value="Failed" onChange={(e) => setEvaluationResult(e.target.value)} />
                Fail
              </label>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          {loading ? (
            <Button disabled>
              <Spinner aria-label="Uploading file..." />
            </Button>
          ) : (
            <Button onClick={handleUploadSubmit}>Upload</Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* Error Message */}
      {errorMessage && <div className="text-red-600 text-center mt-4">{errorMessage}</div>}
    </div>
  );
}