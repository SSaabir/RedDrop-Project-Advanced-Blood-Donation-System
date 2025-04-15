import React, { useEffect, useState } from "react";
import { Button, Table, Modal, Label, TextInput, FileInput, Spinner, Textarea, Select } from "flowbite-react";
import { DashboardSidebar } from "../components/DashboardSidebar";
import { useHealthEvaluation } from "../hooks/useHealthEvaluation";
import { useSecondAuth } from "../hooks/useSecondAuth";
import { useAuthContext } from "../hooks/useAuthContext";
import { useFeedback } from "../hooks/useFeedback";
import { useGenerateReport } from "../hooks/useGenerateReport";

export default function AppointmentD() {
  const {
    evaluations,
    fetchEvaluationByDonorId,
    fetchEvaluationByHospitalId,
    fetchEvaluations,
    deleteEvaluation,
    updateEvaluationDateTime,
    acceptEvaluation,
    cancelEvaluation,
    arrivedForEvaluation,
    completeEvaluation,
    cancelEvaluationDonor,
  } = useHealthEvaluation();

  const { createFeedback } = useFeedback();
  const { user } = useAuthContext();
  const { secondUser } = useSecondAuth();

  // User and role setup
  const userId = user?.userObj?._id;
  const Donor = user?.role === 'Donor';
  const Hospital = user?.role === 'Hospital';
  const Manager = user?.role === 'Manager';
  const HospitalAdmin = secondUser?.role === 'HospitalAdmin';
  const hospitalAdminId = secondUser?.userObj?._id;

  // State for reschedule modal
  const [openRescheduleModal, setOpenRescheduleModal] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [rescheduleErrors, setRescheduleErrors] = useState({});

  // State for arrived modal
  const [openArrivedModal, setOpenArrivedModal] = useState(false);
  const [receiptNumber, setReceiptNumber] = useState("");
  const [arrivedErrors, setArrivedErrors] = useState({});

  // State for upload modal
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [evaluationResult, setEvaluationResult] = useState("");
  const [uploadErrors, setUploadErrors] = useState({});

  // State for feedback modal
  const [openFeedbackModal, setOpenFeedbackModal] = useState(false);
  const [subject, setSubject] = useState("");
  const [comments, setComments] = useState("");
  const [feedbackType, setFeedbackType] = useState("");
  const [starRating, setStarRating] = useState("");
  const [feedbackErrors, setFeedbackErrors] = useState({});

  // Loading and error state
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { reportUrl, generateHealthEvaluationReport } = useGenerateReport();
  // Fetch evaluations based on role
  useEffect(() => {
    if (!userId) return;
    if (Donor) {
      fetchEvaluationByDonorId(userId);
    } else if (Hospital) {
      fetchEvaluationByHospitalId(userId);
    } else {
      fetchEvaluations();
    }
  }, [userId, Donor, Hospital, fetchEvaluationByDonorId, fetchEvaluationByHospitalId, fetchEvaluations]);

  // Validation functions
  const validateRescheduleForm = () => {
    const errors = {};
    if (!newDate) errors.newDate = "Date is required";
    else if (new Date(newDate) < new Date()) errors.newDate = "Date cannot be in the past";
    if (!newTime) errors.newTime = "Time is required";
    setRescheduleErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateArrivedForm = () => {
    const errors = {};
    if (!receiptNumber) errors.receiptNumber = "Receipt number is required";
    else if (!/^[A-Za-z0-9-]+$/.test(receiptNumber)) errors.receiptNumber = "Receipt number can only contain letters, numbers, and hyphens";
    setArrivedErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateUploadForm = () => {
    const errors = {};
    if (!selectedFile) errors.selectedFile = "File is required";
    else if (!["image/jpeg", "application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"].includes(selectedFile.type)) {
      errors.selectedFile = "File must be JPG, PDF, DOCX, or XLSX";
    }
    if (!evaluationResult) errors.evaluationResult = "Evaluation result is required";
    setUploadErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateFeedbackForm = () => {
    const errors = {};
    if (!subject) errors.subject = "Subject is required";
    if (!comments) errors.comments = "Comments are required";
    if (!feedbackType) errors.feedbackType = "Feedback type is required";
    if (starRating && (starRating < 1 || starRating > 5)) errors.starRating = "Rating must be between 1 and 5";
    setFeedbackErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Reschedule handlers
  const handleRescheduleClick = (evaluation) => {
    setSelectedEvaluation(evaluation);
    setNewDate(evaluation.evaluationDate || "");
    setNewTime(evaluation.evaluationTime || "");
    setRescheduleErrors({});
    setOpenRescheduleModal(true);
  };

  const handleRescheduleSubmit = async () => {
    if (!validateRescheduleForm()) return;
    setLoading(true);
    setErrorMessage("");
    try {
      await updateEvaluationDateTime(selectedEvaluation._id, newDate, newTime, hospitalAdminId);
      setOpenRescheduleModal(false);
    } catch (err) {
      setErrorMessage("Failed to reschedule evaluation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Arrived handlers
  const handleArrivedClick = (evaluation) => {
    setSelectedEvaluation(evaluation);
    setReceiptNumber(evaluation.receiptNumber || "");
    setArrivedErrors({});
    setOpenArrivedModal(true);
  };

  const handleArrivedSubmit = async () => {
    if (!validateArrivedForm()) return;
    setLoading(true);
    setErrorMessage("");
    try {
      await arrivedForEvaluation(selectedEvaluation._id, receiptNumber);
      setOpenArrivedModal(false);
    } catch (err) {
      setErrorMessage("Failed to confirm arrival. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Upload handlers
  const handleUploadClick = (evaluation) => {
    setSelectedEvaluation(evaluation);
    setSelectedFile(null);
    setEvaluationResult("");
    setUploadErrors({});
    setOpenUploadModal(true);
  };

  const handleUploadSubmit = async () => {
    if (!validateUploadForm()) return;
    setLoading(true);
    setErrorMessage("");
    try {
      await completeEvaluation(selectedEvaluation._id, evaluationResult, selectedFile);
      setOpenUploadModal(false);
      setSelectedFile(null);
      setEvaluationResult("");
    } catch (err) {
      setErrorMessage("Failed to upload evaluation file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Feedback handlers
  const handleFeedbackClick = (evaluation) => {
    setSelectedEvaluation(evaluation);
    setSubject("");
    setComments("");
    setFeedbackType("");
    setStarRating("");
    setFeedbackErrors({});
    setOpenFeedbackModal(true);
  };

  const handleFeedbackSubmit = async () => {
    if (!validateFeedbackForm()) return;
    const feedbackData = {
      donorId: userId,
      sessionId: selectedEvaluation._id,
      sessionModel: "HealthEvaluation",
      subject,
      comments,
      feedbackType,
      starRating,
    };
    setLoading(true);
    setErrorMessage("");
    try {
      await createFeedback(feedbackData);
      setOpenFeedbackModal(false);
    } catch (err) {
      setErrorMessage("Failed to submit feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Placeholder for viewFeedbackClick
  const viewFeedbackClick = (evaluation) => {
    console.log("View feedback for evaluation:", evaluation._id); // Placeholder
  };

  const handleGenerateReport = (e) => {
    e.preventDefault();
    generateHealthEvaluationReport(user.userObj._id);
};

  return (
    <div className="flex min-h-screen bg-gray-100">
      <DashboardSidebar />
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-red-700">Health Evaluations</h1>
          <Button gradientDuoTone="redToPink" onClick={handleGenerateReport} disabled={loading}> 
                      Generate Report
                    </Button>
                    {reportUrl && (
                <div>
                    <p>Report generated successfully!</p>
                    <a href={`http://localhost:3020${reportUrl}`} download>
                        Download Report
                    </a>
                </div>
                    )}
        </div>

        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>Receipt No.</Table.HeadCell>
            <Table.HeadCell>Date</Table.HeadCell>
            <Table.HeadCell>Time</Table.HeadCell>
            <Table.HeadCell>Pass Status</Table.HeadCell>
            <Table.HeadCell>Progress Status</Table.HeadCell>
            <Table.HeadCell>Hospital</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {evaluations.length > 0 ? (
              evaluations.map((evaluation) => (
                <Table.Row key={evaluation._id} className="bg-white">
                  <Table.Cell>{evaluation.receiptNumber || "N/A"}</Table.Cell>
                  <Table.Cell>{new Date(evaluation.evaluationDate).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>{evaluation.evaluationTime || "N/A"}</Table.Cell>
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
                  <Table.Cell>{evaluation.hospitalId?.name || "N/A"}</Table.Cell>
                  <Table.Cell className="space-x-2">
                    <div className="flex flex-row gap-2">
                      {Hospital && HospitalAdmin && (
                        <>
                          {evaluation.activeStatus !== "Cancelled" &&
                            evaluation.activeStatus !== "Re-Scheduled" &&
                            evaluation.activeStatus !== "Accepted" && (
                              <Button
                                size="xs"
                                color="warning"
                                onClick={() => handleRescheduleClick(evaluation)}
                              >
                                Reschedule
                              </Button>
                            )}
                          {evaluation.activeStatus !== "Cancelled" &&
                            evaluation.activeStatus !== "Accepted" && (
                              <Button
                                size="xs"
                                color="gray"
                                onClick={() => cancelEvaluation(evaluation._id, hospitalAdminId, evaluation.donorId)}
                              >
                                Cancel
                              </Button>
                            )}
                          {evaluation.activeStatus !== "Cancelled" &&
                            evaluation.activeStatus !== "Accepted" &&
                            evaluation.activeStatus !== "Re-Scheduled" && (
                              <Button
                                size="xs"
                                color="gray"
                                onClick={() => acceptEvaluation(evaluation._id, hospitalAdminId)}
                              >
                                Accept
                              </Button>
                            )}
                          {(evaluation.progressStatus === "Completed" ||
                            evaluation.activeStatus === "Cancelled") && (
                            <Button
                              size="xs"
                              color="failure"
                              onClick={() => deleteEvaluation(evaluation._id)}
                            >
                              Delete
                            </Button>
                          )}
                          {evaluation.progressStatus === "Not Started" &&
                            evaluation.activeStatus === "Accepted" && (
                              <Button
                                size="xs"
                                color="success"
                                onClick={() => handleArrivedClick(evaluation)}
                              >
                                Arrived
                              </Button>
                            )}
                          {evaluation.progressStatus === "In Progress" &&
                            evaluation.passStatus === "Pending" &&
                            evaluation.activeStatus === "Accepted" && (
                              <Button
                                size="xs"
                                color="lime"
                                onClick={() => handleUploadClick(evaluation)}
                              >
                                Upload
                              </Button>
                            )}
                        </>
                      )}
                      {Donor && (
                        <>
                          {evaluation.activeStatus === "Re-Scheduled" &&
                            evaluation.activeStatus !== "Cancelled" && (
                              <Button
                                size="xs"
                                color="gray"
                                onClick={() => cancelEvaluationDonor(evaluation._id, userId)}
                              >
                                Cancel
                              </Button>
                            )}
                          {evaluation.activeStatus !== "Cancelled" &&
                            evaluation.activeStatus !== "Accepted" &&
                            evaluation.activeStatus === "Re-Scheduled" && (
                              <Button
                                size="xs"
                                color="gray"
                                onClick={() => acceptEvaluation(evaluation._id, hospitalAdminId)}
                              >
                                Accept
                              </Button>
                            )}
                          {evaluation.activeStatus !== "Cancelled" && evaluation.activeStatus === "Completed" && evaluation.progressStatus === "Completed" &&(
                            <Button
                              size="xs"
                              color="gray"
                              onClick={() => handleFeedbackClick(evaluation)}
                            >
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
          <div className="space-y-4">
            <div>
              <Label value="New Date" />
              <TextInput
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                required
                color={rescheduleErrors.newDate ? "failure" : "gray"}
              />
              {rescheduleErrors.newDate && (
                <p className="text-red-600 text-sm mt-1">{rescheduleErrors.newDate}</p>
              )}
            </div>
            <div>
              <Label value="New Time" />
              <TextInput
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                required
                color={rescheduleErrors.newTime ? "failure" : "gray"}
              />
              {rescheduleErrors.newTime && (
                <p className="text-red-600 text-sm mt-1">{rescheduleErrors.newTime}</p>
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            gradientDuoTone="redToPink"
            onClick={handleRescheduleSubmit}
            disabled={loading}
          >
            {loading ? <Spinner size="sm" className="mr-2" /> : null}
            {loading ? "Saving..." : "Save"}
          </Button>
          <Button color="gray" onClick={() => setOpenRescheduleModal(false)} disabled={loading}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Arrived Modal */}
      <Modal show={openArrivedModal} onClose={() => setOpenArrivedModal(false)}>
        <Modal.Header>Confirm Arrival</Modal.Header>
        <Modal.Body>
          <div>
            <Label value="Receipt Number" />
            <TextInput
              value={receiptNumber}
              onChange={(e) => setReceiptNumber(e.target.value)}
              required
              color={arrivedErrors.receiptNumber ? "failure" : "gray"}
            />
            {arrivedErrors.receiptNumber && (
              <p className="text-red-600 text-sm mt-1">{arrivedErrors.receiptNumber}</p>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            gradientDuoTone="redToPink"
            onClick={handleArrivedSubmit}
            disabled={loading}
          >
            {loading ? <Spinner size="sm" className="mr-2" /> : null}
            {loading ? "Confirming..." : "Confirm"}
          </Button>
          <Button color="gray" onClick={() => setOpenArrivedModal(false)} disabled={loading}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Upload File Modal */}
      <Modal show={openUploadModal} onClose={() => setOpenUploadModal(false)}>
        <Modal.Header>Upload Evaluation File</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <div>
              <Label value="Select File" />
              <FileInput
                accept=".jpg, .pdf, .docx, .xlsx"
                id="file"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                required
                color={uploadErrors.selectedFile ? "failure" : "gray"}
              />
              {uploadErrors.selectedFile && (
                <p className="text-red-600 text-sm mt-1">{uploadErrors.selectedFile}</p>
              )}
            </div>
            <div>
              <Label value="Evaluation Result" />
              <div className="flex gap-4 mt-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="evaluationResult"
                    value="Passed"
                    onChange={(e) => setEvaluationResult(e.target.value)}
                    checked={evaluationResult === "Passed"}
                  />
                  Pass
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="evaluationResult"
                    value="Failed"
                    onChange={(e) => setEvaluationResult(e.target.value)}
                    checked={evaluationResult === "Failed"}
                  />
                  Fail
                </label>
              </div>
              {uploadErrors.evaluationResult && (
                <p className="text-red-600 text-sm mt-1">{uploadErrors.evaluationResult}</p>
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            gradientDuoTone="redToPink"
            onClick={handleUploadSubmit}
            disabled={loading}
          >
            {loading ? <Spinner size="sm" className="mr-2" /> : null}
            {loading ? "Uploading..." : "Upload"}
          </Button>
          <Button color="gray" onClick={() => setOpenUploadModal(false)} disabled={loading}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Feedback Modal */}
      <Modal show={openFeedbackModal} onClose={() => setOpenFeedbackModal(false)}>
        <Modal.Header>Submit Feedback</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <div>
              <Label value="Subject" />
              <TextInput
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                color={feedbackErrors.subject ? "failure" : "gray"}
              />
              {feedbackErrors.subject && (
                <p className="text-red-600 text-sm mt-1">{feedbackErrors.subject}</p>
              )}
            </div>
            <div>
              <Label value="Comments" />
              <Textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                required
                color={feedbackErrors.comments ? "failure" : "gray"}
              />
              {feedbackErrors.comments && (
                <p className="text-red-600 text-sm mt-1">{feedbackErrors.comments}</p>
              )}
            </div>
            <div>
              <Label value="Feedback Type" />
              <Select
                value={feedbackType}
                onChange={(e) => setFeedbackType(e.target.value)}
                required
                color={feedbackErrors.feedbackType ? "failure" : "gray"}
              >
                <option value="">Select Feedback Type</option>
                <option value="General Feedback">General Feedback</option>
                <option value="Technical Feedback">Technical Feedback</option>
                <option value="Complaint Feedback">Complaint Feedback</option>
              </Select>
              {feedbackErrors.feedbackType && (
                <p className="text-red-600 text-sm mt-1">{feedbackErrors.feedbackType}</p>
              )}
            </div>
            <div>
              <Label value="Star Rating (Optional)" />
              <TextInput
                type="number"
                min="1"
                max="5"
                value={starRating}
                onChange={(e) => setStarRating(e.target.value)}
                color={feedbackErrors.starRating ? "failure" : "gray"}
              />
              {feedbackErrors.starRating && (
                <p className="text-red-600 text-sm mt-1">{feedbackErrors.starRating}</p>
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            gradientDuoTone="redToPink"
            onClick={handleFeedbackSubmit}
            disabled={loading}
          >
            {loading ? <Spinner size="sm" className="mr-2" /> : null}
            {loading ? "Submitting..." : "Submit"}
          </Button>
          <Button color="gray" onClick={() => setOpenFeedbackModal(false)} disabled={loading}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Error Message */}
      {errorMessage && (
        <div className="text-red-600 text-center mt-4">{errorMessage}</div>
      )}
    </div>
  );
}