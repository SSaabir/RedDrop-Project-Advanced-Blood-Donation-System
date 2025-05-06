import React, { useState, useEffect } from "react";
import { Button, Table, Modal, TextInput, Label, Select, Spinner } from "flowbite-react";
import { DashboardSidebar } from "../components/DashboardSidebar";
import { useBloodInventory } from "../hooks/useBloodInventory";
import { useHospital } from "../hooks/hospital";
import { useAuthContext } from "../hooks/useAuthContext";
import { useGenerateReport } from "../hooks/useGenerateReport";

export default function BloodInventoryD() {
  const {
    bloodInventory,
    createBloodInventory,
    updateBloodInventory,
    deleteBloodInventory,
    fetchBloodInventoryByHospital,
    fetchBloodInventory,
    toggleExpired,
  } = useBloodInventory();
  const { fetchHospitals } = useHospital();
  const { user } = useAuthContext();
  const { reportUrl, generateInventoryReport } = useGenerateReport();

  // User and role setup
  const userId = user?.userObj?._id;
  const Hospital = user?.role === "Hospital";
  const Manager = user?.role === "Manager";

  // State for add modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({ hospitalId: "", bloodType: "", availableStocks: "", expirationDate: "" });
  const [addErrors, setAddErrors] = useState({});

  // State for edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({ hospitalId: "", bloodType: "", availableStocks: "", expirationDate: "" });
  const [editErrors, setEditErrors] = useState({});

  // State for blood type filter
  const [selectedBloodType, setSelectedBloodType] = useState("all");

  // State for alert modal
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [missingBloodTypes, setMissingBloodTypes] = useState([]);

  // Loading and error state
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Blood Type Options
  const bloodTypes = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

  // Fetch inventory based on role and check for missing blood types
  useEffect(() => {
    let isInitialFetch = true;

    const fetchInventory = async () => {
      setLoading(true);
      try {
        if (Hospital) {
          await fetchBloodInventoryByHospital(userId);
        } else if (Manager) {
          await fetchBloodInventory();
        }
      } catch (error) {
        setErrorMessage("Failed to fetch inventory. Please try again.");
        console.error("Error fetching inventory:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();

    return () => {
      isInitialFetch = false; // Cleanup to prevent memory leaks
    };
  }, [userId, Hospital, Manager, fetchBloodInventoryByHospital, fetchBloodInventory]);

  // Check for missing blood types only after initial fetch
  useEffect(() => {
    if (!loading && bloodInventory.length > 0) {
      const presentBloodTypes = new Set(bloodInventory.map((item) => item.bloodType));
      const missingTypes = bloodTypes.filter((type) => !presentBloodTypes.has(type));
      setMissingBloodTypes(missingTypes);
      setIsAlertModalOpen(missingTypes.length > 0); // Open modal if there are missing types
    } else {
      setMissingBloodTypes([]);
      setIsAlertModalOpen(false); // No modal when inventory is empty or loading
    }
  }, [bloodInventory, loading]);

  // Validation functions
  const validateAddForm = () => {
    const errors = {};
    if (!formData.bloodType) errors.bloodType = "Blood type is required";
    else if (!bloodTypes.includes(formData.bloodType)) errors.bloodType = "Invalid blood type";
    if (!formData.availableStocks) errors.availableStocks = "Stock is required";
    else if (isNaN(formData.availableStocks) || Number(formData.availableStocks) < 0) errors.availableStocks = "Stock must be a positive number";
       setAddErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateEditForm = () => {
    const errors = {};
    if (!editFormData.bloodType) errors.bloodType = "Blood type is required";
    else if (!bloodTypes.includes(editFormData.bloodType)) errors.bloodType = "Invalid blood type";
    if (!editFormData.availableStocks) errors.availableStocks = "Stock is required";
    else if (isNaN(editFormData.availableStocks) || Number(editFormData.availableStocks) < 0) errors.availableStocks = "Stock must be a positive number";
    if (!editFormData.expirationDate) errors.expirationDate = "Expiration date is required";
    else if (new Date(editFormData.expirationDate) < new Date().setHours(0, 0, 0, 0)) errors.expirationDate = "Expiration date cannot be in the past";
    setEditErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Open Modal for Add
  const openAddModal = () => {
    setFormData({ hospitalId: "", bloodType: "", availableStocks: "", expirationDate: "" });
    setAddErrors({});
    setIsAddModalOpen(true);
  };

  // Open Modal for Edit
  const openEditModal = (inventory) => {
    setEditFormData({ ...inventory, expirationDate: inventory.expirationDate.split("T")[0] });
    setEditErrors({});
    setIsAlertModalOpen(false); // Close alert modal when opening edit modal
    setIsEditModalOpen(true);
  };

  // Close Modals
  const closeAddModal = () => setIsAddModalOpen(false);
  const closeEditModal = () => setIsEditModalOpen(false);
  const closeAlertModal = () => setIsAlertModalOpen(false);

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
    if (!validateAddForm()) return;
    const newFormData = { ...formData, hospitalId: userId };
    setLoading(true);
    setErrorMessage("");
    try {
      await createBloodInventory(newFormData);
      closeAddModal();
    } catch (error) {
      setErrorMessage("Failed to add inventory. Please try again.");
      console.error("Error adding inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Edit
  const handleEdit = async () => {
    if (!validateEditForm()) return;
    setLoading(true);
    setErrorMessage("");
    try {
      await updateBloodInventory(editFormData._id, editFormData);
      closeEditModal();
    } catch (error) {
      setErrorMessage("Failed to update inventory. Please try again.");
      console.error("Error updating inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    setLoading(true);
    setErrorMessage("");
    try {
      await deleteBloodInventory(id);
    } catch (error) {
      setErrorMessage("Failed to delete inventory. Please try again.");
      console.error("Error deleting inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Blood Type Filter Change
  const handleBloodTypeFilterChange = (e) => {
    setSelectedBloodType(e.target.value);
  };

  const handleGenerateReport = (e) => {
    e.preventDefault();
    generateInventoryReport(user.userObj._id);
  };

  // Filter blood inventory based on selected blood type
  const filteredBloodInventory = selectedBloodType === "all"
    ? bloodInventory
    : bloodInventory.filter((inventory) => inventory.bloodType === selectedBloodType);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <DashboardSidebar />
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-red-700">Blood Inventory</h1>
          <div className="flex items-center space-x-2">
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
            <Button gradientDuoTone="redToPink" onClick={openAddModal}>
              Add New Inventory
            </Button>
          </div>
        </div>

        {/* Blood Type Filter */}
        <div className="mb-4">
          <Label value="Filter by Blood Type" />
          <Select
            value={selectedBloodType}
            onChange={handleBloodTypeFilterChange}
            className="w-48"
          >
            <option value="all">All Blood Types</option>
            {bloodTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Select>
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
            {filteredBloodInventory.length > 0 ? (
              filteredBloodInventory.map((inventory) => (
                <Table.Row key={inventory._id} className="bg-white">
                  <Table.Cell>{inventory.hospitalId || "N/A"}</Table.Cell>
                  <Table.Cell>{inventory.bloodType}</Table.Cell>
                  <Table.Cell>{inventory.availableStocks}</Table.Cell>
                  <Table.Cell>{new Date(inventory.expirationDate).toLocaleDateString("en-GB")}</Table.Cell>
                  <Table.Cell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        inventory.expiredStatus ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                      }`}
                    >
                      {inventory.expiredStatus ? "Expired" : "Not Expired"}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex space-x-2">
                      <Button 
                        size="xs" 
                        color="blue" 
                        onClick={() => openEditModal(inventory)}
                        className="w-16"
                      >
                        Edit
                      </Button>
                      <Button 
                        size="xs" 
                        color="failure" 
                        onClick={() => handleDelete(inventory._id)}
                        className="w-16"
                      >
                        Delete
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan="6" className="text-center py-4 text-gray-500">
                  No blood inventory records found for the selected blood type.
                </Table.Cell>
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
            <div>
              <Label value="Blood Type" />
              <Select
                name="bloodType"
                value={formData.bloodType}
                onChange={handleChange}
                required
                color={addErrors.bloodType ? "failure" : "gray"}
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
              {addErrors.bloodType && (
                <p className="text-red-600 text-sm mt-1">{addErrors.bloodType}</p>
              )}
            </div>
            <div>
              <Label value="Stock" />
              <TextInput
                type="number"
                name="availableStocks"
                value={formData.availableStocks}
                onChange={handleChange}
                required
                color={addErrors.availableStocks ? "failure" : "gray"}
              />
              {addErrors.availableStocks && (
                <p className="text-red-600 text-sm mt-1">{addErrors.availableStocks}</p>
              )}
            </div>
            
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            gradientDuoTone="redToPink"
            onClick={handleCreate}
            disabled={loading}
          >
            {loading ? <Spinner size="sm" className="mr-2" /> : null}
            {loading ? "Adding..." : "Add"}
          </Button>
          <Button color="gray" onClick={closeAddModal} disabled={loading}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for Edit */}
      <Modal show={isEditModalOpen} onClose={closeEditModal}>
        <Modal.Header>Edit Inventory</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <div>
              <Label value="Stock" />
              <TextInput
                type="number"
                name="availableStocks"
                value={editFormData.availableStocks}
                onChange={handleEditChange}
                required
                color={editErrors.availableStocks ? "failure" : "gray"}
              />
              {editErrors.availableStocks && (
                <p className="text-red-600 text-sm mt-1">{editErrors.availableStocks}</p>
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            gradientDuoTone="redToPink"
            onClick={handleEdit}
            disabled={loading}
          >
            {loading ? <Spinner size="sm" className="mr-2" /> : null}
            {loading ? "Updating..." : "Update"}
          </Button>
          <Button color="gray" onClick={closeEditModal} disabled={loading}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for Missing Blood Types Alert */}
      <Modal show={isAlertModalOpen} onClose={closeAlertModal} size="md">
        <Modal.Header>Missing Blood Types</Modal.Header>
        <Modal.Body>
          <p className="text-gray-700">
            The following blood types are not present in the inventory:
          </p>
          <ul className="list-disc pl-5 mt-2 text-gray-700">
            {missingBloodTypes.map((type) => (
              <li key={type}>{type}</li>
            ))}
          </ul>
          <p className="mt-4 text-gray-700">
            Please consider adding these blood types to ensure complete inventory coverage.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button gradientDuoTone="redToPink" onClick={openAddModal}>
            Add Inventory
          </Button>
          <Button color="gray" onClick={closeAlertModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Error Message */}
      {errorMessage && (
        <div className="text-red-600 text-center mt-4">{errorMessage}</div>
      )}
    </div>
  );
}