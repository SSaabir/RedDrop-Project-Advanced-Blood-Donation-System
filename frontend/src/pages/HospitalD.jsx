import React, { useEffect, useState, useCallback } from 'react';
import { Button, Table, Modal, TextInput, Spinner } from 'flowbite-react';
import { DashboardSidebar } from '../components/DashboardSidebar';
import { useHospital } from '../hooks/hospital'; // Assuming you have hooks for hospitals
import { useAuthContext } from '../hooks/useAuthContext';

export default function HospitalDashboard() {
    const { hospitals, loading, error, fetchHospitals, updateHospital, deleteHospital } = useHospital();
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedHospital, setSelectedHospital] = useState(null);

    const initialHospitalData = {
        name: '',
        city: '',
        phoneNumber: '',  // Changed from 'phone' to 'phoneNumber'
        email: '',
        establishedYear: ''
    };

    const [hospitalData, setHospitalData] = useState(initialHospitalData);

    // Fetch hospitals only when necessary
    const loadHospitals = useCallback(() => {
        fetchHospitals();
    }, [fetchHospitals]);

    useEffect(() => {
        loadHospitals();
    }, [loadHospitals]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setHospitalData(prev => ({ ...prev, [id]: value }));
    };

    const handleEdit = (hospital) => {
        setSelectedHospital(hospital);
        setHospitalData({
            name: hospital.name || '',
            city: hospital.city || '',
            phoneNumber: hospital.phoneNumber || '',  // Make sure to use phoneNumber here
            email: hospital.email || '',
            establishedYear: hospital.establishedYear || ''
        });
        setOpenEditModal(true);
    };

    const handleUpdate = async () => {
        if (!selectedHospital) return;
        try {
            await updateHospital(selectedHospital._id, hospitalData);
            setOpenEditModal(false);
        } catch (err) {
            console.error('Error updating hospital:', err);
        }
    };

    const handleDelete = (hospital) => {
        setSelectedHospital(hospital);
        setOpenDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedHospital) return;
        try {
            await deleteHospital(selectedHospital._id);
            setOpenDeleteModal(false);
        } catch (err) {
            console.error('Error deleting hospital:', err);
        }
    };

    return (
        <div className='flex min-h-screen'>
            <DashboardSidebar />
            <div className="flex-1 p-6">
                <h1 className="text-2xl font-bold mb-4">Hospital Dashboard</h1>

                {loading && <Spinner />}
                {error && <p className="text-red-500">{error}</p>}

                <Table hoverable>
                    <Table.Head>
                        <Table.HeadCell>ID</Table.HeadCell>
                        <Table.HeadCell>Name</Table.HeadCell>
                        <Table.HeadCell>Email</Table.HeadCell>
                        <Table.HeadCell>City</Table.HeadCell>
                        <Table.HeadCell>Phone Number</Table.HeadCell>  {/* Changed from 'Phone' to 'Phone Number' */}
                        <Table.HeadCell>Established Year</Table.HeadCell>
                        <Table.HeadCell>Actions</Table.HeadCell>
                    </Table.Head>
                    <Table.Body>
                        {hospitals.map(hospital => (
                            <Table.Row key={hospital._id}>
                                <Table.Cell>{hospital._id}</Table.Cell>
                                <Table.Cell>{hospital.name}</Table.Cell>
                                <Table.Cell>{hospital.email}</Table.Cell>
                                <Table.Cell>{hospital.city}</Table.Cell>
                                <Table.Cell>{hospital.phoneNumber}</Table.Cell> {/* Display phone number */}
                                <Table.Cell>{hospital.establishedYear}</Table.Cell>
                                <Table.Cell>
                                    <Button size="xs" className="mr-2" onClick={() => handleEdit(hospital)}>Edit</Button>
                                    <Button size="xs" color="failure" onClick={() => handleDelete(hospital)}>Delete</Button>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>

                {/* Edit Modal */}
                <Modal show={openEditModal} onClose={() => setOpenEditModal(false)}>
                    <Modal.Header>Edit Hospital</Modal.Header>
                    <Modal.Body>
                        <TextInput id="name" placeholder="Hospital Name" value={hospitalData.name} onChange={handleChange} />
                        <TextInput id="email" placeholder="Email" value={hospitalData.email} onChange={handleChange} />
                        <TextInput id="city" placeholder="City" value={hospitalData.city} onChange={handleChange} />
                        <TextInput id="phoneNumber" placeholder="Phone Number" value={hospitalData.phoneNumber} onChange={handleChange} /> {/* Changed to phoneNumber */}
                        <TextInput id="establishedYear" type="number" placeholder="Established Year" value={hospitalData.establishedYear} onChange={handleChange} />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={handleUpdate}>Update</Button>
                        <Button color="gray" onClick={() => setOpenEditModal(false)}>Cancel</Button>
                    </Modal.Footer>
                </Modal>

                {/* Delete Modal */}
                <Modal show={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
                    <Modal.Header>Confirm Deletion</Modal.Header>
                    <Modal.Body>
                        Are you sure you want to delete this hospital?
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
