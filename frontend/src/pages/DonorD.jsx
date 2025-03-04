import React, { useEffect, useState } from "react";
import { Button, Table, Modal, Label, TextInput } from "flowbite-react";
import { DashboardSidebar } from "../components/DashboardSidebar";
import { useDonor } from "../hooks/donor"; // Import donor hook

export default function DonorD() {
  const { donors, fetchDonors, createDonor, updateDonor, deleteDonor } = useDonor();

  const [openModal, setOpenModal] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    fetchDonors(); // Fetch donors when the component mounts
  }, []);

  // Handle Open Modal for Add/Edit Donor
  const handleOpenModal = (donor = null) => {
    if (donor) {
      setSelectedDonor(donor);
      setName(donor.name);
      setEmail(donor.email);
      setRole(donor.role);
    } else {
      setSelectedDonor(null);
      setName("");
      setEmail("");
      setRole("");
    }
    setOpenModal(true);
  };

  // Handle Save Donor (Add or Update)
  const handleSaveDonor = async () => {
    if (selectedDonor) {
      await updateDonor(selectedDonor._id, { name, email, role });
    } else {
      await createDonor({ name, email, role });
    }
    setOpenModal(false);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <DashboardSidebar />

      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Donors</h1>
          <Button onClick={() => handleOpenModal()}>Add New Donor</Button>
        </div>

        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>ID</Table.HeadCell>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Role</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {donors.length > 0 ? (
              donors.map((donor) => (
                <Table.Row key={donor._id}>
                  <Table.Cell>{donor._id}</Table.Cell>
                  <Table.Cell>{donor.name}</Table.Cell>
                  <Table.Cell>{donor.email}</Table.Cell>
                  <Table.Cell>{donor.role}</Table.Cell>
                  <Table.Cell className="space-x-2">
                    <Button size="xs" onClick={() => handleOpenModal(donor)}>
                      Edit
                    </Button>
                    <Button size="xs" color="failure" onClick={() => deleteDonor(donor._id)}>
                      Delete
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan="5" className="text-center py-4 text-gray-500">
                  No donors found
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>

      {/* Add/Edit Donor Modal */}
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>{selectedDonor ? "Edit Donor" : "Add New Donor"}</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" value="Name" />
              <TextInput
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="email" value="Email" />
              <TextInput
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="role" value="Role" />
              <TextInput
                id="role"
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSaveDonor}>Save Changes</Button>
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
