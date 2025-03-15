import React, { useState } from "react";
import { Card, Button, TextInput, Label } from "flowbite-react";
import { FaUser, FaTint, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaHeartbeat, FaNotesMedical, FaEnvelope, FaIdCard, FaEdit, FaSave } from "react-icons/fa";
import { useAuthContext } from "../hooks/useAuthContext";

export default function DonorProfile() {

  const {user} = useAuthContext();
  const userId = user?.userObj?._id || null;

  const [UserId, setUserId] = useState(userId);
  const [isEditing, setIsEditing] = useState(false);
  const [donor, setDonor] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1 234 567 890",
    location: "New York, USA",
    bloodType: "O+",
    age: 28,
    dob: "1996-04-15",
    nic: "123456789V",
    lastDonation: "January 15, 2025",
    totalDonations: 5,
    eligibility: "Eligible for next donation on March 15, 2025",
    healthStatus: "Excellent",
    notes: "No recent illnesses or medications."
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDonor({ ...donor, [name]: value });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-red-400 to-red-600 p-6">
      <Card className="w-full max-w-4xl p-10 shadow-2xl rounded-3xl bg-white bg-opacity-90">
        <div className="flex justify-between items-center">
          <h2 className="text-5xl font-bold text-red-700">Donor Profile</h2>
          <Button onClick={() => setIsEditing(!isEditing)} className="bg-red-700 text-white px-4 py-2 rounded-lg flex items-center">
            {isEditing ? <FaSave className="mr-2" /> : <FaEdit className="mr-2" />} {isEditing ? "Save" : "Edit Profile"}
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700 mt-6">
          <div className="flex flex-col items-center space-y-4">
            <FaUser className="text-8xl text-red-700" />
            {isEditing ? (
              <TextInput name="name" value={donor.name} onChange={handleChange} className="text-center" />
            ) : (
              <h3 className="text-3xl font-semibold">{donor.name}</h3>
            )}
            <div className="text-lg">Age: {donor.age}</div>
            <div className="text-lg">Date of Birth: {donor.dob}</div>
          </div>
          <div className="space-y-4 text-lg">
            <div className="flex items-center gap-2">
              <FaTint className="text-red-700" />
              <span className="font-medium">Blood Type: {donor.bloodType}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaEnvelope className="text-red-700" />
              {isEditing ? (
                <TextInput name="email" value={donor.email} onChange={handleChange} />
              ) : (
                <span>{donor.email}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <FaPhone className="text-red-700" />
              {isEditing ? (
                <TextInput name="phone" value={donor.phone} onChange={handleChange} />
              ) : (
                <span>{donor.phone}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-red-700" />
              {isEditing ? (
                <TextInput name="location" value={donor.location} onChange={handleChange} />
              ) : (
                <span>{donor.location}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <FaIdCard className="text-red-700" />
              <span>NIC: {donor.nic}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-red-700" />
              <span>Last Donation: {donor.lastDonation}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaHeartbeat className="text-red-700" />
              <span>Health Status: {donor.healthStatus}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaNotesMedical className="text-red-700" />
              <span>Total Donations: {donor.totalDonations}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-red-700" />
              <span>{donor.eligibility}</span>
            </div>
            <div className="italic text-gray-600">{donor.notes}</div>
          </div>
        </div>
        <div className="mt-8 flex flex-col items-center space-y-4">
          <Button className="w-full bg-red-700 text-white font-bold py-3 rounded-lg hover:bg-red-800">
            Donate Again
          </Button>
        </div>
      </Card>
    </div>
  );
}