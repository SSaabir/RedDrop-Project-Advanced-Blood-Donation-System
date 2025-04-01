import React, { useState, useEffect } from "react";
import { Table, TextInput, Select, Spinner, Button } from "flowbite-react";
import { DashboardSidebar } from "../components/DashboardSidebar";
import { useFeedback } from "../hooks/usefeedback.js";

export default function FeedbackDashboard() {
    const { feedbacks, loading, error, fetchFeedbacks } = useFeedback();
    const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('');
 
    // Fetch feedbacks on component mount
    useEffect(() => {
        fetchFeedbacks();
    }, []);

    // Handle search input
    const handleSearch = (value) => {
        setSearchTerm(value);
        const filtered = feedbacks.filter(feedback =>
            feedback.subject.toLowerCase().includes(value.toLowerCase()) ||
            feedback.comments.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredFeedbacks(filtered);
    };

    // Handle feedback type filter
    const handleFilterChange = (value) => {
        setFilterType(value);
        if (value) {
            setFilteredFeedbacks(feedbacks.filter(feedback => feedback.feedbackType === value));
        } else {
            setFilteredFeedbacks(feedbacks);
        }
    };
    
    // Handle delete feedback
    const handleDelete = async (feedbackId) => {
        if (window.confirm('Are you sure you want to delete this feedback?')) {
            try {
                const response = await fetch(`/api/feedback/${feedbackId}`, {
                    method: 'DELETE',
                });
                
                if (response.ok) {
                    fetchFeedbacks(); // Refresh the feedback list
                } else {
                    console.error('Failed to delete feedback');
                }
            } catch (error) {
                console.error('Error deleting feedback:', error);
            }
        }
    };

    return (
        <div className="flex min-h-screen">
            <DashboardSidebar />
            <div className="flex-1 p-6">
                <h2 className="text-2xl font-bold mb-4">Feedback Dashboard</h2>

                {/* Search & Filter Controls */}
                <div className="flex gap-4 mb-4">
                    <TextInput
                        placeholder="Search feedback..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    <Select value={filterType} onChange={(e) => handleFilterChange(e.target.value)}>
                        <option value="">All Types</option>
                        <option value="General Feedback">General Feedback</option>
                        <option value="Technical Feedback">Technical Feedback</option>
                        <option value="Complaint Feedback">Complaint Feedback</option>
                    </Select>
                </div>

                {/* Display loading, error, or feedback table */}
                {loading ? (
                    <Spinner size="lg" />
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    <Table hoverable>
                        <Table.Head>
                            <Table.HeadCell>Subject</Table.HeadCell>
                            <Table.HeadCell>Comments</Table.HeadCell>
                            <Table.HeadCell>Type</Table.HeadCell>
                            <Table.HeadCell>Rating</Table.HeadCell>
                            <Table.HeadCell>Actions</Table.HeadCell>
                        </Table.Head>
                        <Table.Body>
                            {filteredFeedbacks.length > 0 ? (
                                filteredFeedbacks.map((feedback) => (
                                    <Table.Row key={feedback._id}>
                                        <Table.Cell>{feedback.subject}</Table.Cell>
                                        <Table.Cell>{feedback.comments}</Table.Cell>
                                        <Table.Cell>{feedback.feedbackType}</Table.Cell>
                                        <Table.Cell>{feedback.starRating ? `${feedback.starRating} ⭐` : 'N/A'}</Table.Cell>
                                        <Table.Cell>
                                            <Button size="xs" color="failure" onClick={() => handleDelete(feedback._id)}>
                                                Delete
                                            </Button>
                                        </Table.Cell>
                                    </Table.Row>
                                ))
                            ) : (
                                <Table.Row>
                                    <Table.Cell colSpan="5" className="text-center">
                                        No feedback found.
                                    </Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                )}
            </div>
        </div>
    );
}