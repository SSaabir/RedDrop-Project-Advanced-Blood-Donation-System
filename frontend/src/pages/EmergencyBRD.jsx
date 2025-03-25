import React, { useEffect, useState } from "react";
import { Button, Table, Spinner, Badge, Modal, Alert, TextInput } from "flowbite-react"; // Added TextInput
import { DashboardSidebar } from "../components/DashboardSidebar";
import { useEmergencyBR } from "../hooks/useEmergencyBR";

export default function EmergencyBD() {
  const {
    emergencyRequests,
    fetchEmergencyRequests,
    deleteEmergencyRequest,
    acceptEmergencyRequest,
    declineEmergencyRequest,
    loading,
    error,
  } = useEmergencyBR();

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null); // Add success feedback
  const [declineReason, setDeclineReason] = useState(""); // New state for decline reason
  const [showDeclineModal, setShowDeclineModal] = useState(false); // New state for decline modal
  const [declineId, setDeclineId] = useState(null); // New state to track decline ID

  useEffect(() => {
    fetchEmergencyRequests();
  }, [fetchEmergencyRequests]);

  const handleDelete = (emergencyBRId) => {
    console.log("Attempting to delete ID:", emergencyBRId);
    if (window.confirm("Are you sure you want to delete this request?")) {
      deleteEmergencyRequest(emergencyBRId).then(() => {
        setSuccessMessage("Request deleted successfully!");
        setTimeout(() => setSuccessMessage(null), 3000); // Clear after 3s
      });
    }
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleAccept = async (emergencyBRId) => {
    try {
      await acceptEmergencyRequest(emergencyBRId);
      setSuccessMessage("Request accepted successfully! Blood reserved.");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      // Error is handled by the hook's error state
    }
  };

  const handleDecline = (emergencyBRId) => {
    setDeclineId(emergencyBRId);
    setDeclineReason(""); // Reset reason
    setShowDeclineModal(true); // Show modal for reason input
  };

  const submitDecline = async () => {
    if (!declineReason.trim()) {
      alert("Please provide a reason for declining.");
      return;
    }
    try {
      await declineEmergencyRequest(declineId, declineReason);
      setSuccessMessage("Request declined successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
      setShowDeclineModal(false);
    } catch (err) {
      // Error is handled by the hook's error state
    }
  };

  const getCriticalLevelColor = (level) => {
    switch (level) {
      case "High":
        return "failure";
      case "Medium":
        return "warning";
      case "Low":
        return "success";
      default:
        return "gray";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "warning";
      case "Accepted":
        return "success";
      case "Declined":
        return "failure";
      default:
        return "gray";
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <div className="bg-gray-100">
        <DashboardSidebar />
      </div>

      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Emergency Blood Requests</h1>
        </div>

        {error && <Alert color="failure" className="mb-4">{error}</Alert>}
        {successMessage && <Alert color="success" className="mb-4">{successMessage}</Alert>}

        {loading ? (
          <div className="flex justify-center">
            <Spinner size="lg" />
          </div>
        ) : emergencyRequests.length > 0 ? (
          <div className="overflow-x-auto shadow-lg rounded-lg">
            <Table hoverable className="w-full bg-white">
              <Table.Head>
                <Table.HeadCell className="bg-gray-200 text-gray-700 font-semibold text-sm uppercase tracking-wider">
                  Request ID
                </Table.HeadCell>
                <Table.HeadCell className="bg-gray-200 text-gray-700 font-semibold text-sm uppercase tracking-wider">
                  Full Name
                </Table.HeadCell>
                <Table.HeadCell className="bg-gray-200 text-gray-700 font-semibold text-sm uppercase tracking-wider">
                  Hospital
                </Table.HeadCell>
                <Table.HeadCell className="bg-gray-200 text-gray-700 font-semibold text-sm uppercase tracking-wider">
                  Blood Type
                </Table.HeadCell>
                <Table.HeadCell className="bg-gray-200 text-gray-700 font-semibold text-sm uppercase tracking-wider">
                  Units
                </Table.HeadCell>
                <Table.HeadCell className="bg-gray-200 text-gray-700 font-semibold text-sm uppercase tracking-wider">
                  Critical Level
                </Table.HeadCell>
                <Table.HeadCell className="bg-gray-200 text-gray-700 font-semibold text-sm uppercase tracking-wider">
                  Status
                </Table.HeadCell>
                <Table.HeadCell className="bg-gray-200 text-gray-700 font-semibold text-sm uppercase tracking-wider">
                  Actions
                </Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {emergencyRequests.map((request, index) => (
                  <Table.Row
                    key={request.emergencyBRId}
                    className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <Table.Cell className="text-gray-800 font-medium truncate max-w-[150px]">
                      {request.emergencyBRId}
                    </Table.Cell>
                    <Table.Cell className="text-gray-800 font-medium truncate max-w-[150px]">
                      {request.name}
                    </Table.Cell>
                    <Table.Cell className="text-gray-800 truncate max-w-[150px]">
                      {request.hospitalName}
                    </Table.Cell>
                    <Table.Cell className="text-gray-800">{request.patientBlood}</Table.Cell>
                    <Table.Cell className="text-gray-800">{request.units}</Table.Cell>
                    <Table.Cell>
                      <Badge color={getCriticalLevelColor(request.criticalLevel)}>
                        {request.criticalLevel}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge color={getStatusColor(request.activeStatus)}>
                        {request.activeStatus}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex space-x-2">
                        <Button
                          size="xs"
                          gradientDuoTone="purpleToBlue"
                          onClick={() => handleViewDetails(request)}
                          className="font-medium"
                        >
                          Details
                        </Button>
                        {request.activeStatus === "Pending" && (
                          <>
                            <Button
                              size="xs"
                              gradientDuoTone="greenToBlue"
                              onClick={() => handleAccept(request.emergencyBRId)}
                              className="font-medium"
                            >
                              Accept
                            </Button>
                            <Button
                              size="xs"
                              gradientDuoTone="redToYellow"
                              onClick={() => handleDecline(request.emergencyBRId)}
                              className="font-medium"
                            >
                              Decline
                            </Button>
                          </>
                        )}
                        <Button
                          size="xs"
                          color="failure"
                          onClick={() => handleDelete(request.emergencyBRId)}
                        >
                          Delete
                        </Button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        ) : (
          <p className="text-gray-500 text-center text-lg mt-10">
            No emergency requests found or data not loaded.
          </p>
        )}

        {/* Modal for Viewing Details */}
        <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} size="lg">
          <Modal.Header>Emergency Blood Request Details</Modal.Header>
          <Modal.Body>
            {selectedRequest && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600 font-semibold">Request ID:</p>
                    <p>{selectedRequest.emergencyBRId}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-semibold">Full Name:</p>
                    <p>{selectedRequest.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-semibold">ID Number:</p>
                    <p>{selectedRequest.proofOfIdentificationNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-semibold">Hospital:</p>
                    <p>{selectedRequest.hospitalName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-semibold">Address:</p>
                    <p>{selectedRequest.address}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-semibold">Phone:</p>
                    <p>{selectedRequest.phoneNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-semibold">Blood Type:</p>
                    <p>{selectedRequest.patientBlood}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-semibold">Units:</p>
                    <p>{selectedRequest.units}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-semibold">Reason:</p>
                    <p>{selectedRequest.reason}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-semibold">Critical Level:</p>
                    <Badge color={getCriticalLevelColor(selectedRequest.criticalLevel)}>
                      {selectedRequest.criticalLevel}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-gray-600 font-semibold">Needed By:</p>
                    <p>
                      {selectedRequest.withinDate
                        ? new Date(selectedRequest.withinDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-semibold">Status:</p>
                    <Badge color={getStatusColor(selectedRequest.activeStatus)}>
                      {selectedRequest.activeStatus}
                    </Badge>
                  </div>
                  {/* Added Decline Reason Display */}
                  {selectedRequest.activeStatus === "Declined" && selectedRequest.declineReason && (
                    <div>
                      <p className="text-gray-600 font-semibold">Decline Reason:</p>
                      <p>{selectedRequest.declineReason}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-gray-600 font-semibold">Created At:</p>
                    <p>
                      {new Date(selectedRequest.createdAt).toLocaleString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-semibold">Updated At:</p>
                    <p>
                      {new Date(selectedRequest.updatedAt).toLocaleString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-600 font-semibold">Image:</p>
                    {selectedRequest.proofDocument ? (
                      <img
                        src={selectedRequest.proofDocument}
                        alt="Proof Document"
                        className="w-32 h-32 object-cover rounded-lg shadow-sm border border-gray-200 mt-2"
                      />
                    ) : (
                      <span className="text-gray-500 italic">No Image</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => setIsModalOpen(false)}>Close</Button>
          </Modal.Footer>
        </Modal>

        {/* Added Decline Reason Modal */}
        <Modal show={showDeclineModal} onClose={() => setShowDeclineModal(false)} size="md">
          <Modal.Header>Decline Request</Modal.Header>
          <Modal.Body>
            <div className="space-y-4">
              <p>Please provide a reason for declining this request:</p>
              <TextInput
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                placeholder="e.g., Insufficient stock"
                required
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button color="gray" onClick={() => setShowDeclineModal(false)}>Cancel</Button>
            <Button color="failure" onClick={submitDecline}>Decline</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}