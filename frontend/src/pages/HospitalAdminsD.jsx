import React, { useEffect, useState } from 'react';
import { Button, Table, Modal, TextInput, Label, Spinner, FileInput } from 'flowbite-react';
import { DashboardSidebar } from '../components/DashboardSidebar';
import { useHospitalAdmin } from '../hooks/useHospitalAdmin';
import { useAuthContext } from '../hooks/useAuthContext';

export default function HospitalAdminsD() {
    

    const { hospitalAdmins, loading, fetchHospitalAdmins, createHospitalAdmin, updateHospitalAdmin, deleteHospitalAdmin, activateDeactivateHospitalAdmin, fetchHospitalAdminsByHospitalId } = useHospitalAdmin();
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const { user } = useAuthContext();
    const [adminData, setAdminData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        dob: '',
        address: '',
        nic: '',
        image: null,
        password: ''
    });

    const hospitalId = user?.userObj._id || '';
    const Hospital = user?.role === 'Hospital';
    const Manager = user?.role === 'Manager';
    
    useEffect(() => {
        if (Hospital) {
            fetchHospitalAdminsByHospitalId(hospitalId);
        }else if (Manager) {
           fetchHospitalAdmins();
        }
    }, [fetchHospitalAdmins, fetchHospitalAdminsByHospitalId, hospitalId, Hospital, Manager]);

    const handleToggleStatus = async (id, currentStatus) => {
        await activateDeactivateHospitalAdmin(id);
      };

    // Handle text input changes
    const handleChange = (e) => {
        const { id, value } = e.target;
        setAdminData(prev => ({ ...prev, [id]: value }));
    };

    // Handle image upload
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAdminData(prev => ({ ...prev, image: file }));
            console.log('Image selected:', file.name); // Debug: Confirm file selection
        }
    };

    // Handle admin creation
    const handleCreate = async () => {
        console.log('handleCreate called'); // Debug: Confirm function triggers
        try {
            const formData = new FormData();
            formData.append('hospitalId', hospitalId);
            Object.keys(adminData).forEach(key => {
                if (adminData[key] !== null && adminData[key] !== '') {
                    formData.append(key, adminData[key]);
                }
            });

            // Debug: Log FormData entries
            for (let [key, value] of formData.entries()) {
                console.log(`FormData - ${key}:`, value);
            }

            await createHospitalAdmin(formData);
            setOpenCreateModal(false);
            resetAdminData();
        } catch (err) {
            console.error('Error in handleCreate:', err);
        }
    };

    // Open edit modal with pre-filled data
    const handleEdit = (admin) => {
        setSelectedAdmin(admin);
        setAdminData({
            email: admin.email || '',
            firstName: admin.firstName || '',
            lastName: admin.lastName || '',
            phoneNumber: admin.phoneNumber || '',
            dob: admin.dob || '',
            address: admin.address || '',
            nic: admin.nic || '',
            image: null, // Reset image for edit (re-upload required)
            password: '' // No pre-filled password
        });
        setOpenEditModal(true);
    };

    // Handle admin update
    const handleUpdate = async () => {
        if (!selectedAdmin) return;
        try {
            const formData = new FormData();
            Object.keys(adminData).forEach(key => {
                if (adminData[key] !== null && adminData[key] !== '') {
                    formData.append(key, adminData[key]);
                }
            });

            await updateHospitalAdmin(selectedAdmin._id, formData);
            setOpenEditModal(false);
            resetAdminData();
        } catch (err) {
            console.error('Error in handleUpdate:', err);
        }
    };

    // Open delete modal
    const handleDelete = (admin) => {
        setSelectedAdmin(admin);
        setOpenDeleteModal(true);
    };

    // Handle admin deletion
    const handleConfirmDelete = async () => {
        if (!selectedAdmin) return;
        try {
            await deleteHospitalAdmin(selectedAdmin._id);
            setOpenDeleteModal(false);
        } catch (err) {
            console.error('Error in handleConfirmDelete:', err);
        }
    };

    // Reset form data
    const resetAdminData = () => {
        setAdminData({
            email: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            dob: '',
            address: '',
            nic: '',
            image: null,
            password: ''
        });
    };

    return (
        <div className='flex min-h-screen'>
            <DashboardSidebar />
            <div className="flex-1 p-6">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Hospital Admins</h1>
                    <Button onClick={() => setOpenCreateModal(true)}>Add New Admin</Button>
                </div>

                {loading && <Spinner />}

                <Table hoverable>
                    <Table.Head>
                        <Table.HeadCell>ID</Table.HeadCell>
                        <Table.HeadCell>Name</Table.HeadCell>
                        <Table.HeadCell>Email</Table.HeadCell>
                        <Table.HeadCell>Phone</Table.HeadCell>
                        <Table.HeadCell>Actions</Table.HeadCell>
                    </Table.Head>
                    <Table.Body>
                        {hospitalAdmins.map(admin => (
                            <Table.Row key={admin._id}>
                                <Table.Cell>{admin._id}</Table.Cell>
                                <Table.Cell>{`${admin.firstName} ${admin.lastName}`}</Table.Cell>
                                <Table.Cell>{admin.email}</Table.Cell>
                                <Table.Cell>{admin.phoneNumber}</Table.Cell>
                                <Table.Cell>
                                <Button
                      size="xs"
                      className="mr-2"
                      color={admin.activeStatus ? 'failure' : 'success'}
                      onClick={() => handleToggleStatus(admin._id, admin.activeStatus)}
                    >
                      {admin.activeStatus ? 'Deactivate' : 'Activate'}
                    </Button>
                                    <Button size="xs" className="mr-2" onClick={() => handleEdit(admin)}>Edit</Button>
                                    <Button size="xs" color="failure" onClick={() => handleDelete(admin)}>Delete</Button>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </div>

            {/* Create Admin Modal */}
            <Modal show={openCreateModal} onClose={() => setOpenCreateModal(false)}>
                <Modal.Header>Add New Hospital Admin</Modal.Header>
                <Modal.Body>
                    <div className="flex flex-col gap-3">
                        <Label htmlFor="email">Email</Label>
                        <TextInput id="email" value={adminData.email} onChange={handleChange} />
                        <Label htmlFor="firstName">First Name</Label>
                        <TextInput id="firstName" value={adminData.firstName} onChange={handleChange} />
                        <Label htmlFor="lastName">Last Name</Label>
                        <TextInput id="lastName" value={adminData.lastName} onChange={handleChange} />
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        <TextInput id="phoneNumber" value={adminData.phoneNumber} onChange={handleChange} />
                        <Label htmlFor="dob">Date of Birth</Label>
                        <TextInput id="dob" type="date" value={adminData.dob} onChange={handleChange} />
                        <Label htmlFor="address">Address</Label>
                        <TextInput id="address" value={adminData.address} onChange={handleChange} />
                        <Label htmlFor="nic">NIC</Label>
                        <TextInput id="nic" value={adminData.nic} onChange={handleChange} />
                        <Label htmlFor="password">Password</Label>
                        <TextInput id="password" type="password" value={adminData.password} onChange={handleChange} />
                        <Label htmlFor="image">Profile Image</Label>
                        <FileInput id="image" onChange={handleImageUpload} />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleCreate}>Create</Button>
                    <Button color="gray" onClick={() => setOpenCreateModal(false)}>Cancel</Button>
                </Modal.Footer>
            </Modal>

            {/* Edit Admin Modal */}
            <Modal show={openEditModal} onClose={() => setOpenEditModal(false)}>
                <Modal.Header>Edit Hospital Admin</Modal.Header>
                <Modal.Body>
                    <div className="flex flex-col gap-3">
                        <Label htmlFor="email">Email</Label>
                        <TextInput id="email" value={adminData.email} onChange={handleChange} />
                        <Label htmlFor="firstName">First Name</Label>
                        <TextInput id="firstName" value={adminData.firstName} onChange={handleChange} />
                        <Label htmlFor="lastName">Last Name</Label>
                        <TextInput id="lastName" value={adminData.lastName} onChange={handleChange} />
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        <TextInput id="phoneNumber" value={adminData.phoneNumber} onChange={handleChange} />
                        <Label htmlFor="dob">Date of Birth</Label>
                        <TextInput id="dob" type="date" value={adminData.dob} onChange={handleChange} />
                        <Label htmlFor="address">Address</Label>
                        <TextInput id="address" value={adminData.address} onChange={handleChange} />
                        <Label htmlFor="nic">NIC</Label>
                        <TextInput id="nic" value={adminData.nic} onChange={handleChange} />
                        <Label htmlFor="password">Password (Leave blank to keep unchanged)</Label>
                        <TextInput id="password" type="password" value={adminData.password} onChange={handleChange} />
                        <Label htmlFor="image">Profile Image (Upload to update)</Label>
                        <FileInput id="image" onChange={handleImageUpload} />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleUpdate}>Update</Button>
                    <Button color="gray" onClick={() => setOpenEditModal(false)}>Cancel</Button>
                </Modal.Footer>
            </Modal>

            {/* Delete Admin Modal */}
            <Modal show={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
                <Modal.Header>Confirm Delete</Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this admin?
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleConfirmDelete}>Delete</Button>
                    <Button color="gray" onClick={() => setOpenDeleteModal(false)}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}