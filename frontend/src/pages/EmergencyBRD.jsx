import { useEffect, useState, useMemo } from "react";
import { Table, Button, Modal, Textarea, Badge, Spinner } from "flowbite-react";
import{ useEmergencyBR } from "../hooks/useEmergencyBR";

const EmergencyBRAdmin = () => {
  const {
    emergencyRequests,
    fetchEmergencyRequests,
    acceptEmergencyRequest,
    declineEmergencyRequest,
    deleteEmergencyRequest,
    loading,
    error,
  } = useEmergencyBR();

  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [declineId, setDeclineId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchEmergencyRequests();
  }, []);

  const handleAccept = async (emergencyBRId) => {
    await acceptEmergencyRequest(emergencyBRId);
  };

  const submitDecline = async () => {
    if (!declineReason.trim()) return;
    await declineEmergencyRequest(declineId, declineReason);
    setShowDeclineModal(false);
  };

  const confirmDelete = (emergencyBRId) => {
    setDeleteId(emergencyBRId);
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
      {loading && <Spinner />}
      {error && <p className="text-red-500">{error}</p>}
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
              <Table.Cell>{request.hospitalId}</Table.Cell>
              <Table.Cell>{request.bloodGroup}</Table.Cell>
              <Table.Cell>
                <Badge color={criticalLevelColors[request.criticalLevel] || "gray"}>
                  {request.criticalLevel}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <Badge color={statusColors[request.activeStatus] || "gray"}>
                  {request.activeStatus}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <Button size="xs" color="success" onClick={() => handleAccept(request.emergencyBRId)}>
                  Accept
                </Button>
                <Button size="xs" color="failure" onClick={() => { setDeclineId(request.emergencyBRId); setShowDeclineModal(true); }}>
                  Decline
                </Button>
                <Button size="xs" color="failure" onClick={() => confirmDelete(request.emergencyBRId)}>
                  Delete
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      <Modal show={showDeclineModal} onClose={() => setShowDeclineModal(false)}>
        <Modal.Header>Decline Request</Modal.Header>
        <Modal.Body>
          <Textarea placeholder="Enter decline reason..." value={declineReason} onChange={(e) => setDeclineReason(e.target.value)} />
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={() => setShowDeclineModal(false)}>Cancel</Button>
          <Button color="failure" onClick={submitDecline}>Decline</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <Modal.Header>Confirm Delete</Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this request? This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button color="failure" onClick={executeDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EmergencyBRAdmin;
