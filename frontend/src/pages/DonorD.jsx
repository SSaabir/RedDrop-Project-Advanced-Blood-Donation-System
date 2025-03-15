import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, TextInput, Label, Spinner } from 'flowbite-react';
import { DashboardSidebar } from '../components/DashboardSidebar';

const DonorD = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [donorData, setDonorData] = useState({
    name: '',
    email: '',
    role: '',
  });

  // Fetch donors (dummy data for now)
  useEffect(() => {
    setLoading(true);
    // Simulate fetching data (replace this with actual API call)
    setTimeout(() => {
      setDonors([
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Editor' },
        { id: 3, name: 'Alice Johnson', email: 'alice@example.com', role: 'Viewer' },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleCreate = () => {
    // Add new donor (make an API call here)
    setDonors([...donors, { id: donors.length + 1, ...donorData }]);
    setOpenCreateModal(false);
    setDonorData({ name: '', email: '', role: '' });
  };

  const handleEdit = (donor) => {
    setSelectedDonor(donor);
    setDonorData({
      name: donor.name,
      email: donor.email,
      role: donor.role,
    });
    setOpenEditModal(true);
  };

  const handleUpdate = () => {
    setDonors(donors.map(donor => 
      donor.id === selectedDonor.id ? { ...donor, ...donorData } : donor
    ));
    setOpenEditModal(false);
    setDonorData({ name: '', email: '', role: '' });
  };

  const handleDelete = (donor) => {
    setSelectedDonor(donor);
    setOpenDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    setDonors(donors.filter(donor => donor.id !== selectedDonor.id));
    setOpenDeleteModal(false);
  };

  if (loading) return <Spinner />;

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />

      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Donors</h1>
          <Button onClick={() => setOpenCreateModal(true)}>Add New Donor</Button>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>ID</Table.HeadCell>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Role</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {donors.map((donor) => (
              <Table.Row key={donor.id}>
                <Table.Cell>{donor.id}</Table.Cell>
                <Table.Cell>{donor.name}</Table.Cell>
                <Table.Cell>{donor.email}</Table.Cell>
                <Table.Cell>{donor.role}</Table.Cell>
                <Table.Cell>
                  <Button size="xs" className="mr-2" onClick={() => handleEdit(donor)}>Edit</Button>
                  <Button size="xs" color="failure" onClick={() => handleDelete(donor)}>Delete</Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>

      {/* Create Donor Modal */}
      <Modal show={openCreateModal} onClose={() => setOpenCreateModal(false)}>
        <Modal.Header>Add New Donor</Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-3">
            <Label htmlFor="name">Name</Label>
            <TextInput id="name" value={donorData.name} onChange={(e) => setDonorData({ ...donorData, name: e.target.value })} />
            <Label htmlFor="email">Email</Label>
            <TextInput id="email" value={donorData.email} onChange={(e) => setDonorData({ ...donorData, email: e.target.value })} />
            <Label htmlFor="role">Role</Label>
            <TextInput id="role" value={donorData.role} onChange={(e) => setDonorData({ ...donorData, role: e.target.value })} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleCreate}>Create</Button>
          <Button color="gray" onClick={() => setOpenCreateModal(false)}>Cancel</Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Donor Modal */}
      <Modal show={openEditModal} onClose={() => setOpenEditModal(false)}>
        <Modal.Header>Edit Donor</Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-3">
            <Label htmlFor="name">Name</Label>
            <TextInput id="name" value={donorData.name} onChange={(e) => setDonorData({ ...donorData, name: e.target.value })} />
            <Label htmlFor="email">Email</Label>
            <TextInput id="email" value={donorData.email} onChange={(e) => setDonorData({ ...donorData, email: e.target.value })} />
            <Label htmlFor="role">Role</Label>
            <TextInput id="role" value={donorData.role} onChange={(e) => setDonorData({ ...donorData, role: e.target.value })} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleUpdate}>Update</Button>
          <Button color="gray" onClick={() => setOpenEditModal(false)}>Cancel</Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Donor Modal */}
      <Modal show={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <Modal.Header>Confirm Delete</Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this donor?
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleConfirmDelete}>Delete</Button>
          <Button color="gray" onClick={() => setOpenDeleteModal(false)}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DonorD;
