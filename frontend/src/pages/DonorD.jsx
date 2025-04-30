import React, { useEffect, useState, useCallback } from "react";
import { Button, Table, Modal, TextInput, Label, Spinner } from "flowbite-react";
import { DashboardSidebar } from "../components/DashboardSidebar";
import { useDonor } from "../hooks/donor";
import { useGenerateReport } from "../hooks/useGenerateReport";

export default function DonorDashboard() {
  const { donors, loading, error, fetchDonors, updateDonor, deleteDonor, activateDeactivateDonor } = useDonor();
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const {reportUrl, generateDonorReport} = useGenerateReport();
  const initialDonorData = {
    firstName: "",
    lastName: "",
    phoneNumber: "",
    city: ""
  };

  const [donorData, setDonorData] = useState(initialDonorData);
  const [editErrors, setEditErrors] = useState({});

  const loadDonors = useCallback(() => {
    fetchDonors();
  }, [fetchDonors]);

  useEffect(() => {
    loadDonors();
  }, [loadDonors]);

  // Validation function
  const validateEditForm = () => {
    const errors = {};
    if (!donorData.firstName.trim()) errors.firstName = "First name is required";
    if (!donorData.lastName.trim()) errors.lastName = "Last name is required";
    if (!donorData.phoneNumber) {
      errors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(donorData.phoneNumber)) {
      errors.phoneNumber = "Phone number must be exactly 10 digits";
    }
    if (!donorData.city.trim()) errors.city = "City is required";
    setEditErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    // Special handling for phone number to only allow digits
    if (id === "phoneNumber") {
      if (/^\d*$/.test(value) && value.length <= 10) {
        setDonorData((prev) => ({ ...prev, [id]: value }));
      }
    } else {
      setDonorData((prev) => ({ ...prev, [id]: value }));
    }
    setEditErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const handleEdit = (donor) => {
    if (!donor || !donor._id) return;
    setSelectedDonor(donor);
    setDonorData({
      firstName: donor.firstName || "",
      lastName: donor.lastName || "",
      phoneNumber: donor.phoneNumber || "",
      city: donor.city || ""
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

  const handleToggleStatus = async (donor) => {
    if (!donor || !donor._id) return;
    try {
      await activateDeactivateDonor(donor._id);
      loadDonors();
    } catch (err) {
      console.error("Error toggling donor status:", err);
    }
  };
  const handleGenerateReport = (e) => {
    e.preventDefault();
    generateDonorReport();


};

  return (
    <div className="flex min-h-screen bg-gray-100">
      <DashboardSidebar />
      <div className="flex-1 p-6">
        
        <h1 className="text-2xl font-bold text-red-700 mb-4">Donor Dashboard</h1>
        <Button gradientDuoTone="redToPink" onClick={handleGenerateReport} disabled={loading}> 
           Generate Report
           </Button>

           {reportUrl && (
                <div>
                    <p>Report generated successfully!</p>
                    <a href={`http://localhost:3020${reportUrl}`} download>
                        Download Report
                    </a>
                </div>
                    )}
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
            <Table.HeadCell>Status</Table.HeadCell>
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
                  <Table.Cell className={donor.activeStatus ? "text-green-600" : "text-red-600"}>
                    {donor.activeStatus ? "Active" : "Deactive"}
                  </Table.Cell>
                  <Table.Cell className="space-x-2">
                    <Button size="xs" color="blue" onClick={() => handleEdit(donor)}>
                      Edit
                    </Button>
                    <Button size="xs" color="failure" onClick={() => handleDelete(donor)}>
                      Delete
                    </Button>
                    <Button
                      size="xs"
                      color={donor.activeStatus ? "warning" : "success"}
                      onClick={() => handleToggleStatus(donor)}
                    >
                      {donor.activeStatus ? "Deactivate" : "Activate"}
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan="10" className="text-center py-4 text-gray-500">
                  No donors found
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>

        {/* Edit Modal - Only shows editable fields */}
        <Modal show={openEditModal} onClose={() => setOpenEditModal(false)}>
          <Modal.Header>Edit Donor Information</Modal.Header>
          <Modal.Body>
            <div className="space-y-4">
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
                <Label value="Phone Number" />
                <TextInput
                  id="phoneNumber"
                  value={donorData.phoneNumber}
                  onChange={handleChange}
                  required
                  maxLength={10}
                  color={editErrors.phoneNumber ? "failure" : "gray"}
                  placeholder="10 digits only"
                />
                {editErrors.phoneNumber && <p className="text-red-600 text-sm mt-1">{editErrors.phoneNumber}</p>}
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