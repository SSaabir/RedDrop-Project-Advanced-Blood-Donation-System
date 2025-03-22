import React, { useState, useEffect } from "react";
import { Table, TextInput, Select, Spinner } from "flowbite-react";
import { DashboardSidebar } from "../components/DashboardSidebar";
import { useInquiry } from "../hooks/useInquiry"; // Assuming you have a hook for handling the API calls

export default function InquiryDashboard() {
    const {
        inquiries,
        loading,
        error,
        fetchInquiries,
        updateInquiryStatus,
        deleteInquiry
    } = useInquiry();

    const [filteredInquiries, setFilteredInquiries] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');

    // Fetch inquiries on component mount
    useEffect(() => {
        fetchInquiries();
    }, []); // Empty dependency array to fetch only once

    // Update filtered inquiries when data, search term or filter category changes
    useEffect(() => {
        const filtered = inquiries.filter((inquiry) => {
            const matchesSearchTerm =
                inquiry.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                inquiry.message.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory =
                !filterCategory || inquiry.category === filterCategory;

            return matchesSearchTerm && matchesCategory;
        });
        setFilteredInquiries(filtered);
    }, [inquiries, searchTerm, filterCategory]); // Runs when inquiries, search term, or filter category changes

    // Handle search input
    const handleSearch = (value) => {
        setSearchTerm(value); // The filtering happens in useEffect
    };

    // Handle category filter
    const handleCategoryFilter = (value) => {
        setFilterCategory(value); // The filtering happens in useEffect
    };

    // Handle status update
    const handleUpdateStatus = (id, status) => {
        updateInquiryStatus(id, status);
    };

    // Handle inquiry deletion
    const handleDeleteInquiry = (id) => {
        deleteInquiry(id);
    };

    return (
        <div className="flex min-h-screen">
            <DashboardSidebar />
            <div className="flex-1 p-6">
                <h2 className="text-2xl font-bold mb-4">Inquiry Dashboard</h2>

                {/* Search & Filter Controls */}
                <div className="flex gap-4 mb-4">
                    <TextInput
                        placeholder="Search inquiries..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    <Select
                        value={filterCategory}
                        onChange={(e) => handleCategoryFilter(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        <option value="General">General</option>
                        <option value="Technical">Technical</option>
                        <option value="Complaint">Complaint</option>
                        <option value="Other">Other</option>
                    </Select>
                </div>

                {/* Display loading, error, or inquiry table */}
                {loading ? (
                    <Spinner size="lg" />
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    <Table hoverable>
                        <Table.Head>
                            <Table.HeadCell>Subject</Table.HeadCell>
                            <Table.HeadCell>Email</Table.HeadCell>
                            <Table.HeadCell>Category</Table.HeadCell>
                            <Table.HeadCell>Status</Table.HeadCell>
                            <Table.HeadCell>Actions</Table.HeadCell>
                        </Table.Head>
                        <Table.Body>
                            {filteredInquiries.length > 0 ? (
                                filteredInquiries.map((inquiry) => (
                                    <Table.Row key={inquiry._id}>
                                        <Table.Cell>{inquiry.subject}</Table.Cell>
                                        <Table.Cell>{inquiry.email}</Table.Cell>
                                        <Table.Cell>{inquiry.category}</Table.Cell>
                                        <Table.Cell>{inquiry.attentiveStatus}</Table.Cell>
                                        <Table.Cell>
                                            <button
                                                onClick={() => handleUpdateStatus(inquiry._id, "In Progress")}
                                                className="text-blue-500 hover:text-blue-700"
                                            >
                                                Update Status
                                            </button>
                                            <button
                                                onClick={() => handleDeleteInquiry(inquiry._id)}
                                                className="text-red-500 hover:text-red-700 ml-2"
                                            >
                                                Delete
                                            </button>
                                        </Table.Cell>
                                    </Table.Row>
                                ))
                            ) : (
                                <Table.Row>
                                    <Table.Cell colSpan="5" className="text-center">
                                        No inquiries found.
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
