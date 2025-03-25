import React, { useEffect, useState } from "react";
import { Button, Spinner, Table, Modal, TextInput, Label, FileInput } from "flowbite-react";
import { DashboardSidebar } from "../components/DashboardSidebar";
import { useHospital } from "../hooks/hospital";

export default function HospitalDashboard() {
  const { hospitals, loading, error, fetchHospitals, deleteHospital, updateHospital, createHospital } = useHospital();
  const [editHospital, setEditHospital] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const [newHospital, setNewHospital] = useState({
    name: "",
    city: "",
    identificationNumber: "",
    email: "",
    password: "",
    phoneNumber: "",
    address: "",
    image: null,
    startTime: "",
    endTime: "",
    activeStatus: true,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchHospitals();
  }, []);

  const handleDelete = async (id) => {
    if (!id) {
      console.error("No ID provided for deletion.");
      return;
    }
    
    const confirmDelete = window.confirm("Are you sure you want to delete this hospital?");
    if (!confirmDelete) return;

    try {
      await deleteHospital(id);
      fetchHospitals(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting hospital:", error.response?.data?.message || error.message);
    }
  };

  const handleEdit = (hospital) => {
    setEditHospital(hospital);
    setIsEditing(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editHospital?._id) {
      console.error("Hospital ID not found for update.");
      return;
    }

    try {
      await updateHospital(editHospital._id, editHospital);
      setIsEditing(false);
      fetchHospitals(); // Refresh the list after update
    } catch (error) {
      console.error("Error updating hospital:", error.response?.data?.message || error.message);
    }
  };

  const handleAddHospital = async (e) => {
    e.preventDefault();

    if (Object.values(newHospital).some((val) => val === "" || val === null)) {
      setErrorMessage("Please fill out all fields");
      return;
    }

    const hospitalData = new FormData();
    Object.keys(newHospital).forEach((key) => {
      hospitalData.append(key, newHospital[key]);
    });

    try {
      await createHospital(hospitalData);
      setIsAdding(false);
      setNewHospital({
        name: "",
        city: "",
        identificationNumber: "",
        email: "",
        password: "",
        phoneNumber: "",
        address: "",
        image: null,
        startTime: "",
        endTime: "",
        activeStatus: true,
      });
      setImagePreview(null);
      fetchHospitals(); // Refresh the list after adding
    } catch (error) {
      console.error("Error adding hospital:", error.response?.data?.message || error.message);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setNewHospital((prev) => ({ ...prev, image: file }));

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleEditFieldChange = (e) => {
    const { name, value } = e.target;
    setEditHospital((prevHospital) => ({
      ...prevHospital,
      [name]: value,
    }));
  };

  const handleActivateDeactivate = async (id, currentStatus) => {
    try {
      const updatedStatus = !currentStatus; // Toggle active status
      await updateHospital(id, { activeStatus: updatedStatus });
      fetchHospitals(); // Refresh the list after status update
    } catch (error) {
      console.error("Error updating hospital status:", error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Hospital Dashboard</h1>
          <Button onClick={() => setIsAdding(true)}>Add Hospital</Button>
        </div>

        {loading && <Spinner />}
        {error && <p className="text-red-500">{error}</p>}

        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>City</Table.HeadCell>
            <Table.HeadCell>Identification Number</Table.HeadCell>
            <Table.HeadCell>Address</Table.HeadCell>
            <Table.HeadCell>Phone Number</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Start Time</Table.HeadCell>
            <Table.HeadCell>End Time</Table.HeadCell>
            <Table.HeadCell>Active Status</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {hospitals.map((hospital) => (
              <Table.Row key={hospital._id}>
                <Table.Cell>{hospital.name}</Table.Cell>
                <Table.Cell>{hospital.city}</Table.Cell>
                <Table.Cell>{hospital.identificationNumber}</Table.Cell>
                <Table.Cell>{hospital.address}</Table.Cell>
                <Table.Cell>{hospital.phoneNumber}</Table.Cell>
                <Table.Cell>{hospital.email}</Table.Cell>
                <Table.Cell>{hospital.startTime}</Table.Cell>
                <Table.Cell>{hospital.endTime}</Table.Cell>
                <Table.Cell>{hospital.activeStatus ? "Active" : "Inactive"}</Table.Cell>
                <Table.Cell>
                  <Button size="xs" onClick={() => handleEdit(hospital)}>Edit</Button>
                  <Button size="xs" color="failure" onClick={() => handleDelete(hospital._id)}>Delete</Button>
                  <Button
                    size="xs"
                    color={hospital.activeStatus ? "success" : "warning"}
                    onClick={() => handleActivateDeactivate(hospital._id, hospital.activeStatus)}
                  >
                    {hospital.activeStatus ? "Deactivate" : "Activate"}
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>

        {/* Add Hospital Modal */}
        <Modal show={isAdding} onClose={() => setIsAdding(false)}>
          <Modal.Header>Add Hospital</Modal.Header>
          <Modal.Body>
            <form onSubmit={handleAddHospital} className="space-y-4">
              {errorMessage && <p className="text-red-600 text-center">{errorMessage}</p>}
              <div>
                <Label htmlFor="name" value="Name" />
                <TextInput id="name" value={newHospital.name} onChange={(e) => setNewHospital({ ...newHospital, name: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="city" value="City" />
                <TextInput id="city" value={newHospital.city} onChange={(e) => setNewHospital({ ...newHospital, city: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="identificationNumber" value="Identification Number" />
                <TextInput id="identificationNumber" value={newHospital.identificationNumber} onChange={(e) => setNewHospital({ ...newHospital, identificationNumber: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="email" value="Email" />
                <TextInput id="email" type="email" value={newHospital.email} onChange={(e) => setNewHospital({ ...newHospital, email: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="password" value="Password" />
                <TextInput id="password" type="password" value={newHospital.password} onChange={(e) => setNewHospital({ ...newHospital, password: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="phoneNumber" value="Phone Number" />
                <TextInput id="phoneNumber" value={newHospital.phoneNumber} onChange={(e) => setNewHospital({ ...newHospital, phoneNumber: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="address" value="Address" />
                <TextInput id="address" value={newHospital.address} onChange={(e) => setNewHospital({ ...newHospital, address: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="image" value="Upload Image" />
                <FileInput id="image" onChange={handleFileChange} required />
                {imagePreview && <img src={imagePreview} alt="Preview" className="mt-4 w-32 h-32 object-cover rounded-full" />}
              </div>
              <div>
                <Label htmlFor="startTime" value="Start Time" />
                <TextInput id="startTime" type="time" value={newHospital.startTime} onChange={(e) => setNewHospital({ ...newHospital, startTime: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="endTime" value="End Time" />
                <TextInput id="endTime" type="time" value={newHospital.endTime} onChange={(e) => setNewHospital({ ...newHospital, endTime: e.target.value })} required />
              </div>
              <div className="flex justify-end space-x-2">
                <Button color="gray" onClick={() => setIsAdding(false)}>Cancel</Button>
                <Button type="submit">Add Hospital</Button>
              </div>
            </form>
          </Modal.Body>
        </Modal>

        {/* Edit Hospital Modal */}
        <Modal show={isEditing} onClose={() => setIsEditing(false)}>
          <Modal.Header>Edit Hospital</Modal.Header>
          <Modal.Body>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <Label htmlFor="name" value="Name" />
                <TextInput id="name" name="name" value={editHospital?.name} onChange={handleEditFieldChange} required />
              </div>
              <div>
                <Label htmlFor="city" value="City" />
                <TextInput id="city" name="city" value={editHospital?.city} onChange={handleEditFieldChange} required />
              </div>
              <div>
                <Label htmlFor="identificationNumber" value="Identification Number" />
                <TextInput id="identificationNumber" name="identificationNumber" value={editHospital?.identificationNumber} onChange={handleEditFieldChange} required />
              </div>
              <div>
                <Label htmlFor="email" value="Email" />
                <TextInput id="email" name="email" type="email" value={editHospital?.email} onChange={handleEditFieldChange} required />
              </div>
              <div>
                <Label htmlFor="password" value="Password" />
                <TextInput id="password" name="password" type="password" value={editHospital?.password} onChange={handleEditFieldChange} required />
              </div>
              <div>
                <Label htmlFor="phoneNumber" value="Phone Number" />
                <TextInput id="phoneNumber" name="phoneNumber" value={editHospital?.phoneNumber} onChange={handleEditFieldChange} required />
              </div>
              <div>
                <Label htmlFor="address" value="Address" />
                <TextInput id="address" name="address" value={editHospital?.address} onChange={handleEditFieldChange} required />
              </div>
              <div className="flex justify-end space-x-2">
                <Button color="gray" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button type="submit">Update Hospital</Button>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
}
