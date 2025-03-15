import React, { useState } from 'react';
import { Button, Table, Modal, TextInput, Label, Spinner } from 'flowbite-react';
import { DashboardSidebar } from '../components/DashboardSidebar';

export default function InquiryD() {
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Editor' },
    { id: 3, name: 'Alice Johnson', email: 'alice@example.com', role: 'Viewer' },
  ]);

  const [loading, setLoading] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userData, setUserData] = useState({ name: '', email: '', role: 'Viewer' });

  // Open Create Modal
  const handleCreateUser = () => {
    setUsers([...users, { id: users.length + 1, ...userData }]);
    setOpenCreateModal(false);
    setUserData({ name: '', email: '', role: 'Viewer' });
  };

  // Open Edit Modal
  const handleEdit = (user) => {
    setSelectedUser(user);
    setUserData({ name: user.name, email: user.email, role: user.role });
    setOpenEditModal(true);
  };

  // Update User
  const handleUpdateUser = () => {
    setUsers(users.map(user => (user.id === selectedUser.id ? { ...user, ...userData } : user)));
    setOpenEditModal(false);
    setUserData({ name: '', email: '', role: 'Viewer' });
  };

  // Open Delete Modal
  const handleDelete = (user) => {
    setSelectedUser(user);
    setOpenDeleteModal(true);
  };

  // Confirm Delete User
  const handleConfirmDelete = () => {
    setUsers(users.filter(user => user.id !== selectedUser.id));
    setOpenDeleteModal(false);
  };

  return (
    <div className='flex min-h-screen'>
      <DashboardSidebar />

      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Inquiries</h1>
          <Button onClick={() => setOpenCreateModal(true)}>Add New User</Button>
        </div>

        {loading ? (
          <Spinner />
        ) : (
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>ID</Table.HeadCell>
              <Table.HeadCell>Name</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Role</Table.HeadCell>
              <Table.HeadCell>Actions</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {users.map((user) => (
                <Table.Row key={user.id}>
                  <Table.Cell>{user.id}</Table.Cell>
                  <Table.Cell>{user.name}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>{user.role}</Table.Cell>
                  <Table.Cell>
                    <Button size="xs" className="mr-2" onClick={() => handleEdit(user)}>Edit</Button>
                    <Button size="xs" color="failure" onClick={() => handleDelete(user)}>Delete</Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </div>

      {/* Create User Modal */}
      <Modal show={openCreateModal} onClose={() => setOpenCreateModal(false)}>
        <Modal.Header>Add New User</Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-3">
            <Label htmlFor="name">Name</Label>
            <TextInput id="name" value={userData.name} onChange={(e) => setUserData({ ...userData, name: e.target.value })} />
            <Label htmlFor="email">Email</Label>
            <TextInput id="email" value={userData.email} onChange={(e) => setUserData({ ...userData, email: e.target.value })} />
            <Label htmlFor="role">Role</Label>
            <select id="role" className="p-2 border rounded" value={userData.role} onChange={(e) => setUserData({ ...userData, role: e.target.value })}>
              <option value="Admin">Admin</option>
              <option value="Editor">Editor</option>
              <option value="Viewer">Viewer</option>
            </select>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleCreateUser}>Create</Button>
          <Button color="gray" onClick={() => setOpenCreateModal(false)}>Cancel</Button>
        </Modal.Footer>
      </Modal>

      {/* Edit User Modal */}
      <Modal show={openEditModal} onClose={() => setOpenEditModal(false)}>
        <Modal.Header>Edit User</Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-3">
            <Label htmlFor="name">Name</Label>
            <TextInput id="name" value={userData.name} onChange={(e) => setUserData({ ...userData, name: e.target.value })} />
            <Label htmlFor="email">Email</Label>
            <TextInput id="email" value={userData.email} onChange={(e) => setUserData({ ...userData, email: e.target.value })} />
            <Label htmlFor="role">Role</Label>
            <select id="role" className="p-2 border rounded" value={userData.role} onChange={(e) => setUserData({ ...userData, role: e.target.value })}>
              <option value="Admin">Admin</option>
              <option value="Editor">Editor</option>
              <option value="Viewer">Viewer</option>
            </select>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleUpdateUser}>Update</Button>
          <Button color="gray" onClick={() => setOpenEditModal(false)}>Cancel</Button>
        </Modal.Footer>
      </Modal>

      {/* Delete User Modal */}
      <Modal show={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <Modal.Header>Confirm Delete</Modal.Header>
        <Modal.Body>
          Are you sure you want to delete {selectedUser?.name}?
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleConfirmDelete}>Delete</Button>
          <Button color="gray" onClick={() => setOpenDeleteModal(false)}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
