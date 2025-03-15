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

    // Handle text input changes
    const handleChange = (e) => {
        const { id, value } = e.target;
        setManagerData(prev => ({ ...prev, [id]: value }));
    };
    const handleToggleStatus = async (id, currentStatus) => {
      await activateDeactivateManager(id);
  };
    // Handle image upload
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setManagerData(prev => ({ ...prev, image: file }));
            console.log('Image selected:', file.name); // Debug: Confirm file selection
        }
    };

    // Handle manager creation
    const handleCreate = async () => {
        console.log('handleCreate called'); // Debug: Confirm function triggers
        try {
            const formData = new FormData();
            Object.keys(managerData).forEach(key => {
                if (managerData[key] !== null && managerData[key] !== '') {
                    formData.append(key, managerData[key]);
                }
            });

            // Debug: Log FormData entries
            for (let [key, value] of formData.entries()) {
                console.log(`FormData - ${key}:`, value);
            }

            await createManager(formData);
            setOpenCreateModal(false);
            resetManagerData();
        } catch (err) {
            console.error('Error in handleCreate:', err);
        }
    };

    // Open edit modal with pre-filled data
    const handleEdit = (manager) => {
        setSelectedManager(manager);
        setManagerData({
            email: manager.email || '',
            firstName: manager.firstName || '',
            lastName: manager.lastName || '',
            phoneNumber: manager.phoneNumber || '',
            dob: manager.dob ? manager.dob.split('T')[0] : '', // Format date for input
            address: manager.address || '',
            nic: manager.nic || '',
            image: null, // Reset image for edit (re-upload required)
            password: '', // No pre-filled password
            role: manager.role || 'Junior'
        });
        setOpenEditModal(true);
    };

    // Handle manager update
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

    // Open delete modal
    const handleDelete = (manager) => {
        setSelectedManager(manager);
        setOpenDeleteModal(true);
    };

    // Handle manager deletion
    const handleConfirmDelete = async () => {
        if (!selectedManager) return;
        try {
            await deleteManager(selectedManager._id);
            setOpenDeleteModal(false);
        } catch (err) {
            console.error('Error in handleConfirmDelete:', err);
        }
    };

    // Reset form data
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
                                <Button 
                                        size="xs" 
                                        className="mr-2" 
                                        color={manager.activeStatus ? "failure" : "success"}
                                        onClick={() => handleToggleStatus(manager._id, manager.activeStatus)}
                                    >
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

            {/* Create Manager Modal */}
            <Modal show={openCreateModal} onClose={() => setOpenCreateModal(false)}>
                <Modal.Header>Add New System Manager</Modal.Header>
                <Modal.Body>
                    <div className="flex flex-col gap-3">
                        <Label htmlFor="email">Email</Label>
                        <TextInput id="email" value={managerData.email} onChange={handleChange} />
                        <Label htmlFor="firstName">First Name</Label>
                        <TextInput id="firstName" value={managerData.firstName} onChange={handleChange} />
                        <Label htmlFor="lastName">Last Name</Label>
                        <TextInput id="lastName" value={managerData.lastName} onChange={handleChange} />
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        <TextInput id="phoneNumber" value={managerData.phoneNumber} onChange={handleChange} />
                        <Label htmlFor="dob">Date of Birth</Label>
                        <TextInput id="dob" type="date" value={managerData.dob} onChange={handleChange} />
                        <Label htmlFor="address">Address</Label>
                        <TextInput id="address" value={managerData.address} onChange={handleChange} />
                        <Label htmlFor="nic">NIC</Label>
                        <TextInput id="nic" value={managerData.nic} onChange={handleChange} />
                        <Label htmlFor="password">Password</Label>
                        <TextInput id="password" type="password" value={managerData.password} onChange={handleChange} />
                        <Label htmlFor="role">Role</Label>
                        <Select id="role" value={managerData.role} onChange={handleChange}>
                            <option value="Master">Master</option>
                            <option value="Junior">Junior</option>
                        </Select>
                        <Label htmlFor="image">Profile Image</Label>
                        <FileInput id="image" onChange={handleImageUpload} />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleCreate}>Create</Button>
                    <Button color="gray" onClick={() => setOpenCreateModal(false)}>Cancel</Button>
                </Modal.Footer>
            </Modal>

            {/* Edit Manager Modal */}
            <Modal show={openEditModal} onClose={() => setOpenEditModal(false)}>
                <Modal.Header>Edit System Manager</Modal.Header>
                <Modal.Body>
                    <div className="flex flex-col gap-3">
                        <Label htmlFor="email">Email</Label>
                        <TextInput id="email" value={managerData.email} onChange={handleChange} />
                        <Label htmlFor="firstName">First Name</Label>
                        <TextInput id="firstName" value={managerData.firstName} onChange={handleChange} />
                        <Label htmlFor="lastName">Last Name</Label>
                        <TextInput id="lastName" value={managerData.lastName} onChange={handleChange} />
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        <TextInput id="phoneNumber" value={managerData.phoneNumber} onChange={handleChange} />
                        <Label htmlFor="dob">Date of Birth</Label>
                        <TextInput id="dob" type="date" value={managerData.dob} onChange={handleChange} />
                        <Label htmlFor="address">Address</Label>
                        <TextInput id="address" value={managerData.address} onChange={handleChange} />
                        <Label htmlFor="nic">NIC</Label>
                        <TextInput id="nic" value={managerData.nic} onChange={handleChange} />
                        <Label htmlFor="password">Password (Leave blank to keep unchanged)</Label>
                        <TextInput id="password" type="password" value={managerData.password} onChange={handleChange} />
                        <Label htmlFor="role">Role</Label>
                        <Select id="role" value={managerData.role} onChange={handleChange}>
                            <option value="Master">Master</option>
                            <option value="Junior">Junior</option>
                        </Select>
                        <Label htmlFor="image">Profile Image (Upload to update)</Label>
                        <FileInput id="image" onChange={handleImageUpload} />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleUpdate}>Update</Button>
                    <Button color="gray" onClick={() => setOpenEditModal(false)}>Cancel</Button>
                </Modal.Footer>
            </Modal>

            {/* Delete Manager Modal */}
            <Modal show={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
                <Modal.Header>Confirm Delete</Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this manager?
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleConfirmDelete}>Delete</Button>
                    <Button color="gray" onClick={() => setOpenDeleteModal(false)}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}