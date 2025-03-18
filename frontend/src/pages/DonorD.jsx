import React, { useEffect, useState, useCallback } from 'react';
import { Button, Table, Modal, TextInput, Spinner } from 'flowbite-react';
import { DashboardSidebar } from '../components/DashboardSidebar';
import { useDonor } from '../hooks/donor';

export default function DonorDashboard() {
    const { donors, loading, error, fetchDonors, updateDonor, deleteDonor } = useDonor();
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedDonor, setSelectedDonor] = useState(null);
    
    const initialDonorData = {
        email: '', firstName: '', lastName: '', gender: '', phoneNumber: '', password: '',
        dob: '', bloodType: '', city: '', nic: ''
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
        if (!donor || !donor._id) return;
        setSelectedDonor(donor);
        
        setDonorData({
            email: donor.email || '',
            firstName: donor.firstName || '',
            lastName: donor.lastName || '',
            gender: donor.gender || '',
            phoneNumber: donor.phoneNumber || '',
            password: '', // Keep empty
            dob: donor.dob ? donor.dob.split('T')[0] : '',
            bloodType: donor.bloodType || '',
            city: donor.city || '',
            nic: donor.nic || ''
        });
    
        console.log("Editing donor:", donor); // Debugging log
        setOpenEditModal(true);
    };
    

    const handleUpdate = async () => {
        if (!selectedDonor || !selectedDonor._id) return;
        try {
            await updateDonor(selectedDonor._id, donorData);
            setOpenEditModal(false);
            loadDonors(); // Refresh the list
        } catch (err) {
            console.error('Error updating donor:', err);
        }
    };

    const handleDelete = (donor) => {
        if (!donor || !donor._id) return;
        setSelectedDonor(donor);
        setOpenDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedDonor || !selectedDonor._id) return;
        try {
            await deleteDonor(selectedDonor._id);
            setOpenDeleteModal(false);
            loadDonors(); // Refresh the list
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
                        <Table.HeadCell>Gender</Table.HeadCell>
                        <Table.HeadCell>Email</Table.HeadCell>
                        <Table.HeadCell>Phone</Table.HeadCell>
                        <Table.HeadCell>Blood Type</Table.HeadCell>
                        <Table.HeadCell>City</Table.HeadCell>
                        <Table.HeadCell>NIC</Table.HeadCell>
                        <Table.HeadCell>Actions</Table.HeadCell>
                    </Table.Head>
                    <Table.Body>
                        {donors.map(donor => (
                            <Table.Row key={donor._id}>
                                <Table.Cell>{donor._id}</Table.Cell>
                                <Table.Cell>{`${donor.firstName} ${donor.lastName}`}</Table.Cell>
                                <Table.Cell>{donor.gender}</Table.Cell>
                                <Table.Cell>{donor.email}</Table.Cell>
                                <Table.Cell>{donor.phoneNumber}</Table.Cell>
                                <Table.Cell>{donor.bloodType}</Table.Cell>
                                <Table.Cell>{donor.city}</Table.Cell>
                                <Table.Cell>{donor.nic}</Table.Cell>
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
                        {Object.keys(initialDonorData).map((key) => (
                            <TextInput key={key} id={key} placeholder={key} value={donorData[key]} onChange={handleChange} />
                        ))}
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
