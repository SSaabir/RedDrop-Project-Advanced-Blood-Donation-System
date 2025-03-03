import React from 'react';
import { Button, Table } from 'flowbite-react';
import { DashboardSidebar } from '../components/DashboardSidebar'; 

const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Editor' },
  { id: 3, name: 'Alice Johnson', email: 'alice@example.com', role: 'Viewer' },
];

export default function InquiryD() {
  return (
    <div className='flex min-h-screen'>
      {/* Sidebar */}
      <DashboardSidebar />

      
      <div className="flex-1 p-6">
   
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Inquiry</h1>
          <Button>Add New User</Button>
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
            {users.map((user) => (
              <Table.Row key={user.id}>
                <Table.Cell>{user.id}</Table.Cell>
                <Table.Cell>{user.name}</Table.Cell>
                <Table.Cell>{user.email}</Table.Cell>
                <Table.Cell>{user.role}</Table.Cell>
                <Table.Cell>
                  <Button size="xs" className="mr-2">Edit</Button>
                  <Button size="xs" color="failure">Delete</Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}