import React, { useState, useEffect } from "react";
import { Button, Modal, TextInput, FileInput, Label, Spinner, Table } from "flowbite-react";
import { DashboardSidebar } from "../components/DashboardSidebar";
import { useHospital } from "../hooks/hospital";

export default function HospitalDashboard() {
  const { hospitals, loading, error, fetchHospitals, createHospital, updateHospital, deleteHospital } = useHospital();
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    _id: null,  // For editing
    name: "",
    city: "",
    identificationNumber: "",
    email: "",
    password: "",
    phoneNumber: "",
    address: "",
    startTime: "",
    endTime: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchHospitals();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value.trim() }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, image: file }));

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    if (file) reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (Object.values(formData).some((val) => val === "" || val === null)) {
      setErrorMessage("Please fill out all fields");
      return;
    }

    const hospitalData = new FormData();
    Object.keys(formData).forEach((key) => {
      hospitalData.append(key, formData[key]);
    });

    if (formData._id) {
      // Update existing hospital
      await updateHospital(formData._id, hospitalData);
    } else {
      // Create new hospital
      await createHospital(hospitalData);
    }

    setOpenCreateModal(false);
    resetForm();
    fetchHospitals();
  };

  const handleEdit = (hospital) => {
    setFormData(hospital);
    setImagePreview(hospital.image); // If stored as a URL
    setOpenCreateModal(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this hospital?");
    if (!confirmDelete) return;

    await deleteHospital(id);
    fetchHospitals(); // Refresh after deletion
  };

  const resetForm = () => {
    setFormData({
      _id: null,
      name: "",
      city: "",
      identificationNumber: "",
      email: "",
      password: "",
      phoneNumber: "",
      address: "",
      startTime: "",
      endTime: "",
      image: null,
    });
    setImagePreview(null);
    setErrorMessage("");
  };

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Hospital Dashboard</h1>
          <Button onClick={() => { resetForm(); setOpenCreateModal(true); }}>
            Add New Hospital
          </Button>
        </div>

        {loading && <Spinner />}
        {error && <p className="text-red-500">{error}</p>}

        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>City</Table.HeadCell>
            <Table.HeadCell>Phone Number</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {hospitals.map((hospital) => (
              <Table.Row key={hospital._id}>
                <Table.Cell>{hospital.name}</Table.Cell>
                <Table.Cell>{hospital.email}</Table.Cell>
                <Table.Cell>{hospital.city}</Table.Cell>
                <Table.Cell>{hospital.phoneNumber}</Table.Cell>
                <Table.Cell>
                  <Button size="xs" onClick={() => handleEdit(hospital)}>
                    Edit
                  </Button>
                  <Button size="xs" color="failure" onClick={() => handleDelete(hospital._id)}>
                    Delete
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>

        {/* Create/Edit Hospital Modal */}
        <Modal show={openCreateModal} onClose={() => setOpenCreateModal(false)}>
          <Modal.Header>{formData._id ? "Edit Hospital" : "Hospital Registration"}</Modal.Header>
          <Modal.Body>
            {errorMessage && <p className="text-red-600 text-center">{errorMessage}</p>}
            {["name", "city", "identificationNumber", "email", "password", "phoneNumber", "address", "startTime", "endTime"].map((id, index) => (
              <div key={index} className="mb-2">
                <Label htmlFor={id} value={id.replace(/([A-Z])/g, " $1")} className="text-gray-700 font-medium" />
                <TextInput
                  id={id}
                  type={id === "email" ? "email" : id === "password" ? "password" : "text"}
                  value={formData[id]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}
            <div className="mb-2">
              <Label htmlFor="image" value="Hospital Image" className="text-gray-700 font-medium" />
              <FileInput id="image" onChange={handleFileChange} required={!formData._id} />
              {imagePreview && <img src={imagePreview} alt="Preview" className="mt-4 w-32 h-32 object-cover rounded-lg border-2 border-gray-400" />}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleSubmit}>{formData._id ? "Update" : "Register"}</Button>
            <Button color="gray" onClick={() => setOpenCreateModal(false)}>Cancel</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}
