import React, { useEffect } from 'react';
import { Button, Table } from 'flowbite-react';
import { DashboardSidebar } from '../components/DashboardSidebar';
import { useEmergencyBR } from '../hooks/useEmergencyBR';

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
    }, []);

    return (
        <div className='flex min-h-screen'>
            {/* Sidebar */}
            <DashboardSidebar />

            <div className="flex-1 p-6">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Emergency Blood Requests</h1>
                    <Button onClick={() => alert('Add functionality to be implemented')}>Add New Request</Button>
                </div>

                {/* Error Handling */}
                {error && <p className="text-red-500">Error: {error}</p>}

                {/* Loading State */}
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <Table hoverable>
                        <Table.Head>
                            <Table.HeadCell>ID</Table.HeadCell>
                            <Table.HeadCell>Name</Table.HeadCell>
                            <Table.HeadCell>Phone Number</Table.HeadCell>
                            <Table.HeadCell>Blood Type</Table.HeadCell>
                            <Table.HeadCell>Critical Level</Table.HeadCell>
                            <Table.HeadCell>Actions</Table.HeadCell>
                        </Table.Head>
                        <Table.Body>
                            {emergencyRequests.map((request) => (
                                <Table.Row key={request._id}>
                                    <Table.Cell>{request.emergencyBRId}</Table.Cell>
                                    <Table.Cell>{request.name}</Table.Cell>
                                    <Table.Cell>{request.phoneNumber}</Table.Cell>
                                    <Table.Cell>{request.patientBlood}</Table.Cell>
                                    <Table.Cell>{request.criticalLevel}</Table.Cell>
                                    <Table.Cell>
                                        <Button size="xs" className="mr-2">Edit</Button>
                                        <Button size="xs" color="failure" onClick={() => deleteEmergencyRequest(request._id)}>
                                            Delete
                                        </Button>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                )}
            </div>
        </div>
    );
}
