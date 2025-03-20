import React, { useEffect, useState } from 'react';
import { Button, Table, Modal, TextInput, Label, Spinner, FileInput, Select } from 'flowbite-react';
import { DashboardSidebar } from '../components/DashboardSidebar';
import { useSystemManager } from '../hooks/useSystemManager'; // Updated import
import { useAuthContext } from '../hooks/useAuthContext';

export default function SystemManagersD() {
    const { managers, loading, error, fetchManagers, createManager, updateManager, activateDeactivateManager, deleteManager } = useSystemManager();
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedManager, setSelectedManager] = useState(null);
    const { user } = useAuthContext();
    const [managerData, setManagerData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        dob: '',
        address: '',
        nic: '',
        image: null,
        password: '',
        role: 'Junior' // Default role
    });

    useEffect(() => {
        fetchManagers();
    }, [fetchManagers]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setManagerData(prev => ({ ...prev, [id]: value }));
    };

    const handleToggleStatus = async (id, currentStatus) => {
        await activateDeactivateManager(id);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setManagerData(prev => ({ ...prev, image: file }));
        }
    };

    const handleCreate = async () => {
        try {
            const formData = new FormData();
            Object.keys(managerData).forEach(key => {
                if (managerData[key] !== null && managerData[key] !== '') {
                    formData.append(key, managerData[key]);
                }
            });
            await createManager(formData);
            setOpenCreateModal(false);
            resetManagerData();
        } catch (err) {
            console.error('Error in handleCreate:', err);
        }
    };

    const handleEdit = (manager) => {
        setSelectedManager(manager);
        setManagerData({
            email: manager.email || '',
            firstName: manager.firstName || '',
            lastName: manager.lastName || '',
            phoneNumber: manager.phoneNumber || '',
            dob: manager.dob ? manager.dob.split('T')[0] : '',
            address: manager.address || '',
            nic: manager.nic || '',
            image: null,
            password: '',
            role: manager.role || 'Junior'
        });
        setOpenEditModal(true);
    };

    const handleUpdate = async () => {
        if (!selectedManager) return;
        try {
            const formData = new FormData();
            Object.keys(managerData).forEach(key => {
                if (managerData[key] !== null && managerData[key] !== '') {
                    formData.append(key, managerData[key]);
                }
            });
            await updateManager(selectedManager._id, formData);
            setOpenEditModal(false);
            resetManagerData();
        } catch (err) {
            console.error('Error in handleUpdate:', err);
        }
    };

    const handleDelete = (manager) => {
        setSelectedManager(manager);
        setOpenDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedManager) return;
        try {
            await deleteManager(selectedManager._id);
            setOpenDeleteModal(false);
        } catch (err) {
            console.error('Error in handleConfirmDelete:', err);
        }
    };

    const resetManagerData = () => {
        setManagerData({
            email: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            dob: '',
            address: '',
            nic: '',
            image: null,
            password: '',
            role: 'Junior'
        });
    };

    return (
        <div className='flex min-h-screen'>
            <DashboardSidebar />
            <div className="flex-1 p-6">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">System Managers</h1>
                    <Button onClick={() => setOpenCreateModal(true)}>Add New Manager</Button>
                </div>

                {loading && <Spinner />}
                {error && <p className="text-red-500">{error}</p>}

                <Table hoverable>
                    <Table.Head>
                        <Table.HeadCell>ID</Table.HeadCell>
                        <Table.HeadCell>Name</Table.HeadCell>
                        <Table.HeadCell>Email</Table.HeadCell>
                        <Table.HeadCell>Phone</Table.HeadCell>
                        <Table.HeadCell>Role</Table.HeadCell>
                        <Table.HeadCell>Actions</Table.HeadCell>
                    </Table.Head>
                    <Table.Body>
                        {managers.map(manager => (
                            <Table.Row key={manager._id}>
                                <Table.Cell>{manager._id}</Table.Cell>
                                <Table.Cell>{`${manager.firstName} ${manager.lastName}`}</Table.Cell>
                                <Table.Cell>{manager.email}</Table.Cell>
                                <Table.Cell>{manager.phoneNumber}</Table.Cell>
                                <Table.Cell>{manager.role}</Table.Cell>
                                <Table.Cell>
                                    <Button size="xs" className="mr-2" color={manager.activeStatus ? "failure" : "success"} onClick={() => handleToggleStatus(manager._id, manager.activeStatus)}>
                                        {manager.activeStatus ? 'Deactivate' : 'Activate'}
                                    </Button>
                                    <Button size="xs" className="mr-2" onClick={() => handleEdit(manager)}>Edit</Button>
                                    <Button size="xs" color="failure" onClick={() => handleDelete(manager)}>Delete</Button>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </div>
        </div>
    );
}
