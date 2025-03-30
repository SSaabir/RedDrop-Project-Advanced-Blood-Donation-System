import React, { useEffect, useState } from "react";
import { Button, Spinner, Table, Modal, TextInput, Label, FileInput } from "flowbite-react";
import { DashboardSidebar } from "../components/DashboardSidebar";
import { useHospital } from "../hooks/hospital";
import { useAuthContext } from "../hooks/useAuthContext";

export default function HospitalDashboard() {
  const { hospitals, loading, error, fetchHospitals, deleteHospital, updateHospital, createHospital } = useHospital();
  const [editHospital, setEditHospital] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { user } = useAuthContext();
  const userId = user?.userObj?._id;
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
  const [addErrors, setAddErrors] = useState({});
  const [editErrors, setEditErrors] = useState({});
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchHospitals();
  }, [fetchHospitals]);

  // Validation function
  const validateForm = (data, isCreate = false) => {
    const errors = {};
    if (!data.name) errors.name = "Name is required";
    if (!data.city) errors.city = "City is required";
    if (!data.identificationNumber) errors.identificationNumber = "Identification number is required";
    else if (!/^[A-Za-z0-9-]+$/.test(data.identificationNumber)) errors.identificationNumber = "Identification number can only contain letters, numbers, and hyphens";
    if (!data.email) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = "Invalid email format";
    if (isCreate && !data.password) errors.password = "Password is required";
    else if (data.password && data.password.length < 6) errors.password = "Password must be at least 6 characters";
    if (!data.phoneNumber) errors.phoneNumber = "Phone number is required";
    else if (!/^\+?\d{9,15}$/.test(data.phoneNumber)) errors.phoneNumber = "Phone number must be 9-15 digits (optional + prefix)";
    if (!data.address) errors.address = "Address is required";
    if (isCreate && !data.image) errors.image = "Image is required";
    else if (data.image && !["image/jpeg", "image/png"].includes(data.image.type)) errors.image = "Image must be JPG or PNG";
    if (!data.startTime) errors.startTime = "Start time is required";
    if (!data.endTime) errors.endTime = "End time is required";
    else if (data.startTime && data.endTime && data.startTime >= data.endTime) errors.endTime = "End time must be after start time";
    return errors;
  };

  const handleDelete = async (id) => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this hospital?")) return;

    setActionLoading(true);
    try {
      await deleteHospital(id);
      fetchHospitals();
    } catch (err) {
      console.error("Error deleting hospital:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (hospital) => {
    setEditHospital({
      ...hospital,
      password: "", // Reset password field for security
    });
    setEditErrors({});
    setIsEditing(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editHospital?._id) return;

    const errors = validateForm(editHospital);
    setEditErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setActionLoading(true);
    try {
      await updateHospital(editHospital._id, editHospital);
      setIsEditing(false);
      fetchHospitals();
    } catch (err) {
      console.error("Error updating hospital:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddHospital = async (e) => {
    e.preventDefault();

    const errors = validateForm(newHospital, true);
    setAddErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setActionLoading(true);
    try {
      const hospitalData = new FormData();
      hospitalData.append("systemManagerId", userId);
      Object.keys(newHospital).forEach((key) => {
        if (newHospital[key] !== null && newHospital[key] !== "") {
          hospitalData.append(key, newHospital[key]);
        }
      });
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
      setAddErrors({});
      fetchHospitals();
    } catch (err) {
      console.error("Error adding hospital:", err);
    } finally {
      setActionLoading(false);
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
    setEditHospital((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleActivateDeactivate = async (id, currentStatus) => {
    setActionLoading(true);
    try {
      const updatedStatus = !currentStatus;
      await updateHospital(id, { activeStatus: updatedStatus });
      fetchHospitals();
    } catch (err) {
      console.error("Error updating hospital status:", err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <DashboardSidebar />
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-red-700">Hospital Dashboard</h1>
          <Button gradientDuoTone="redToPink" onClick={() => setIsAdding(true)} disabled={actionLoading}>
            Add Hospital
          </Button>
        </div>

        {loading && <Spinner className="mb-4" />}
        {error && <p className="text-red-500 mb-4">{error}</p>}

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
            {hospitals.length > 0 ? (
              hospitals.map((hospital) => (
                <Table.Row key={hospital._id} className="bg-white">
                  <Table.Cell>{hospital.name}</Table.Cell>
                  <Table.Cell>{hospital.city || "N/A"}</Table.Cell>
                  <Table.Cell>{hospital.identificationNumber}</Table.Cell>
                  <Table.Cell>{hospital.address}</Table.Cell>
                  <Table.Cell>{hospital.phoneNumber || "N/A"}</Table.Cell>
                  <Table.Cell>{hospital.email}</Table.Cell>
                  <Table.Cell>{hospital.startTime || "N/A"}</Table.Cell>
                  <Table.Cell>{hospital.endTime || "N/A"}</Table.Cell>
                  <Table.Cell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        hospital.activeStatus ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {hospital.activeStatus ? "Active" : "Inactive"}
                    </span>
                  </Table.Cell>
                  <Table.Cell className="space-x-2">
                    <Button size="xs" color="blue" onClick={() => handleEdit(hospital)} disabled={actionLoading}>
                      Edit
                    </Button>
                    <Button size="xs" color="failure" onClick={() => handleDelete(hospital._id)} disabled={actionLoading}>
                      Delete
                    </Button>
                    <Button
                      size="xs"
                      color={hospital.activeStatus ? "failure" : "success"}
                      onClick={() => handleActivateDeactivate(hospital._id, hospital.activeStatus)}
                      disabled={actionLoading}
                    >
                      {hospital.activeStatus ? "Deactivate" : "Activate"}
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan="10" className="text-center py-4 text-gray-500">
                  No hospitals found
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>

        {/* Add Hospital Modal */}
        <Modal show={isAdding} onClose={() => setIsAdding(false)}>
          <Modal.Header>Add Hospital</Modal.Header>
          <Modal.Body>
            <form onSubmit={handleAddHospital} className="space-y-4">
              <div>
                <Label htmlFor="name" value="Name" />
                <TextInput
                  id="name"
                  value={newHospital.name}
                  onChange={(e) => setNewHospital({ ...newHospital, name: e.target.value })}
                  required
                  color={addErrors.name ? "failure" : "gray"}
                />
                {addErrors.name && <p className="text-red-600 text-sm mt-1">{addErrors.name}</p>}
              </div>
              <div>
                <Label htmlFor="city" value="City" />
                <TextInput
                  id="city"
                  value={newHospital.city}
                  onChange={(e) => setNewHospital({ ...newHospital, city: e.target.value })}
                  required
                  color={addErrors.city ? "failure" : "gray"}
                />
                {addErrors.city && <p className="text-red-600 text-sm mt-1">{addErrors.city}</p>}
              </div>
              <div>
                <Label htmlFor="identificationNumber" value="Identification Number" />
                <TextInput
                  id="identificationNumber"
                  value={newHospital.identificationNumber}
                  onChange={(e) => setNewHospital({ ...newHospital, identificationNumber: e.target.value })}
                  required
                  color={addErrors.identificationNumber ? "failure" : "gray"}
                />
                {addErrors.identificationNumber && <p className="text-red-600 text-sm mt-1">{addErrors.identificationNumber}</p>}
              </div>
              <div>
                <Label htmlFor="email" value="Email" />
                <TextInput
                  id="email"
                  type="email"
                  value={newHospital.email}
                  onChange={(e) => setNewHospital({ ...newHospital, email: e.target.value })}
                  required
                  color={addErrors.email ? "failure" : "gray"}
                />
                {addErrors.email && <p className="text-red-600 text-sm mt-1">{addErrors.email}</p>}
              </div>
              <div>
                <Label htmlFor="password" value="Password" />
                <TextInput
                  id="password"
                  type="password"
                  value={newHospital.password}
                  onChange={(e) => setNewHospital({ ...newHospital, password: e.target.value })}
                  required
                  color={addErrors.password ? "failure" : "gray"}
                />
                {addErrors.password && <p className="text-red-600 text-sm mt-1">{addErrors.password}</p>}
              </div>
              <div>
                <Label htmlFor="phoneNumber" value="Phone Number" />
                <TextInput
                  id="phoneNumber"
                  value={newHospital.phoneNumber}
                  onChange={(e) => setNewHospital({ ...newHospital, phoneNumber: e.target.value })}
                  required
                  color={addErrors.phoneNumber ? "failure" : "gray"}
                />
                {addErrors.phoneNumber && <p className="text-red-600 text-sm mt-1">{addErrors.phoneNumber}</p>}
              </div>
              <div>
                <Label htmlFor="address" value="Address" />
                <TextInput
                  id="address"
                  value={newHospital.address}
                  onChange={(e) => setNewHospital({ ...newHospital, address: e.target.value })}
                  required
                  color={addErrors.address ? "failure" : "gray"}
                />
                {addErrors.address && <p className="text-red-600 text-sm mt-1">{addErrors.address}</p>}
              </div>
              <div>
                <Label htmlFor="image" value="Upload Image" />
                <FileInput
                  id="image"
                  accept="image/jpeg,image/png"
                  onChange={handleFileChange}
                  required
                  color={addErrors.image ? "failure" : "gray"}
                />
                {addErrors.image && <p className="text-red-600 text-sm mt-1">{addErrors.image}</p>}
                {imagePreview && <img src={imagePreview} alt="Preview" className="mt-4 w-32 h-32 object-cover rounded-full" />}
              </div>
              <div>
                <Label htmlFor="startTime" value="Start Time" />
                <TextInput
                  id="startTime"
                  type="time"
                  value={newHospital.startTime}
                  onChange={(e) => setNewHospital({ ...newHospital, startTime: e.target.value })}
                  required
                  color={addErrors.startTime ? "failure" : "gray"}
                />
                {addErrors.startTime && <p className="text-red-600 text-sm mt-1">{addErrors.startTime}</p>}
              </div>
              <div>
                <Label htmlFor="endTime" value="End Time" />
                <TextInput
                  id="endTime"
                  type="time"
                  value={newHospital.endTime}
                  onChange={(e) => setNewHospital({ ...newHospital, endTime: e.target.value })}
                  required
                  color={addErrors.endTime ? "failure" : "gray"}
                />
                {addErrors.endTime && <p className="text-red-600 text-sm mt-1">{addErrors.endTime}</p>}
              </div>
              <div className="flex justify-end space-x-2">
                <Button color="gray" onClick={() => setIsAdding(false)} disabled={actionLoading}>
                  Cancel
                </Button>
                <Button type="submit" gradientDuoTone="redToPink" disabled={actionLoading}>
                  {actionLoading ? <Spinner size="sm" className="mr-2" /> : null}
                  {actionLoading ? "Adding..." : "Add Hospital"}
                </Button>
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
                <TextInput
                  id="name"
                  name="name"
                  value={editHospital?.name || ""}
                  onChange={handleEditFieldChange}
                  required
                  color={editErrors.name ? "failure" : "gray"}
                />
                {editErrors.name && <p className="text-red-600 text-sm mt-1">{editErrors.name}</p>}
              </div>
              <div>
                <Label htmlFor="city" value="City" />
                <TextInput
                  id="city"
                  name="city"
                  value={editHospital?.city || ""}
                  onChange={handleEditFieldChange}
                  required
                  color={editErrors.city ? "failure" : "gray"}
                />
                {editErrors.city && <p className="text-red-600 text-sm mt-1">{editErrors.city}</p>}
              </div>
              <div>
                <Label htmlFor="identificationNumber" value="Identification Number" />
                <TextInput
                  id="identificationNumber"
                  name="identificationNumber"
                  value={editHospital?.identificationNumber || ""}
                  onChange={handleEditFieldChange}
                  required
                  color={editErrors.identificationNumber ? "failure" : "gray"}
                />
                {editErrors.identificationNumber && <p className="text-red-600 text-sm mt-1">{editErrors.identificationNumber}</p>}
              </div>
              <div>
                <Label htmlFor="email" value="Email" />
                <TextInput
                  id="email"
                  name="email"
                  type="email"
                  value={editHospital?.email || ""}
                  onChange={handleEditFieldChange}
                  required
                  color={editErrors.email ? "failure" : "gray"}
                />
                {editErrors.email && <p className="text-red-600 text-sm mt-1">{editErrors.email}</p>}
              </div>
              <div>
                <Label htmlFor="password" value="Password (Leave blank to keep unchanged)" />
                <TextInput
                  id="password"
                  name="password"
                  type="password"
                  value={editHospital?.password || ""}
                  onChange={handleEditFieldChange}
                  color={editErrors.password ? "failure" : "gray"}
                />
                {editErrors.password && <p className="text-red-600 text-sm mt-1">{editErrors.password}</p>}
              </div>
              <div>
                <Label htmlFor="phoneNumber" value="Phone Number" />
                <TextInput
                  id="phoneNumber"
                  name="phoneNumber"
                  value={editHospital?.phoneNumber || ""}
                  onChange={handleEditFieldChange}
                  required
                  color={editErrors.phoneNumber ? "failure" : "gray"}
                />
                {editErrors.phoneNumber && <p className="text-red-600 text-sm mt-1">{editErrors.phoneNumber}</p>}
              </div>
              <div>
                <Label htmlFor="address" value="Address" />
                <TextInput
                  id="address"
                  name="address"
                  value={editHospital?.address || ""}
                  onChange={handleEditFieldChange}
                  required
                  color={editErrors.address ? "failure" : "gray"}
                />
                {editErrors.address && <p className="text-red-600 text-sm mt-1">{editErrors.address}</p>}
              </div>
              <div>
                <Label htmlFor="startTime" value="Start Time" />
                <TextInput
                  id="startTime"
                  name="startTime"
                  type="time"
                  value={editHospital?.startTime || ""}
                  onChange={handleEditFieldChange}
                  required
                  color={editErrors.startTime ? "failure" : "gray"}
                />
                {editErrors.startTime && <p className="text-red-600 text-sm mt-1">{editErrors.startTime}</p>}
              </div>
              <div>
                <Label htmlFor="endTime" value="End Time" />
                <TextInput
                  id="endTime"
                  name="endTime"
                  type="time"
                  value={editHospital?.endTime || ""}
                  onChange={handleEditFieldChange}
                  required
                  color={editErrors.endTime ? "failure" : "gray"}
                />
                {editErrors.endTime && <p className="text-red-600 text-sm mt-1">{editErrors.endTime}</p>}
              </div>
              <div className="flex justify-end space-x-2">
                <Button color="gray" onClick={() => setIsEditing(false)} disabled={actionLoading}>
                  Cancel
                </Button>
                <Button type="submit" gradientDuoTone="redToPink" disabled={actionLoading}>
                  {actionLoading ? <Spinner size="sm" className="mr-2" /> : null}
                  {actionLoading ? "Updating..." : "Update Hospital"}
                </Button>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
}