import React, { useState, useEffect } from "react";
import { Button, Table, Modal, TextInput, Label, Select } from "flowbite-react";
import { DashboardSidebar } from "../components/DashboardSidebar";
import { useBloodInventory } from "../hooks/useBloodInventory";
import { useHospital } from "../hooks/hospital";
import { useAuthContext } from "../hooks/useAuthContext";

export default function BloodInventoryD() {
    const { bloodInventory, createBloodInventory, updateBloodInventory, deleteBloodInventory, fetchBloodInventoryByHospital, fetchBloodInventory } = useBloodInventory();
    const { hospitals, loading, error, fetchHospitals } = useHospital();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [formData, setFormData] = useState({ hospitalId: "", bloodType: "", availableStocks: "", expirationDate: "" });
    const { user } = useAuthContext();
    const userId = user?.userObj?._id;
    const Hospital = user?.role === 'Hospital';
    const Manager = user?.role === 'Manager';
    useEffect(() => {
        fetchHospitals();
        if (Hospital) {
            fetchBloodInventoryByHospital(userId);
        } 
    }, [userId, Hospital]);
    
      
    // Blood Type Options
    const bloodTypes = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

    // Open Modal for Add/Edit
    const openModal = (inventory = null) => {
        setIsEdit(!!inventory);
        setFormData(inventory ? { ...inventory } : { hospitalId: "", bloodType: "", availableStocks: "", expirationDate: "" });
        setIsModalOpen(true);
    };

    // Close Modal
    const closeModal = () => {
        setIsModalOpen(false);
        setFormData({ hospitalId: "", bloodType: "", availableStocks: "", expirationDate: "" });
    };

    // Handle Input Change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle Submit (Add or Update)
    const handleSubmit = async () => {
        console.log("Submitting Form Data:", formData); // Debugging
        if (isEdit) {
            await updateBloodInventory(formData._id, formData);
        } else {
            await createBloodInventory(formData);
        }
        closeModal();
    };
    

    return (
        <div className="flex min-h-screen">
            <DashboardSidebar />
            <div className="flex-1 p-6">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Blood Inventory</h1>
                    <Button onClick={() => openModal()}>Add New Inventory</Button>
                </div>

                <Table hoverable>
                    <Table.Head>
                        <Table.HeadCell>Hospital ID</Table.HeadCell>
                        <Table.HeadCell>Blood Type</Table.HeadCell>
                        <Table.HeadCell>Stock</Table.HeadCell>
                        <Table.HeadCell>Expiration Date</Table.HeadCell>
                        <Table.HeadCell>Actions</Table.HeadCell>
                    </Table.Head>
                    <Table.Body>
                        {bloodInventory.length > 0 ? (
                            bloodInventory.map((inventory) => (
                                <Table.Row key={inventory._id}>
                                    <Table.Cell>{inventory.hospitalId}</Table.Cell>
                                    <Table.Cell>{inventory.bloodType}</Table.Cell>
                                    <Table.Cell>{inventory.availableStocks}</Table.Cell>
                                    <Table.Cell>{new Date(inventory.expirationDate).toLocaleDateString()}</Table.Cell>
                                    <Table.Cell>
                                        <Button size="xs" className="bg-blue-500 text-white px-2 py-1 rounded"
                                            onClick={() => openModal(inventory)}>Edit</Button> 
                                        <Button size="xs" color="failure" className="ml-2"
                                            onClick={() => deleteBloodInventory(inventory._id)}>Delete</Button> 
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
            
                {/* Modal for Add/Edit */}
                <Modal show={isModalOpen} onClose={closeModal}>
                    <Modal.Header>{isEdit ? "Edit Inventory" : "Add New Inventory"}</Modal.Header>
                    <Modal.Body>
                        <div className="space-y-4">

                            <Label>Hospital ID</Label>
                            <Select name="hospitalId" id="hospitalId" required value={formData.hospitalId} onChange={handleChange}>
                                            <option value="" disabled>Select a hospital</option>
                                            {hospitals && hospitals.map(hospital => (
                                              <option key={hospital._id} value={hospital._id}>{hospital.name}</option>
                                            ))}
                                          </Select>

                            <Label>Blood Type</Label>
                            <Select name="bloodType" value={formData.bloodType} onChange={handleChange} required>
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
                        <Button onClick={handleSubmit}>{isEdit ? "Update" : "Add"}</Button>
                        <Button color="gray" onClick={closeModal}>Cancel</Button>
                    </Modal.Footer>
                </Modal>
        </div>
    );
}
