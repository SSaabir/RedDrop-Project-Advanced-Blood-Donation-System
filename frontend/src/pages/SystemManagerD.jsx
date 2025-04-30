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
            <Button gradientDuoTone="redToPink" onClick={handleGenerateReport} disabled={loading}>Generate Report</Button>
            {reportUrl && (
              <a className="text-blue-600 underline" href={`http://localhost:3020${reportUrl}`} download>
                Download Report
              </a>
            )}
            <Button gradientDuoTone="redToPink" onClick={() => setOpenCreateModal(true)} disabled={actionLoading}>
              Add New Manager
            </Button>
          </div>
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
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${manager.activeStatus ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {manager.activeStatus ? "Active" : "Inactive"}
                    </span>
                  </Table.Cell>
                  <Table.Cell className="space-x-2">
                    <Button size="xs" color={manager.activeStatus ? "failure" : "success"} onClick={() => handleToggleStatus(manager._id)} disabled={actionLoading}>
                      {manager.activeStatus ? "Deactivate" : "Activate"}
                    </Button>
                    <Button size="xs" onClick={() => handleEdit(manager)}>Edit</Button>
                    <Button size="xs" color="failure" onClick={() => handleDelete(manager)}>Delete</Button>
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan="7" className="text-center">No managers found.</Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}
