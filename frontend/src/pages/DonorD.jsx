import React, { useEffect, useState, useCallback } from 'react';
import { Button, Table, Modal, TextInput, Spinner, FileInput, Select } from 'flowbite-react';
import { DashboardSidebar } from '../components/DashboardSidebar';
import { useDonor } from '../hooks/donor';
import { useAuthContext } from '../hooks/useAuthContext';

export default function DonorDashboard() {
    const { donors, loading, error, fetchDonors, createDonor, updateDonor, deleteDonor } = useDonor();
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedDonor, setSelectedDonor] = useState(null);
    const { user } = useAuthContext();

    const initialDonorData = {
        email: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        dob: '',
        address: '',
        bloodType: '',
        image: null
    };

    const [donorData, setDonorData] = useState(initialDonorData);

    // Fetch donors only when necessary
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

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setDonorData(prev => ({ ...prev, image: file }));
        } else {
            alert('Please select a valid image file.');
        }
    };

    const handleCreate = async () => {
        try {
            const formData = new FormData();
            Object.keys(donorData).forEach(key => {
                if (donorData[key]) formData.append(key, donorData[key]);
            });

            await createDonor(formData);
            setOpenCreateModal(false);
            resetDonorData();
        } catch (err) {
            console.error('Error creating donor:', err);
        }
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
            bloodType: donor.bloodType || '',
            image: null
        });
        setOpenEditModal(true);
    };

    const handleUpdate = async () => {
        if (!selectedDonor) return;
        try {
            const formData = new FormData();
            Object.keys(donorData).forEach(key => {
                if (donorData[key]) formData.append(key, donorData[key]);
            });

            await updateDonor(selectedDonor._id, formData);
            setOpenEditModal(false);
            resetDonorData();
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

    const resetDonorData = () => {
        setDonorData(initialDonorData);
    };

    return (
        <div className='flex min-h-screen'>
            <DashboardSidebar />
            <div className="flex-1 p-6">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Donor Dashboard</h1>
                    <Button onClick={() => setOpenCreateModal(true)}>Add New Donor</Button>
                </div>

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

                {/* Create Modal */}
                <Modal show={openCreateModal} onClose={() => setOpenCreateModal(false)}>
                    <Modal.Header>Add New Donor</Modal.Header>
                    <Modal.Body>
                        <TextInput id="firstName" placeholder="First Name" value={donorData.firstName} onChange={handleChange} />
                        <TextInput id="lastName" placeholder="Last Name" value={donorData.lastName} onChange={handleChange} />
                        <TextInput id="email" placeholder="Email" value={donorData.email} onChange={handleChange} />
                        <TextInput id="phoneNumber" placeholder="Phone Number" value={donorData.phoneNumber} onChange={handleChange} />
                        <TextInput id="dob" type="date" value={donorData.dob} onChange={handleChange} />
                        <TextInput id="address" placeholder="Address" value={donorData.address} onChange={handleChange} />
                        <Select id="bloodType" value={donorData.bloodType} onChange={handleChange}>
                            <option value="">Select Blood Type</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                        </Select>
                        <FileInput onChange={handleImageUpload} />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={handleCreate}>Create</Button>
                        <Button color="gray" onClick={() => setOpenCreateModal(false)}>Cancel</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
}
