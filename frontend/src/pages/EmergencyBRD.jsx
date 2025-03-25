import React, { useEffect, useState } from "react";
import { Button, Table, Spinner, Badge, Modal } from "flowbite-react";
import { DashboardSidebar } from "../components/DashboardSidebar";
import { useEmergencyBR } from "../hooks/useEmergencyBR";

export default function EmergencyBD() {
    const {
        emergencyRequests,
        fetchEmergencyRequests,
        deleteEmergencyRequest,
        updateEmergencyRequestStatus, // New method for updating status
        loading,
        error,
    } = useEmergencyBR();

    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchEmergencyRequests();
    }, [fetchEmergencyRequests]);

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this request?")) {
            deleteEmergencyRequest(id);
        }
    };

    const handleViewDetails = (request) => {
        setSelectedRequest(request);
        setIsModalOpen(true);
    };

    const handleAccept = (id) => {
        updateEmergencyRequestStatus(id, "Accepted");
    };

    const handleDecline = (id) => {
        updateEmergencyRequestStatus(id, "Declined");
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
            {/* Sidebar */}
            <div className="bg-gray-100">
                <DashboardSidebar />
            </div>

            <div className="flex-1 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Emergency Blood Requests</h1>
                </div>

                {/* Error Message */}
                {error && <p className="text-red-500 mb-4">Error: {error}</p>}

                {/* Loading Spinner */}
                {loading && (
                    <div className="flex justify-center">
                        <Spinner size="lg" />
                    </div>
                )}

                {/* Table Display */}
                {!loading && emergencyRequests.length > 0 ? (
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
                                        key={request._id}
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
                                        <Table.Cell className="text-gray-800">
                                            {request.patientBlood}
                                        </Table.Cell>
                                        <Table.Cell className="text-gray-800">
                                            {request.units}
                                        </Table.Cell>
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
                                                            onClick={() => handleAccept(request._id)}
                                                            className="font-medium"
                                                        >
                                                            Accept
                                                        </Button>
                                                        <Button
                                                            size="xs"
                                                            gradientDuoTone="redToYellow"
                                                            onClick={() => handleDecline(request._id)}
                                                            className="font-medium"
                                                        >
                                                            Decline
                                                        </Button>
                                                    </>
                                                )}
                                                <Button
                                                    size="xs"
                                                    color="failure"
                                                    onClick={() => handleDelete(request._id)}
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
                    !loading && (
                        <p className="text-gray-500 text-center text-lg mt-10">
                            No emergency requests found.
                        </p>
                    )
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
                                                ? new Date(selectedRequest.withinDate).toLocaleDateString(
                                                      "en-US",
                                                      {
                                                          year: "numeric",
                                                          month: "short",
                                                          day: "numeric",
                                                      }
                                                  )
                                                : "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600 font-semibold">Status:</p>
                                        <Badge color={getStatusColor(selectedRequest.activeStatus)}>
                                            {selectedRequest.activeStatus}
                                        </Badge>
                                    </div>
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
            </div>
        </div>
    );
}