import { useEffect, useState, useMemo,  } from "react";
import { Table, Button, Modal, Textarea, Label, Badge, Spinner, Select, TextInput } from "flowbite-react";
import { useEmergencyBR } from "../hooks/useEmergencyBR";
import { useAuthContext } from "../hooks/useAuthContext";
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
  const [acceptData, setAcceptData] = useState({ acceptedBy: '', acceptedByType: '' });
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [declineId, setDeclineId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
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
    let Type, by = null;
    if(user.role === "Donor"){
      by = user.userObj._id
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

  const criticalLevelColors = useMemo(() => ({
    High: "failure",
    Medium: "warning",
    Low: "success",
  }), []);

  const statusColors = useMemo(() => ({
    Pending: "warning",
    Accepted: "success",
    Declined: "failure",
  }), []);

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
          {emergencyRequests.map((request) => (
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
              <Table.Cell className="space-x-2">
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
                  color="success"
                  onClick={() => {handleAccept(request._id, Donor, Hospital)}}
                  disabled={request.acceptStatus === "Accepted"}
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
                  disabled={request.acceptStatus === "Declined"}
                >
                  Decline
                </Button>
                <Button
                  size="xs"
                  color="gray"
                  onClick={() => confirmDelete(request._id)}
                >
                  Delete
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
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
    </div>
  );
};

export default EmergencyBRAdmin;