import React, { useEffect, useState } from "react";
import { Button, Table, Modal, TextInput, Label, Spinner, FileInput, Select } from "flowbite-react";
import { DashboardSidebar } from "../components/DashboardSidebar";
import { useSystemManager } from "../hooks/useSystemManager";
import { useAuthContext } from "../hooks/useAuthContext";

export default function SystemManagersD() {
  const {
    managers,
    loading,
    error,
    fetchManagers,
    createManager,
    updateManager,
    activateDeactivateManager,
    deleteManager,
  } = useSystemManager();

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedManager, setSelectedManager] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [createErrors, setCreateErrors] = useState({});
  const [editErrors, setEditErrors] = useState({});
  const { user } = useAuthContext();

  const [managerData, setManagerData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    dob: "",
    address: "",
    nic: "",
    image: null,
    password: "",
    role: "Junior",
  });

  const roleOptions = ["Master", "Junior"];

  useEffect(() => {
    fetchManagers();
  }, [fetchManagers]);

  // Validation function
  const validateForm = (data, isCreate = false) => {
    const errors = {};
    if (!data.email) errors.email = "Email is required";
    else if (!/^[^\s@]+@bloodbank\.lk$/.test(data.email)) errors.email = "Email must end with @bloodbank.lk";
    if (!data.firstName) errors.firstName = "First name is required";
    if (!data.lastName) errors.lastName = "Last name is required";
    if (!data.phoneNumber) errors.phoneNumber = "Phone number is required";
    else if (!/^\d{10}$/.test(data.phoneNumber)) errors.phoneNumber = "Phone number must be exactly 10 digits";
    if (!data.dob) errors.dob = "Date of birth is required";
    else {
      const dobDate = new Date(data.dob);
      const twentyYearsAgo = new Date();
      twentyYearsAgo.setFullYear(twentyYearsAgo.getFullYear() - 20);
      if (dobDate > twentyYearsAgo) errors.dob = "Must be at least 20 years old";
      else if (dobDate >= new Date().setHours(0, 0, 0, 0)) errors.dob = "Date of birth must be in the past";
    }
    if (!data.address) errors.address = "Address is required";
    if (!data.nic) errors.nic = "NIC is required";
    else if (!/^\d{12}$/.test(data.nic)) errors.nic = "NIC must be exactly 12 digits";
    if (isCreate && !data.password) errors.password = "Password is required";
    else if (data.password && data.password.length < 6) errors.password = "Password must be at least 6 characters";
    else if (data.password && !/[!@#$%^&*(),.?":{}|<>]/.test(data.password)) errors.password = "Password must contain at least one special character";
    if (data.image && !["image/jpeg", "image/png"].includes(data.image.type)) errors.image = "Image must be JPG or PNG";
    if (!data.role) errors.role = "Role is required";
    else if (!roleOptions.includes(data.role)) errors.role = "Invalid role selected";
    return errors;
  };

  // Handle text/select input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === "phoneNumber" && !/^\d*$/.test(value)) return; // Only allow digits
    if (id === "nic" && !/^\d*$/.test(value)) return; // Only allow digits
    setManagerData((prev) => ({ ...prev, [id]: value }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setManagerData((prev) => ({ ...prev, image: file }));
    }
  };

  // Handle manager creation
  const handleCreate = async () => {
    const errors = validateForm(managerData, true);
    setCreateErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setActionLoading(true);
    try {
      const formData = new FormData();
      Object.keys(managerData).forEach((key) => {
        if (managerData[key] !== null && managerData[key] !== "") {
          formData.append(key, managerData[key]);
        }
      });
      await createManager(formData);
      setOpenCreateModal(false);
      resetManagerData();
    } catch (err) {
      console.error("Error creating manager:", err);
    } finally {
      setActionLoading(false);
    }
  };

  // Open edit modal with pre-filled data
  const handleEdit = (manager) => {
    setSelectedManager(manager);
    setManagerData({
      email: manager.email || "",
      firstName: manager.firstName || "",
      lastName: manager.lastName || "",
      phoneNumber: manager.phoneNumber || "",
      dob: manager.dob ? manager.dob.split("T")[0] : "",
      address: manager.address || "",
      nic: manager.nic || "",
      image: null, // Reset image for edit (re-upload required)
      password: "", // No pre-filled password
      role: manager.role || "Junior",
    });
    setEditErrors({});
    setOpenEditModal(true);
  };

  // Handle manager update
  const handleUpdate = async () => {
    if (!selectedManager) return;
    const errors = validateForm(managerData);
    setEditErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setActionLoading(true);
    try {
      const formData = new FormData();
      Object.keys(managerData).forEach((key) => {
        if (managerData[key] !== null && managerData[key] !== "") {
          formData.append(key, managerData[key]);
        }
      });
      await updateManager(selectedManager._id, formData);
      setOpenEditModal(false);
      resetManagerData();
    } catch (err) {
      console.error("Error updating manager:", err);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle toggle status
  const handleToggleStatus = async (id) => {
    setActionLoading(true);
    try {
      await activateDeactivateManager(id);
    } catch (err) {
      console.error("Error toggling manager status:", err);
    } finally {
      setActionLoading(false);
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
    setActionLoading(true);
    try {
      await deleteManager(selectedManager._id);
      setOpenDeleteModal(false);
    } catch (err) {
      console.error("Error deleting manager:", err);
    } finally {
      setActionLoading(false);
    }
  };

  // Reset form data
  const resetManagerData = () => {
    setManagerData({
      email: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      dob: "",
      address: "",
      nic: "",
      image: null,
      password: "",
      role: "Junior",
    });
    setCreateErrors({});
    setEditErrors({});
  };

  // Calculate max date for DOB (20 years ago)
  const getMaxDob = () => {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 20);
    return today.toISOString().split("T")[0];
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <DashboardSidebar />
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-red-700">System Managers</h1>
          <Button gradientDuoTone="redToPink" onClick={() => setOpenCreateModal(true)} disabled={actionLoading}>
            Add New Manager
          </Button>
        </div>

        {loading && <Spinner className="mb-4" />}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>ID</Table.HeadCell>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Phone</Table.HeadCell>
            <Table.HeadCell>Role</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {managers.length > 0 ? (
              managers.map((manager) => (
                <Table.Row key={manager._id} className="bg-white">
                  <Table.Cell>{manager._id}</Table.Cell>
                  <Table.Cell>{`${manager.firstName} ${manager.lastName}`}</Table.Cell>
                  <Table.Cell>{manager.email}</Table.Cell>
                  <Table.Cell>{manager.phoneNumber || "N/A"}</Table.Cell>
                  <Table.Cell>{manager.role}</Table.Cell>
                  <Table.Cell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        manager.activeStatus ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {manager.activeStatus ? "Active" : "Inactive"}
                    </span>
                  </Table.Cell>
                  <Table.Cell className="space-x-2">
                    <Button
                      size="xs"
                      color={manager.activeStatus ? "failure" : "success"}
                      onClick={() => handleToggleStatus(manager._id)}
                      disabled={actionLoading}
                    >
                      {manager.activeStatus ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      size="xs"
                      color="blue"
                      onClick={() => handleEdit(manager)}
                      disabled={actionLoading}
                    >
                      Edit
                    </Button>
                    <Button
                      size="xs"
                      color="failure"
                      onClick={() => handleDelete(manager)}
                      disabled={actionLoading}
                    >
                      Delete
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan="7" className="text-center py-4 text-gray-500">
                  No system managers found
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>

      {/* Create Manager Modal */}
      <Modal show={openCreateModal} onClose={() => setOpenCreateModal(false)}>
        <Modal.Header>Add New System Manager</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email (must end with @bloodbank.lk)</Label>
              <TextInput
                id="email"
                value={managerData.email}
                onChange={handleChange}
                required
                color={createErrors.email ? "failure" : "gray"}
              />
              {createErrors.email && <p className="text-red-600 text-sm mt-1">{createErrors.email}</p>}
            </div>
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <TextInput
                id="firstName"
                value={managerData.firstName}
                onChange={handleChange}
                required
                color={createErrors.firstName ? "failure" : "gray"}
              />
              {createErrors.firstName && <p className="text-red-600 text-sm mt-1">{createErrors.firstName}</p>}
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <TextInput
                id="lastName"
                value={managerData.lastName}
                onChange={handleChange}
                required
                color={createErrors.lastName ? "failure" : "gray"}
              />
              {createErrors.lastName && <p className="text-red-600 text-sm mt-1">{createErrors.lastName}</p>}
            </div>
            <div>
              <Label htmlFor="phoneNumber">Phone Number (10 digits)</Label>
              <TextInput
                id="phoneNumber"
                value={managerData.phoneNumber}
                onChange={handleChange}
                required
                maxLength={10}
                color={createErrors.phoneNumber ? "failure" : "gray"}
              />
              {createErrors.phoneNumber && <p className="text-red-600 text-sm mt-1">{createErrors.phoneNumber}</p>}
            </div>
            <div>
              <Label htmlFor="dob">Date of Birth (at least 20 years old)</Label>
              <TextInput
                id="dob"
                type="date"
                value={managerData.dob}
                onChange={handleChange}
                max={getMaxDob()}
                required
                color={createErrors.dob ? "failure" : "gray"}
              />
              {createErrors.dob && <p className="text-red-600 text-sm mt-1">{createErrors.dob}</p>}
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <TextInput
                id="address"
                value={managerData.address}
                onChange={handleChange}
                required
                color={createErrors.address ? "failure" : "gray"}
              />
              {createErrors.address && <p className="text-red-600 text-sm mt-1">{createErrors.address}</p>}
            </div>
            <div>
              <Label htmlFor="nic">NIC (12 digits)</Label>
              <TextInput
                id="nic"
                value={managerData.nic}
                onChange={handleChange}
                required
                maxLength={12}
                color={createErrors.nic ? "failure" : "gray"}
              />
              {createErrors.nic && <p className="text-red-600 text-sm mt-1">{createErrors.nic}</p>}
            </div>
            <div>
              <Label htmlFor="password">Password (min 6 characters, one special character)</Label>
              <TextInput
                id="password"
                type="password"
                value={managerData.password}
                onChange={handleChange}
                required
                color={createErrors.password ? "failure" : "gray"}
              />
              {createErrors.password && <p className="text-red-600 text-sm mt-1">{createErrors.password}</p>}
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Select
                id="role"
                value={managerData.role}
                onChange={handleChange}
                required
                color={createErrors.role ? "failure" : "gray"}
              >
                <option value="" disabled>Select Role</option>
                {roleOptions.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </Select>
              {createErrors.role && <p className="text-red-600 text-sm mt-1">{createErrors.role}</p>}
            </div>
            <div>
              <Label htmlFor="image">Profile Image (Optional)</Label>
              <FileInput
                id="image"
                accept="image/jpeg,image/png"
                onChange={handleImageUpload}
                color={createErrors.image ? "failure" : "gray"}
              />
              {createErrors.image && <p className="text-red-600 text-sm mt-1">{createErrors.image}</p>}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            gradientDuoTone="redToPink"
            onClick={handleCreate}
            disabled={actionLoading}
          >
            {actionLoading ? <Spinner size="sm" className="mr-2" /> : null}
            {actionLoading ? "Creating..." : "Create"}
          </Button>
          <Button
            color="gray"
            onClick={() => setOpenCreateModal(false)}
            disabled={actionLoading}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Manager Modal */}
      <Modal show={openEditModal} onClose={() => setOpenEditModal(false)}>
        <Modal.Header>Edit System Manager</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <TextInput
                id="email"
                value={managerData.email}
                onChange={handleChange}
                required
                color={editErrors.email ? "failure" : "gray"}
              />
              {editErrors.email && <p className="text-red-600 text-sm mt-1">{editErrors.email}</p>}
            </div>
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <TextInput
                id="firstName"
                value={managerData.firstName}
                onChange={handleChange}
                required
                color={editErrors.firstName ? "failure" : "gray"}
              />
              {editErrors.firstName && <p className="text-red-600 text-sm mt-1">{editErrors.firstName}</p>}
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <TextInput
                id="lastName"
                value={managerData.lastName}
                onChange={handleChange}
                required
                color={editErrors.lastName ? "failure" : "gray"}
              />
              {editErrors.lastName && <p className="text-red-600 text-sm mt-1">{editErrors.lastName}</p>}
            </div>
            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <TextInput
                id="phoneNumber"
                value={managerData.phoneNumber}
                onChange={handleChange}
                required
                color={editErrors.phoneNumber ? "failure" : "gray"}
              />
              {editErrors.phoneNumber && <p className="text-red-600 text-sm mt-1">{editErrors.phoneNumber}</p>}
            </div>
            <div>
              <Label htmlFor="dob">Date of Birth</Label>
              <TextInput
                id="dob"
                type="date"
                value={managerData.dob}
                onChange={handleChange}
                required
                color={editErrors.dob ? "failure" : "gray"}
              />
              {editErrors.dob && <p className="text-red-600 text-sm mt-1">{editErrors.dob}</p>}
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <TextInput
                id="address"
                value={managerData.address}
                onChange={handleChange}
                required
                color={editErrors.address ? "failure" : "gray"}
              />
              {editErrors.address && <p className="text-red-600 text-sm mt-1">{editErrors.address}</p>}
            </div>
            <div>
              <Label htmlFor="nic">NIC</Label>
              <TextInput
                id="nic"
                value={managerData.nic}
                onChange={handleChange}
                required
                color={editErrors.nic ? "failure" : "gray"}
              />
              {editErrors.nic && <p className="text-red-600 text-sm mt-1">{editErrors.nic}</p>}
            </div>
            <div>
              <Label htmlFor="password">Password (Leave blank to keep unchanged)</Label>
              <TextInput
                id="password"
                type="password"
                value={managerData.password}
                onChange={handleChange}
                color={editErrors.password ? "failure" : "gray"}
              />
              {editErrors.password && <p className="text-red-600 text-sm mt-1">{editErrors.password}</p>}
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Select
                id="role"
                value={managerData.role}
                onChange={handleChange}
                required
                color={editErrors.role ? "failure" : "gray"}
              >
                <option value="" disabled>Select Role</option>
                {roleOptions.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </Select>
              {editErrors.role && <p className="text-red-600 text-sm mt-1">{editErrors.role}</p>}
            </div>
            <div>
              <Label htmlFor="image">Profile Image (Upload to update)</Label>
              <FileInput
                id="image"
                accept="image/jpeg,image/png"
                onChange={handleImageUpload}
                color={editErrors.image ? "failure" : "gray"}
              />
              {editErrors.image && <p className="text-red-600 text-sm mt-1">{editErrors.image}</p>}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            gradientDuoTone="redToPink"
            onClick={handleUpdate}
            disabled={actionLoading}
          >
            {actionLoading ? <Spinner size="sm" className="mr-2" /> : null}
            {actionLoading ? "Updating..." : "Update"}
          </Button>
          <Button
            color="gray"
            onClick={() => setOpenEditModal(false)}
            disabled={actionLoading}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Manager Modal */}
      <Modal show={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <Modal.Header>Confirm Delete</Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to delete {selectedManager?.firstName} {selectedManager?.lastName}?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            gradientDuoTone="redToPink"
            onClick={handleConfirmDelete}
            disabled={actionLoading}
          >
            {actionLoading ? <Spinner size="sm" className="mr-2" /> : null}
            {actionLoading ? "Deleting..." : "Delete"}
          </Button>
          <Button
            color="gray"
            onClick={() => setOpenDeleteModal(false)}
            disabled={actionLoading}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}