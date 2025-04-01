import React, { useEffect, useState, useCallback } from "react";
import { Button, Table, Modal, TextInput, Label, Select, Spinner } from "flowbite-react";
import { DashboardSidebar } from "../components/DashboardSidebar";
import { useDonor } from "../hooks/donor";

export default function DonorDashboard() {
  const { donors, loading, error, fetchDonors, updateDonor, deleteDonor } = useDonor();
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  const initialDonorData = {
    email: "",
    firstName: "",
    lastName: "",
    gender: "",
    phoneNumber: "",
    password: "",
    dob: "",
    bloodType: "",
    city: "",
    nic: "",
  };

  const [donorData, setDonorData] = useState(initialDonorData);
  const [editErrors, setEditErrors] = useState({});

  const bloodTypes = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
  const genderOptions = ["Male", "Female", "Other"];

  const loadDonors = useCallback(() => {
    fetchDonors();
  }, [fetchDonors]);

  useEffect(() => {
    loadDonors();
  }, [loadDonors]);

  // Validation function
  const validateEditForm = () => {
    const errors = {};
    if (!donorData.email) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(donorData.email)) errors.email = "Invalid email format";
    if (!donorData.firstName) errors.firstName = "First name is required";
    if (!donorData.lastName) errors.lastName = "Last name is required";
    if (!donorData.gender) errors.gender = "Gender is required";
    else if (!genderOptions.includes(donorData.gender)) errors.gender = "Invalid gender selection";
    if (!donorData.phoneNumber) errors.phoneNumber = "Phone number is required";
    else if (!/^\+?\d{9,15}$/.test(donorData.phoneNumber)) errors.phoneNumber = "Phone number must be 9-15 digits (optional + prefix)";
    if (donorData.password && donorData.password.length < 6) errors.password = "Password must be at least 6 characters";
    if (!donorData.dob) errors.dob = "Date of birth is required";
    else if (new Date(donorData.dob) >= new Date().setHours(0, 0, 0, 0)) errors.dob = "Date of birth must be in the past";
    if (!donorData.bloodType) errors.bloodType = "Blood type is required";
    else if (!bloodTypes.includes(donorData.bloodType)) errors.bloodType = "Invalid blood type";
    if (!donorData.city) errors.city = "City is required";
    if (!donorData.nic) errors.nic = "NIC is required";
    else if (!/^\d{9}[vV]?$|^\d{12}$/.test(donorData.nic)) errors.nic = "NIC must be 9 digits + optional 'v' or 12 digits";
    setEditErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setDonorData((prev) => ({ ...prev, [id]: value }));
  };

  const handleEdit = (donor) => {
    if (!donor || !donor._id) return;
    setSelectedDonor(donor);
    setDonorData({
      email: donor.email || "",
      firstName: donor.firstName || "",
      lastName: donor.lastName || "",
      gender: donor.gender || "",
      phoneNumber: donor.phoneNumber || "",
      password: "", // Keep empty for security
      dob: donor.dob ? donor.dob.split("T")[0] : "",
      bloodType: donor.bloodType || "",
      city: donor.city || "",
      nic: donor.nic || "",
    });
    setEditErrors({});
    setOpenEditModal(true);
  };

  const handleUpdate = async () => {
    if (!validateEditForm()) return;
    if (!selectedDonor || !selectedDonor._id) return;
    setEditLoading(true);
    try {
      await updateDonor(selectedDonor._id, donorData);
      setOpenEditModal(false);
      loadDonors();
    } catch (err) {
      console.error("Error updating donor:", err);
    } finally {
      setEditLoading(false);
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
      loadDonors();
    } catch (err) {
      console.error("Error deleting donor:", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <DashboardSidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold text-red-700 mb-4">Donor Dashboard</h1>
        {loading && <Spinner className="mb-4" />}
        {error && <p className="text-red-500 mb-4">{error}</p>}

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
            {donors.length > 0 ? (
              donors.map((donor) => (
                <Table.Row key={donor._id} className="bg-white">
                  <Table.Cell>{donor._id}</Table.Cell>
                  <Table.Cell>{`${donor.firstName} ${donor.lastName}`}</Table.Cell>
                  <Table.Cell>{donor.gender || "N/A"}</Table.Cell>
                  <Table.Cell>{donor.email}</Table.Cell>
                  <Table.Cell>{donor.phoneNumber || "N/A"}</Table.Cell>
                  <Table.Cell>{donor.bloodType || "N/A"}</Table.Cell>
                  <Table.Cell>{donor.city || "N/A"}</Table.Cell>
                  <Table.Cell>{donor.nic || "N/A"}</Table.Cell>
                  <Table.Cell className="space-x-2">
                    <Button size="xs" color="blue" onClick={() => handleEdit(donor)}>
                      Edit
                    </Button>
                    <Button size="xs" color="failure" onClick={() => handleDelete(donor)}>
                      Delete
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan="9" className="text-center py-4 text-gray-500">
                  No donors found
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>

        {/* Edit Modal */}
        <Modal show={openEditModal} onClose={() => setOpenEditModal(false)}>
          <Modal.Header>Edit Donor</Modal.Header>
          <Modal.Body>
            <div className="space-y-4">
              <div>
                <Label value="Email" />
                <TextInput
                  id="email"
                  value={donorData.email}
                  onChange={handleChange}
                  required
                  color={editErrors.email ? "failure" : "gray"}
                />
                {editErrors.email && <p className="text-red-600 text-sm mt-1">{editErrors.email}</p>}
              </div>
              <div>
                <Label value="First Name" />
                <TextInput
                  id="firstName"
                  value={donorData.firstName}
                  onChange={handleChange}
                  required
                  color={editErrors.firstName ? "failure" : "gray"}
                />
                {editErrors.firstName && <p className="text-red-600 text-sm mt-1">{editErrors.firstName}</p>}
              </div>
              <div>
                <Label value="Last Name" />
                <TextInput
                  id="lastName"
                  value={donorData.lastName}
                  onChange={handleChange}
                  required
                  color={editErrors.lastName ? "failure" : "gray"}
                />
                {editErrors.lastName && <p className="text-red-600 text-sm mt-1">{editErrors.lastName}</p>}
              </div>
              <div>
                <Label value="Gender" />
                <Select
                  id="gender"
                  value={donorData.gender}
                  onChange={handleChange}
                  required
                  color={editErrors.gender ? "failure" : "gray"}
                >
                  <option value="" disabled>
                    Select Gender
                  </option>
                  {genderOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
                {editErrors.gender && <p className="text-red-600 text-sm mt-1">{editErrors.gender}</p>}
              </div>
              <div>
                <Label value="Phone Number" />
                <TextInput
                  id="phoneNumber"
                  value={donorData.phoneNumber}
                  onChange={handleChange}
                  required
                  color={editErrors.phoneNumber ? "failure" : "gray"}
                />
                {editErrors.phoneNumber && <p className="text-red-600 text-sm mt-1">{editErrors.phoneNumber}</p>}
              </div>
              <div>
                <Label value="Password (Leave blank to keep unchanged)" />
                <TextInput
                  id="password"
                  type="password"
                  value={donorData.password}
                  onChange={handleChange}
                  color={editErrors.password ? "failure" : "gray"}
                />
                {editErrors.password && <p className="text-red-600 text-sm mt-1">{editErrors.password}</p>}
              </div>
              <div>
                <Label value="Date of Birth" />
                <TextInput
                  id="dob"
                  type="date"
                  value={donorData.dob}
                  onChange={handleChange}
                  required
                  color={editErrors.dob ? "failure" : "gray"}
                />
                {editErrors.dob && <p className="text-red-600 text-sm mt-1">{editErrors.dob}</p>}
              </div>
              <div>
                <Label value="Blood Type" />
                <Select
                  id="bloodType"
                  value={donorData.bloodType}
                  onChange={handleChange}
                  required
                  color={editErrors.bloodType ? "failure" : "gray"}
                >
                  <option value="" disabled>
                    Select Blood Type
                  </option>
                  {bloodTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Select>
                {editErrors.bloodType && <p className="text-red-600 text-sm mt-1">{editErrors.bloodType}</p>}
              </div>
              <div>
                <Label value="City" />
                <TextInput
                  id="city"
                  value={donorData.city}
                  onChange={handleChange}
                  required
                  color={editErrors.city ? "failure" : "gray"}
                />
                {editErrors.city && <p className="text-red-600 text-sm mt-1">{editErrors.city}</p>}
              </div>
              <div>
                <Label value="NIC" />
                <TextInput
                  id="nic"
                  value={donorData.nic}
                  onChange={handleChange}
                  required
                  color={editErrors.nic ? "failure" : "gray"}
                />
                {editErrors.nic && <p className="text-red-600 text-sm mt-1">{editErrors.nic}</p>}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              gradientDuoTone="redToPink"
              onClick={handleUpdate}
              disabled={editLoading}
            >
              {editLoading ? <Spinner size="sm" className="mr-2" /> : null}
              {editLoading ? "Updating..." : "Update"}
            </Button>
            <Button color="gray" onClick={() => setOpenEditModal(false)} disabled={editLoading}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Delete Modal */}
        <Modal show={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
          <Modal.Header>Confirm Delete</Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to delete {selectedDonor?.firstName} {selectedDonor?.lastName}?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button color="failure" onClick={handleConfirmDelete}>
              Delete
            </Button>
            <Button color="gray" onClick={() => setOpenDeleteModal(false)}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}