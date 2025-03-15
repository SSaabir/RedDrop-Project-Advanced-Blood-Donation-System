import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, TextInput, Label, Spinner } from 'flowbite-react';
import { DashboardSidebar } from '../components/DashboardSidebar';

const FeedbackD = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('General'); // Default category
  const [feedbackData, setFeedbackData] = useState({
    email: '',
    subject: '',
    message: '',
    category: 'General',
  });

  // Fetch feedbacks (dummy data)
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setFeedbacks([
        { id: 1, email: 'john@example.com', subject: 'Great Service', message: 'Loved the experience!', category: 'General' },
        { id: 2, email: 'jane@example.com', subject: 'Issue with Booking', message: 'Had some trouble booking.', category: 'Technical' },
        { id: 3, email: 'alice@example.com', subject: 'Website Bug', message: 'Error on donation page.', category: 'Technical' },
        { id: 4, email: 'bob@example.com', subject: 'Unhelpful Staff', message: 'Staff was rude.', category: 'Complaint' },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleCreate = () => {
    setFeedbacks([...feedbacks, { id: feedbacks.length + 1, ...feedbackData }]);
    setOpenCreateModal(false);
    setFeedbackData({ email: '', subject: '', message: '', category: 'General' });
  };

  const handleDelete = (feedback) => {
    setSelectedFeedback(feedback);
    setOpenDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    setFeedbacks(feedbacks.filter((fb) => fb.id !== selectedFeedback.id));
    setOpenDeleteModal(false);
  };

  if (loading) return <Spinner />;

  return (
    <div className='flex min-h-screen'>
      <DashboardSidebar />

      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Feedback Dashboard</h1>
          <Button onClick={() => setOpenCreateModal(true)}>Add New Feedback</Button>
        </div>

        {/* Category Tabs */}
        <div className="flex space-x-4 mb-6">
          {['General', 'Technical', 'Complaint'].map((category) => (
            <Button
              key={category}
              color={selectedCategory === category ? 'blue' : 'gray'}
              onClick={() => setSelectedCategory(category)}
            >
              {category} Feedback
            </Button>
          ))}
        </div>

        {/* Filtered Feedback Table */}
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>ID</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Subject</Table.HeadCell>
            <Table.HeadCell>Message</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {feedbacks
              .filter((feedback) => feedback.category === selectedCategory)
              .map((feedback) => (
                <Table.Row key={feedback.id}>
                  <Table.Cell>{feedback.id}</Table.Cell>
                  <Table.Cell>{feedback.email}</Table.Cell>
                  <Table.Cell>{feedback.subject}</Table.Cell>
                  <Table.Cell>{feedback.message}</Table.Cell>
                  <Table.Cell>
                    <Button size="xs" color="failure" onClick={() => handleDelete(feedback)}>
                      Delete
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      </div>

      {/* Create Feedback Modal */}
      <Modal show={openCreateModal} onClose={() => setOpenCreateModal(false)}>
        <Modal.Header>Add New Feedback</Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-3">
            <Label htmlFor="email">Email</Label>
            <TextInput id="email" value={feedbackData.email} onChange={(e) => setFeedbackData({ ...feedbackData, email: e.target.value })} />
            <Label htmlFor="subject">Subject</Label>
            <TextInput id="subject" value={feedbackData.subject} onChange={(e) => setFeedbackData({ ...feedbackData, subject: e.target.value })} />
            <Label htmlFor="message">Message</Label>
            <TextInput id="message" value={feedbackData.message} onChange={(e) => setFeedbackData({ ...feedbackData, message: e.target.value })} />
            <Label htmlFor="category">Category</Label>
            <select id="category" className="p-2 border rounded" value={feedbackData.category} onChange={(e) => setFeedbackData({ ...feedbackData, category: e.target.value })}>
              <option value="General">General</option>
              <option value="Technical">Technical</option>
              <option value="Complaint">Complaint</option>
            </select>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleCreate}>Create</Button>
          <Button color="gray" onClick={() => setOpenCreateModal(false)}>Cancel</Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Feedback Modal */}
      <Modal show={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <Modal.Header>Confirm Delete</Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this feedback?
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleConfirmDelete}>Delete</Button>
          <Button color="gray" onClick={() => setOpenDeleteModal(false)}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FeedbackD;
