import React, { useEffect, useState } from "react";
import { Button, Table, Modal, TextInput, Label, Spinner, FileInput, Select } from "flowbite-react";
import { DashboardSidebar } from "../components/DashboardSidebar";
import { useSystemManager } from "../hooks/useSystemManager";
import { useAuthContext } from "../hooks/useAuthContext";
import { useGenerateReport } from "../hooks/useGenerateReport";

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
  const { reportUrl, generateSystemAdminReport } = useGenerateReport();

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

  const handleChange = (e) => {
    const { id, value } = e.target;
    if ((id === "phoneNumber" || id === "nic") && !/^\d*$/.test(value)) return;
    setManagerData((prev) => ({ ...prev, [id]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setManagerData((prev) => ({ ...prev, image: file }));
  };

  const handleCreate = async () => {
    const errors = validateForm(managerData, true);
    setCreateErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setActionLoading(true);
    try {
      const formData = new FormData();
      Object.keys(managerData).forEach((key) => {
        if (managerData[key]) formData.append(key, managerData[key]);
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
      image: null,
      password: "",
      role: manager.role || "Junior",
    });
    setEditErrors({});
    setOpenEditModal(true);
  };

  const handleUpdate = async () => {
    if (!selectedManager) return;
    const errors = validateForm(managerData);
    setEditErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setActionLoading(true);
    try {
      const formData = new FormData();
      Object.keys(managerData).forEach((key) => {
        if (managerData[key]) formData.append(key, managerData[key]);
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

  const handleToggleStatus = async (id) => {
    setActionLoading(true);
    try {
      await activateDeactivateManager(id);
    } catch (err) {
      console.error("Error toggling status:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = (manager) => {
    setSelectedManager(manager);
    setOpenDeleteModal(true);
  };

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

  const handleGenerateReport = (e) => {
    e.preventDefault();
    generateSystemAdminReport(user.userObj._id);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <DashboardSidebar />
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-red-700">System Managers</h1>
          <div className="flex gap-2">
            <Button
              gradientDuoTone="redToPink"
              onClick={handleGenerateReport}
              disabled={loading}
              className="bg-red-500 text-white rounded-lg hover:bg-red-700 transition"
            >
              Generate Report
            </Button>
            {reportUrl && (
              <a
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                href={`http://localhost:3020${reportUrl}`}
                download
              >
                Download Report
              </a>
            )}
            <Button
              gradientDuoTone="redToPink"
              onClick={() => setOpenCreateModal(true)}
              disabled={actionLoading}
              className="bg-red-500 text-white rounded-lg hover:bg-red-700 transition"
            >
              Add New Manager
            </Button>
          </div>
        </div>

        {loading && <Spinner className="mb-4" />}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <Table hoverable>
          <Table.Head>
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
                  <Table.Cell>
                    <div className="flex space-x-2">
                      <Button
                        size="xs"
                        color={manager.activeStatus ? "failure" : "success"}
                        onClick={() => handleToggleStatus(manager._id)}
                        disabled={actionLoading}
                        className="rounded-lg"
                      >
                        {manager.activeStatus ? "Deactivate" : "Activate"}
                      </Button>
                      <Button
                        size="xs"
                        color="primary"
                        onClick={() => handleEdit(manager)}
                        disabled={actionLoading}
                        className="rounded-lg"
                      >
                        Edit
                      </Button>
                      <Button
                        size="xs"
                        color="failure"
                        onClick={() => handleDelete(manager)}
                        disabled={actionLoading}
                        className="rounded-lg"
                      >
                        Delete
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan="6" className="text-center">
                  No managers found.
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>

        {/* Create Modal */}
        <Modal show={openCreateModal} onClose={() => setOpenCreateModal(false)}>
          <Modal.Header>Create New Manager</Modal.Header>
          <Modal.Body>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <TextInput
                  id="email"
                  value={managerData.email}
                  onChange={handleChange}
                  color={createErrors.email ? "failure" : "gray"}
                  helperText={createErrors.email}
                />
              </div>
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <TextInput
                  id="firstName"
                  value={managerData.firstName}
                  onChange={handleChange}
                  color={createErrors.firstName ? "failure" : "gray"}
                  helperText={createErrors.firstName}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <TextInput
                  id="lastName"
                  value={managerData.lastName}
                  onChange={handleChange}
                  color={createErrors.lastName ? "failure" : "gray"}
                  helperText={createErrors.lastName}
                />
              </div>
              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <TextInput
                  id="phoneNumber"
                  value={managerData.phoneNumber}
                  onChange={handleChange}
                  color={createErrors.phoneNumber ? "failure" : "gray"}
                  helperText={createErrors.phoneNumber}
                />
              </div>
              <div>
                <Label htmlFor="dob">Date of Birth</Label>
                <TextInput
                  id="dob"
                  type="date"
                  value={managerData.dob}
                  onChange={handleChange}
                  color={createErrors.dob ? "failure" : "gray"}
                  helperText={createErrors.dob}
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <TextInput
                  id="address"
                  value={managerData.address}
                  onChange={handleChange}
                  color={createErrors.address ? "failure" : "gray"}
                  helperText={createErrors.address}
                />
              </div>
              <div>
                <Label htmlFor="nic">NIC</Label>
                <TextInput
                  id="nic"
                  value={managerData.nic}
                  onChange={handleChange}
                  color={createErrors.nic ? "failure" : "gray"}
                  helperText={createErrors.nic}
                />
              </div>
              <div>
                <Label htmlFor="image">Profile Image</Label>
                <FileInput
                  id="image"
                  onChange={handleImageUpload}
                  color={createErrors.image ? "failure" : "gray"}
                  helperText={createErrors.image}
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <TextInput
                  id="password"
                  type="password"
                  value={managerData.password}
                  onChange={handleChange}
                  color={createErrors.password ? "failure" : "gray"}
                  helperText={createErrors.password}
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select
                  id="role"
                  value={managerData.role}
                  onChange={handleChange}
                  color={createErrors.role ? "failure" : "gray"}
                >
                  {roleOptions.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </Select>
                {createErrors.role && <p className="text-red-500 text-sm">{createErrors.role}</p>}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleCreate} disabled={actionLoading}>
              Create
            </Button>
            <Button color="gray" onClick={() => setOpenCreateModal(false)} disabled={actionLoading}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Edit Modal */}
        <Modal show={openEditModal} onClose={() => setOpenEditModal(false)}>
          <Modal.Header>Edit Manager</Modal.Header>
          <Modal.Body>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <TextInput
                  id="email"
                  value={managerData.email}
                  onChange={handleChange}
                  color={editErrors.email ? "failure" : "gray"}
                  helperText={editErrors.email}
                />
              </div>
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <TextInput
                  id="firstName"
                  value={managerData.firstName}
                  onChange={handleChange}
                  color={editErrors.firstName ? "failure" : "gray"}
                  helperText={editErrors.firstName}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <TextInput
                  id="lastName"
                  value={managerData.lastName}
                  onChange={handleChange}
                  color={editErrors.lastName ? "failure" : "gray"}
                  helperText={editErrors.lastName}
                />
              </div>
              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <TextInput
                  id="phoneNumber"
                  value={managerData.phoneNumber}
                  onChange={handleChange}
                  color={editErrors.phoneNumber ? "failure" : "gray"}
                  helperText={editErrors.phoneNumber}
                />
              </div>
              <div>
                <Label htmlFor="dob">Date of Birth</Label>
                <TextInput
                  id="dob"
                  type="date"
                  value={managerData.dob}
                  onChange={handleChange}
                  color={editErrors.dob ? "failure" : "gray"}
                  helperText={editErrors.dob}
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <TextInput
                  id="address"
                  value={managerData.address}
                  onChange={handleChange}
                  color={editErrors.address ? "failure" : "gray"}
                  helperText={editErrors.address}
                />
              </div>
              <div>
                <Label htmlFor="nic">NIC</Label>
                <TextInput
                  id="nic"
                  value={managerData.nic}
                  onChange={handleChange}
                  color={editErrors.nic ? "failure" : "gray"}
                  helperText={editErrors.nic}
                />
              </div>
              <div>
                <Label htmlFor="image">Profile Image</Label>
                <FileInput
                  id="image"
                  onChange={handleImageUpload}
                  color={editErrors.image ? "failure" : "gray"}
                  helperText={editErrors.image}
                />
              </div>
              <div>
                <Label htmlFor="password">Password (optional)</Label>
                <TextInput
                  id="password"
                  type="password"
                  value={managerData.password}
                  onChange={handleChange}
                  color={editErrors.password ? "failure" : "gray"}
                  helperText={editErrors.password}
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select
                  id="role"
                  value={managerData.role}
                  onChange={handleChange}
                  color={editErrors.role ? "failure" : "gray"}
                >
                  {roleOptions.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </Select>
                {editErrors.role && <p className="text-red-500 text-sm">{editErrors.role}</p>}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleUpdate} disabled={actionLoading}>
              Update
            </Button>
            <Button color="gray" onClick={() => setOpenEditModal(false)} disabled={actionLoading}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Delete Modal */}
        <Modal show={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
          <Modal.Header>Confirm Delete</Modal.Header>
          <Modal.Body>
            Are you sure you want to delete {selectedManager?.firstName} {selectedManager?.lastName}?
          </Modal.Body>
          <Modal.Footer>
            <Button color="failure" onClick={handleConfirmDelete} disabled={actionLoading}>
              Delete
            </Button>
            <Button color="gray" onClick={() => setOpenDeleteModal(false)} disabled={actionLoading}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}