import React, { useState, useEffect } from "react";
import { Button, Table, Modal, TextInput, Label, Select } from "flowbite-react";
import { DashboardSidebar } from "../components/DashboardSidebar";
import { useBloodInventory } from "../hooks/useBloodInventory";
import { useHospital } from "../hooks/hospital";
import { useAuthContext } from "../hooks/useAuthContext";

export default function BloodInventoryD() {
    const { bloodInventory, createBloodInventory, updateBloodInventory, deleteBloodInventory, fetchBloodInventoryByHospital, fetchBloodInventory, toggleExpired } = useBloodInventory();
    const { fetchHospitals } = useHospital();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [formData, setFormData] = useState({ hospitalId: "", bloodType: "", availableStocks: "", expirationDate: "" });
    const [editFormData, setEditFormData] = useState({ hospitalId: "", bloodType: "", availableStocks: "", expirationDate: "" });
    const { user } = useAuthContext();
    const userId = user?.userObj?._id;
    const Hospital = user?.role === 'Hospital';
    const Manager = user?.role === 'Manager';

    useEffect(() => {
        if (Hospital) {
            fetchBloodInventoryByHospital(userId);
        } else if (Manager) {
            fetchBloodInventory();
        }
    }, [userId, Hospital, Manager, fetchBloodInventoryByHospital, fetchBloodInventory]);

    // Blood Type Options
    const bloodTypes = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

    // Open Modal for Add
    const openAddModal = () => {
        setFormData({ hospitalId: "", bloodType: "", availableStocks: "", expirationDate: "" });
        setIsAddModalOpen(true);
    };

    // Open Modal for Edit
    const openEditModal = (inventory) => {
        setEditFormData({ ...inventory });
        setIsEditModalOpen(true);
    };

    // Close Modals
    const closeAddModal = () => setIsAddModalOpen(false);
    const closeEditModal = () => setIsEditModalOpen(false);

    // Handle Input Change for Add
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle Input Change for Edit
    const handleEditChange = (e) => {
        setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    };

    // Handle Create
    const handleCreate = async () => {
        /*if (!formData.bloodType || !formData.availableStocks || !formData.expirationDate) {
            alert("Please fill in all fields.");
            return;
        }*/
        const newFormData = { ...formData, hospitalId: userId };
        console.log("New Inventory Data:", newFormData);
        await createBloodInventory(newFormData);
        closeAddModal();
    };

    // Handle Edit
    const handleEdit = async () => {
        if (!editFormData.bloodType || !editFormData.availableStocks || !editFormData.expirationDate) {
            alert("Please fill in all fields.");
            return;
        }
        await updateBloodInventory(editFormData._id, editFormData);
        closeEditModal();
    };

    return (
        <div className="flex min-h-screen">
            <DashboardSidebar />
            <div className="flex-1 p-6">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Blood Inventory</h1>
                    <Button onClick={openAddModal}>Add New Inventory</Button>
                </div>

                <Table hoverable>
                    <Table.Head>
                        <Table.HeadCell>Hospital ID</Table.HeadCell>
                        <Table.HeadCell>Blood Type</Table.HeadCell>
                        <Table.HeadCell>Stock</Table.HeadCell>
                        <Table.HeadCell>Expiration Date</Table.HeadCell>
                        <Table.HeadCell>Expiry Status</Table.HeadCell>
                        <Table.HeadCell>Actions</Table.HeadCell>
                    </Table.Head>
                    <Table.Body>
                        {bloodInventory.length > 0 ? (
                            bloodInventory.map((inventory) => (
                                <Table.Row key={inventory._id}>
                                    <Table.Cell>{inventory.hospitalId}</Table.Cell>
                                    <Table.Cell>{inventory.bloodType}</Table.Cell>
                                    <Table.Cell>{inventory.availableStocks}</Table.Cell>
                                    <Table.Cell>{new Date(inventory.expirationDate).toLocaleDateString("en-GB")}</Table.Cell>
                                    <Table.Cell>{inventory.expiredStatus ? "Expired" : "Not Expired"}</Table.Cell>
                                    <Table.Cell>
                                        <Button size="xs" className="bg-blue-500 text-white px-2 py-1 rounded" onClick={() => openEditModal(inventory)}>Edit</Button> 
                                        <Button size="xs" color="failure" className="ml-2" onClick={() => deleteBloodInventory(inventory._id)}>Delete</Button> 
                                        <Button size="xs" color="success" className="ml-2" onClick={() => toggleExpired(inventory._id)}>Toggle Expired</Button>
                                    </Table.Cell>
                                </Table.Row>
                            ))
                        ) : (
                            <Table.Row>
                                <Table.Cell colSpan={5} className="text-center">No blood inventory records found.</Table.Cell>
                            </Table.Row>
                        )}
                    </Table.Body>
                </Table>
            </div>
            
            {/* Modal for Add */}
            <Modal show={isAddModalOpen} onClose={closeAddModal}>
                <Modal.Header>Add New Inventory</Modal.Header>
                <Modal.Body>
                    <div className="space-y-4">
                        <Label>Blood Type</Label>
                        <Select name="bloodType" value={formData.bloodType} onChange={handleChange} required>
                            <option value="" disabled>Select Blood Type</option>
                            {bloodTypes.map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </Select>

                        <Label>Stock</Label>
                        <TextInput type="number" name="availableStocks" value={formData.availableStocks} onChange={handleChange} required />

                        <Label>Expiration Date</Label>
                        <TextInput type="date" name="expirationDate" value={formData.expirationDate} onChange={handleChange} required />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleCreate}>Add</Button>
                    <Button color="gray" onClick={closeAddModal}>Cancel</Button>
                </Modal.Footer>
            </Modal>

            {/* Modal for Edit */}
            <Modal show={isEditModalOpen} onClose={closeEditModal}>
                <Modal.Header>Edit Inventory</Modal.Header>
                <Modal.Body>
                    <div className="space-y-4">
                        <Label>Blood Type</Label>
                        <TextInput type="text" name="bloodType" value={editFormData.bloodType} onChange={handleEditChange} required />

                        <Label>Stock</Label>
                        <TextInput type="number" name="availableStocks" value={editFormData.availableStocks} onChange={handleEditChange} required />

                        <Label>Expiration Date</Label>
                        <TextInput type="date" name="expirationDate" value={editFormData.expirationDate} onChange={handleEditChange} required />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleEdit}>Update</Button>
                    <Button color="gray" onClick={closeEditModal}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
