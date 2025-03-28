import { useEffect, useState, useMemo } from "react";
import { Table, Button, Modal, Textarea, Badge, Spinner } from "flowbite-react";
import { useEmergencyBR } from "../hooks/useEmergencyBR";
import { useAuthContext } from "../hooks/useAuthContext";

//usage of hooks to connect to the backend 
const EmergencyBRAdmin = () => {
  const {
    emergencyRequests,
    fetchEmergencyRequests,
    validateEmergencyRequest,
    acceptEmergencyRequest,
    declineEmergencyRequest,
    deleteEmergencyRequest,
    loading,
    error,
  } = useEmergencyBR();

  const [showValidateModal, setShowValidateModal] = useState(false);
  const [validateId, setValidateId] = useState(null);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [acceptData, setAcceptData] = useState({ acceptedBy: "", acceptedByType: "" });
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [declineId, setDeclineId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const { user } = useAuthContext();
  const userId = user?.userObj?._id;
  const Donor = user?.userObj?.role === "Donor";
  const Hospital = user?.userObj?.role === "Hospital";
  const Manager = user?.userObj?.role === "Manager";

  useEffect(() => {
    fetchEmergencyRequests();
  }, [fetchEmergencyRequests]);

  const handleValidate = async () => {
    await validateEmergencyRequest(validateId);
    setShowValidateModal(false);
  };

  const handleAccept = async (acceptId) => {
    let Type = null,
      by = null;
    if (user.role === "Donor") {
      by = user.userObj._id;
      Type = "Donor";
    } else if (user.role === "Hospital") {
      Type = "Hospital";
      by = user.userObj._id;
    }

    if (Type === null) {
      alert("Please provide both Accepted By ID and Type.");
      return;
    }

    await acceptEmergencyRequest(acceptId, by, Type);
    setShowAcceptModal(false);
  };

  const submitDecline = async () => {
    if (!declineReason.trim()) {
      alert("Please provide a decline reason.");
      return;
    }
    await declineEmergencyRequest(declineId, declineReason);
    setShowDeclineModal(false);
    setDeclineReason("");
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const executeDelete = async () => {
    await deleteEmergencyRequest(deleteId);
    setShowDeleteModal(false);
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const criticalLevelColors = useMemo(
    () => ({
      High: "failure",
      Medium: "warning",
      Low: "success",
    }),
    []
  );

  const statusColors = useMemo(
    () => ({
      Pending: "warning",
      Accepted: "success",
      Declined: "failure",
    }),
    []
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Emergency Blood Requests</h1>
      {loading && <Spinner className="mb-4" />}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <Table>
        <Table.Head>
          <Table.HeadCell>Patient Name</Table.HeadCell>
          <Table.HeadCell>Hospital</Table.HeadCell>
          <Table.HeadCell>Blood Group</Table.HeadCell>
          <Table.HeadCell>Critical Level</Table.HeadCell>
          <Table.HeadCell>Status</Table.HeadCell>
          <Table.HeadCell>Actions</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {emergencyRequests.map((request) => {
            const isActionDisabled = request.acceptStatus !== "Pending"; // Both buttons disappear if not Pending

            return (
              <Table.Row key={request._id} className="even:bg-gray-50">
                <Table.Cell>{request.name}</Table.Cell>
                <Table.Cell>{request.hospitalName}</Table.Cell>
                <Table.Cell>{request.patientBlood}</Table.Cell>
                <Table.Cell>
                  <Badge color={criticalLevelColors[request.criticalLevel] || "gray"}>
                    {request.criticalLevel}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <Badge color={statusColors[request.acceptStatus] || "gray"}>
                    {request.acceptStatus}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="xs"
                      color="purple"
                      onClick={() => {
                        setValidateId(request._id);
                        setShowValidateModal(true);
                      }}
                      disabled={request.activeStatus === "Active"}
                    >
                      Validate
                    </Button>
                    <Button
                      size="xs"
                      color="gray"
                      onClick={() => confirmDelete(request._id)}
                    >
                      Delete
                    </Button>
                    {!isActionDisabled ? (
                      <>
                        <Button
                          size="xs"
                          color="success"
                          onClick={() => handleAccept(request._id)}
                        >
                          Accept
                        </Button>
                        <Button
                          size="xs"
                          color="failure"
                          onClick={() => {
                            setDeclineId(request._id);
                            setShowDeclineModal(true);
                          }}
                        >
                          Decline
                        </Button>
                      </>
                    ) : null}
                    <Button
                      size="xs"
                      color="blue"
                      onClick={() => handleViewDetails(request)}
                    >
                      Details
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>

      {/* Validate Modal */}
      <Modal show={showValidateModal} onClose={() => setShowValidateModal(false)}>
        <Modal.Header>Validate Request</Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to validate this request? This will set it to Active.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={() => setShowValidateModal(false)}>
            Cancel
          </Button>
          <Button color="purple" onClick={handleValidate}>
            Validate
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Decline Modal */}
      <Modal show={showDeclineModal} onClose={() => setShowDeclineModal(false)}>
        <Modal.Header>Decline Request</Modal.Header>
        <Modal.Body>
          <Textarea
            placeholder="Enter decline reason..."
            value={declineReason}
            onChange={(e) => setDeclineReason(e.target.value)}
            required
          />
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={() => setShowDeclineModal(false)}>
            Cancel
          </Button>
          <Button color="failure" onClick={submitDecline}>
            Decline
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <Modal.Header>Confirm Delete</Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this request? This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button color="failure" onClick={executeDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Details Modal */}
      <Modal show={showDetailsModal} onClose={() => setShowDetailsModal(false)} size="lg">
        <Modal.Header>Emergency Blood Request Details</Modal.Header>
        <Modal.Body>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 font-semibold">Request ID:</p>
                  <p>{selectedRequest._id}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-semibold">Patient Name:</p>
                  <p>{selectedRequest.name}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-semibold">Hospital:</p>
                  <p>{selectedRequest.hospitalName}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-semibold">Blood Group:</p>
                  <p>{selectedRequest.patientBlood}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-semibold">Critical Level:</p>
                  <Badge color={criticalLevelColors[selectedRequest.criticalLevel] || "gray"}>
                    {selectedRequest.criticalLevel}
                  </Badge>
                </div>
                <div>
                  <p className="text-gray-600 font-semibold">Status:</p>
                  <Badge color={statusColors[selectedRequest.acceptStatus] || "gray"}>
                    {selectedRequest.acceptStatus}
                  </Badge>
                </div>
                {selectedRequest.units && (
                  <div>
                    <p className="text-gray-600 font-semibold">Units:</p>
                    <p>{selectedRequest.units}</p>
                  </div>
                )}
                {selectedRequest.reason && (
                  <div>
                    <p className="text-gray-600 font-semibold">Reason:</p>
                    <p>{selectedRequest.reason}</p>
                  </div>
                )}
                {selectedRequest.withinDate && (
                  <div>
                    <p className="text-gray-600 font-semibold">Needed By:</p>
                    <p>
                      {new Date(selectedRequest.withinDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                )}
                {selectedRequest.proofDocument && (
                  <div className="col-span-2">
                    <p className="text-gray-600 font-semibold">Proof Document:</p>
                    <img
                      src={selectedRequest.proofDocument}
                      alt="Proof Document"
                      className="w-32 h-32 object-cover rounded-lg shadow-sm border border-gray-200 mt-2"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={() => setShowDetailsModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EmergencyBRAdmin;