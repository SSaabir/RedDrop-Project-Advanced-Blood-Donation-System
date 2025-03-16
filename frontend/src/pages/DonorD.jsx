import React, { useEffect, useState, useCallback } from 'react';
import { Button, Table, Modal, TextInput, Spinner } from 'flowbite-react';
import { DashboardSidebar } from '../components/DashboardSidebar';
import { useDonor } from '../hooks/donor';
import { useAuthContext } from '../hooks/useAuthContext';

export default function DonorDashboard() {
    const { donors, loading, error, fetchDonors, updateDonor, deleteDonor } = useDonor();
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedDonor, setSelectedDonor] = useState(null);
    
    const initialDonorData = {
        email: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        dob: '',
        address: '',
        bloodType: ''
    };

    const [donorData, setDonorData] = useState(initialDonorData);

    const loadDonors = useCallback(() => {
        fetchDonors();
    }, [fetchDonors]);

    useEffect(() => {
        loadDonors();
    }, [loadDonors]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setDonorData(prev => ({ ...prev, [id]: value }));
    };

    const handleEdit = (donor) => {
        setSelectedDonor(donor);
        setDonorData({
            email: donor.email || '',
            firstName: donor.firstName || '',
            lastName: donor.lastName || '',
            phoneNumber: donor.phoneNumber || '',
            dob: donor.dob ? donor.dob.split('T')[0] : '',
            address: donor.address || '',
            bloodType: donor.bloodType || ''
        });
        setOpenEditModal(true);
    };

    const handleUpdate = async () => {
        if (!selectedDonor) return;
        try {
            await updateDonor(selectedDonor._id, donorData);
            setOpenEditModal(false);
        } catch (err) {
            console.error('Error updating donor:', err);
        }
    };

    const handleDelete = (donor) => {
        setSelectedDonor(donor);
        setOpenDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedDonor) return;
        try {
            await deleteDonor(selectedDonor._id);
            setOpenDeleteModal(false);
        } catch (err) {
            console.error('Error deleting donor:', err);
        }
    };

    return (
        <div className='flex min-h-screen'>
            <DashboardSidebar />
            <div className="flex-1 p-6">
                <h1 className="text-2xl font-bold mb-4">Donor Dashboard</h1>

                {loading && <Spinner />}
                {error && <p className="text-red-500">{error}</p>}

                <Table hoverable>
                    <Table.Head>
                        <Table.HeadCell>ID</Table.HeadCell>
                        <Table.HeadCell>Name</Table.HeadCell>
                        <Table.HeadCell>Email</Table.HeadCell>
                        <Table.HeadCell>Phone</Table.HeadCell>
                        <Table.HeadCell>Blood Type</Table.HeadCell>
                        <Table.HeadCell>Actions</Table.HeadCell>
                    </Table.Head>
                    <Table.Body>
                        {donors.map(donor => (
                            <Table.Row key={donor._id}>
                                <Table.Cell>{donor._id}</Table.Cell>
                                <Table.Cell>{`${donor.firstName} ${donor.lastName}`}</Table.Cell>
                                <Table.Cell>{donor.email}</Table.Cell>
                                <Table.Cell>{donor.phoneNumber}</Table.Cell>
                                <Table.Cell>{donor.bloodType}</Table.Cell>
                                <Table.Cell>
                                    <Button size="xs" className="mr-2" onClick={() => handleEdit(donor)}>Edit</Button>
                                    <Button size="xs" color="failure" onClick={() => handleDelete(donor)}>Delete</Button>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>

                {/* Edit Modal */}
                <Modal show={openEditModal} onClose={() => setOpenEditModal(false)}>
                    <Modal.Header>Edit Donor</Modal.Header>
                    <Modal.Body>
                        <TextInput id="firstName" placeholder="First Name" value={donorData.firstName} onChange={handleChange} />
                        <TextInput id="lastName" placeholder="Last Name" value={donorData.lastName} onChange={handleChange} />
                        <TextInput id="email" placeholder="Email" value={donorData.email} onChange={handleChange} />
                        <TextInput id="phoneNumber" placeholder="Phone Number" value={donorData.phoneNumber} onChange={handleChange} />
                        <TextInput id="dob" type="date" value={donorData.dob} onChange={handleChange} />
                        <TextInput id="address" placeholder="Address" value={donorData.address} onChange={handleChange} />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={handleUpdate}>Update</Button>
                        <Button color="gray" onClick={() => setOpenEditModal(false)}>Cancel</Button>
                    </Modal.Footer>
                </Modal>

                {/* Delete Modal */}
                <Modal show={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
                    <Modal.Header>Confirm Delete</Modal.Header>
                    <Modal.Body>
                        <p>Are you sure you want to delete this donor?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button color="failure" onClick={handleConfirmDelete}>Delete</Button>
                        <Button color="gray" onClick={() => setOpenDeleteModal(false)}>Cancel</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
}
