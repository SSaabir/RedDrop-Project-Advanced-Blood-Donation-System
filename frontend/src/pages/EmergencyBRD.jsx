import React, { useEffect } from "react";
import { Button, Table, Spinner } from "flowbite-react";
import { DashboardSidebar } from "../components/DashboardSidebar";
import { useEmergencyBR } from "../hooks/useEmergencyBR";

export default function EmergencyBD() {
    const {
        emergencyRequests,
        fetchEmergencyRequests,
        deleteEmergencyRequest,
        loading,
        error,
    } = useEmergencyBR();

    useEffect(() => {
        fetchEmergencyRequests();
    }, [fetchEmergencyRequests]);

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this request?")) {
            deleteEmergencyRequest(id);
        }
    };

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <DashboardSidebar />

            <div className="flex-1 p-6">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Emergency Blood Requests</h1>
                </div>

                {/* Error Message */}
                {error && <p className="text-red-500">Error: {error}</p>}

                {/* Loading Spinner */}
                {loading && (
                    <div className="flex justify-center">
                        <Spinner size="lg" />
                    </div>
                )}

                {/* Table Display */}
                {!loading && emergencyRequests.length > 0 ? (
                    <Table hoverable className="w-full">
                        <Table.Head>
                            <Table.HeadCell>Full Name</Table.HeadCell>
                            <Table.HeadCell>ID Number</Table.HeadCell>
                            <Table.HeadCell>Hospital</Table.HeadCell>
                            <Table.HeadCell>Address</Table.HeadCell>
                            <Table.HeadCell>Phone</Table.HeadCell>
                            <Table.HeadCell>Blood Type</Table.HeadCell>
                            <Table.HeadCell>Units</Table.HeadCell>
                            <Table.HeadCell>Reason</Table.HeadCell>
                            <Table.HeadCell>Image</Table.HeadCell>
                            <Table.HeadCell>Actions</Table.HeadCell>
                        </Table.Head>
                        <Table.Body>
                            {emergencyRequests.map((request) => (
                                <Table.Row key={request._id}>
                                    <Table.Cell>{request.name}</Table.Cell>
                                    <Table.Cell>{request.proofOfIdentificationNumber}</Table.Cell>
                                    <Table.Cell>{request.hospitalName}</Table.Cell>
                                    <Table.Cell>{request.address}</Table.Cell>
                                    <Table.Cell>{request.phoneNumber}</Table.Cell>
                                    <Table.Cell>{request.patientBlood}</Table.Cell>
                                    <Table.Cell>{request.numberOfUnits}</Table.Cell>
                                    <Table.Cell>{request.reason}</Table.Cell>
                                    <Table.Cell>
                                        {request.proofDocument ? (
                                            <img
                                                src={`/uploads/${request.proofDocument}`}
                                                alt="Proof Document"
                                                className="w-16 h-16 object-cover rounded shadow"
                                            />
                                        ) : (
                                            <span className="text-gray-500">No Image</span>
                                        )}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Button size="xs" className="mr-2">
                                            Edit
                                        </Button>
                                        <Button
                                            size="xs"
                                            color="failure"
                                            onClick={() => handleDelete(request._id)}
                                        >
                                            Delete
                                        </Button>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                ) : (
                    !loading && <p className="text-gray-500 text-center">No emergency requests found.</p>
                )}
            </div>
        </div>
    );
}
