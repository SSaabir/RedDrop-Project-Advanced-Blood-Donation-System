import React, { useState } from "react";
import { Card, Button, TextInput, Label, Spinner } from "flowbite-react";
import {
  FaUser, FaTint, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaHeartbeat,
  FaNotesMedical, FaEnvelope, FaIdCard, FaEdit, FaSave, FaBan
} from "react-icons/fa";
import { useAuthContext } from "../hooks/useAuthContext";
import { toast } from 'react-toastify';

export default function Profile() {
  const { user } = useAuthContext();
  const userId = user?.userObj?._id || null;
  const userRole = user?.role || 'donor'; // Default to 'donor' if role is undefined; adjust based on your auth structure

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [donor, setDonor] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1234567890",
    location: "New York, USA",
    bloodType: "O+",
    dob: "1996-04-15",
    nic: "123456789V",
    lastDonation: "January 15, 2025",
    totalDonations: 5,
    eligibility: "Eligible for next donation on March 15, 2025",
    healthStatus: "Excellent",
    notes: "No recent illnesses or medications.",
    systemStatus: "Active",
  });
  const [errors, setErrors] = useState({});

  const validateForm = (role) => {
    const newErrors = {};
    if (['donor', 'hospitalAdmin', 'systemManager'].includes(role)) {
      if (!donor.name) newErrors.name = 'Name is required';
      if (!donor.email) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(donor.email)) newErrors.email = 'Invalid email format';
      if (!donor.phone) newErrors.phone = 'Phone number is required';
      else if (!/^\+?\d{10}$/.test(donor.phone.replace(/\s/g, ''))) newErrors.phone = 'Must be a 10-digit number (optional +)';
      if (!donor.location) newErrors.location = 'Location is required';
    }
    if (['hospitalAdmin', 'systemManager'].includes(role)) {
      if (!donor.healthStatus) newErrors.healthStatus = 'Health status is required';
      if (!donor.notes) newErrors.notes = 'Notes are required';
    }
    if (role === 'systemManager') {
      if (!donor.systemStatus) newErrors.systemStatus = 'System status is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDonor((prev) => ({ ...prev, [name]: value.trim() }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSave = async () => {
    if (!validateForm(userRole)) {
      toast.error('Please fix the errors in the form');
      return;
    }
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock save
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      toast.error('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const renderProfileContent = () => {
    switch (userRole.toLowerCase()) {
      case 'donor':
        return (
          <>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-5xl font-bold text-red-700 drop-shadow-md">My Donor Profile</h2>
              <Button
                onClick={isEditing ? handleSave : () => setIsEditing(true)}
                gradientDuoTone="redToPink"
                size="lg"
                className="flex items-center"
                disabled={loading}
              >
                {loading ? <Spinner size="sm" className="mr-2" /> : isEditing ? <FaSave className="mr-2" /> : <FaEdit className="mr-2" />}
                {loading ? 'Saving...' : isEditing ? 'Save' : 'Edit Profile'}
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-700">
              <div className="flex flex-col items-center space-y-6">
                <FaUser className="text-8xl text-red-700" />
                {isEditing ? (
                  <>
                    <TextInput
                      name="name"
                      value={donor.name}
                      onChange={handleChange}
                      className="text-center w-full"
                      required
                      color={errors.name ? 'failure' : 'gray'}
                      aria-label="Donor name"
                    />
                    {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
                  </>
                ) : (
                  <h3 className="text-3xl font-semibold">{donor.name}</h3>
                )}
              </div>
              <div className="space-y-6 text-lg">
                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-red-700" />
                  {isEditing ? (
                    <>
                      <TextInput
                        name="email"
                        value={donor.email}
                        onChange={handleChange}
                        className="w-full"
                        required
                        color={errors.email ? 'failure' : 'gray'}
                        aria-label="Donor email"
                      />
                      {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
                    </>
                  ) : (
                    <span>{donor.email}</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <FaPhone className="text-red-700" />
                  {isEditing ? (
                    <>
                      <TextInput
                        name="phone"
                        value={donor.phone}
                        onChange={handleChange}
                        className="w-full"
                        required
                        pattern="\d{10}"
                        color={errors.phone ? 'failure' : 'gray'}
                        aria-label="Donor phone number"
                      />
                      {errors.phone && <p className="text-red-600 text-sm">{errors.phone}</p>}
                    </>
                  ) : (
                    <span>{donor.phone}</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-red-700" />
                  {isEditing ? (
                    <>
                      <TextInput
                        name="location"
                        value={donor.location}
                        onChange={handleChange}
                        className="w-full"
                        required
                        color={errors.location ? 'failure' : 'gray'}
                        aria-label="Donor location"
                      />
                      {errors.location && <p className="text-red-600 text-sm">{errors.location}</p>}
                    </>
                  ) : (
                    <span>{donor.location}</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <FaTint className="text-red-700" />
                  <span className="font-medium">Blood Type: {donor.bloodType}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaCalendarAlt className="text-red-700" />
                  <span>Last Donation: {donor.lastDonation}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaNotesMedical className="text-red-700" />
                  <span>Total Donations: {donor.totalDonations}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaCalendarAlt className="text-red-700" />
                  <span>{donor.eligibility}</span>
                </div>
              </div>
            </div>
            <div className="mt-10 flex flex-col items-center space-y-4">
              <Button
                className="w-full bg-red-700 text-white font-bold py-3 rounded-lg hover:bg-red-800 focus:ring-2 focus:ring-red-500 transition-all"
                disabled={loading}
              >
                Donate Again
              </Button>
            </div>
          </>
        );

      case 'hospital':
        return (
          <>
            <h2 className="text-5xl font-bold text-red-700 drop-shadow-md mb-8">Donor Profile (Hospital View)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-700">
              <div className="flex flex-col items-center space-y-6">
                <FaUser className="text-8xl text-red-700" />
                <h3 className="text-3xl font-semibold">{donor.name}</h3>
              </div>
              <div className="space-y-6 text-lg">
                <div className="flex items-center gap-3">
                  <FaTint className="text-red-700" />
                  <span className="font-medium">Blood Type: {donor.bloodType}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaPhone className="text-red-700" />
                  <span>{donor.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-red-700" />
                  <span>{donor.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaCalendarAlt className="text-red-700" />
                  <span>Last Donation: {donor.lastDonation}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaNotesMedical className="text-red-700" />
                  <span>Total Donations: {donor.totalDonations}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaCalendarAlt className="text-red-700" />
                  <span>{donor.eligibility}</span>
                </div>
              </div>
            </div>
            <div className="mt-10 flex flex-col items-center space-y-4">
              <Button
                className="w-full bg-red-700 text-white font-bold py-3 rounded-lg hover:bg-red-800 focus:ring-2 focus:ring-red-500 transition-all"
              >
                Request Blood from Donor
              </Button>
            </div>
          </>
        );

      case 'hospitaladmin':
        return (
          <>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-5xl font-bold text-red-700 drop-shadow-md">Donor Profile (Hospital Admin)</h2>
              <Button
                onClick={isEditing ? handleSave : () => setIsEditing(true)}
                gradientDuoTone="redToPink"
                size="lg"
                className="flex items-center"
                disabled={loading}
              >
                {loading ? <Spinner size="sm" className="mr-2" /> : isEditing ? <FaSave className="mr-2" /> : <FaEdit className="mr-2" />}
                {loading ? 'Saving...' : isEditing ? 'Save' : 'Edit Profile'}
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-700">
              <div className="flex flex-col items-center space-y-6">
                <FaUser className="text-8xl text-red-700" />
                {isEditing ? (
                  <>
                    <TextInput
                      name="name"
                      value={donor.name}
                      onChange={handleChange}
                      className="text-center w-full"
                      required
                      color={errors.name ? 'failure' : 'gray'}
                      aria-label="Donor name"
                    />
                    {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
                  </>
                ) : (
                  <h3 className="text-3xl font-semibold">{donor.name}</h3>
                )}
                <div className="text-lg">Date of Birth: {donor.dob}</div>
                <div className="flex items-center gap-3">
                  <FaIdCard className="text-red-700" />
                  <span>NIC: {donor.nic}</span>
                </div>
              </div>
              <div className="space-y-6 text-lg">
                <div className="flex items-center gap-3">
                  <FaTint className="text-red-700" />
                  <span className="font-medium">Blood Type: {donor.bloodType}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-red-700" />
                  {isEditing ? (
                    <>
                      <TextInput
                        name="email"
                        value={donor.email}
                        onChange={handleChange}
                        className="w-full"
                        required
                        color={errors.email ? 'failure' : 'gray'}
                        aria-label="Donor email"
                      />
                      {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
                    </>
                  ) : (
                    <span>{donor.email}</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <FaPhone className="text-red-700" />
                  {isEditing ? (
                    <>
                      <TextInput
                        name="phone"
                        value={donor.phone}
                        onChange={handleChange}
                        className="w-full"
                        required
                        pattern="\d{10}"
                        color={errors.phone ? 'failure' : 'gray'}
                        aria-label="Donor phone number"
                      />
                      {errors.phone && <p className="text-red-600 text-sm">{errors.phone}</p>}
                    </>
                  ) : (
                    <span>{donor.phone}</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-red-700" />
                  {isEditing ? (
                    <>
                      <TextInput
                        name="location"
                        value={donor.location}
                        onChange={handleChange}
                        className="w-full"
                        required
                        color={errors.location ? 'failure' : 'gray'}
                        aria-label="Donor location"
                      />
                      {errors.location && <p className="text-red-600 text-sm">{errors.location}</p>}
                    </>
                  ) : (
                    <span>{donor.location}</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <FaCalendarAlt className="text-red-700" />
                  <span>Last Donation: {donor.lastDonation}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaNotesMedical className="text-red-700" />
                  <span>Total Donations: {donor.totalDonations}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaCalendarAlt className="text-red-700" />
                  <span>{donor.eligibility}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaHeartbeat className="text-red-700" />
                  {isEditing ? (
                    <>
                      <TextInput
                        name="healthStatus"
                        value={donor.healthStatus}
                        onChange={handleChange}
                        className="w-full"
                        required
                        color={errors.healthStatus ? 'failure' : 'gray'}
                        aria-label="Health status"
                      />
                      {errors.healthStatus && <p className="text-red-600 text-sm">{errors.healthStatus}</p>}
                    </>
                  ) : (
                    <span>Health Status: {donor.healthStatus}</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {isEditing ? (
                    <>
                      <TextInput
                        name="notes"
                        value={donor.notes}
                        onChange={handleChange}
                        className="w-full italic text-gray-600"
                        required
                        color={errors.notes ? 'failure' : 'gray'}
                        aria-label="Donor notes"
                      />
                      {errors.notes && <p className="text-red-600 text-sm">{errors.notes}</p>}
                    </>
                  ) : (
                    <span className="italic text-gray-600">{donor.notes}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-10 flex flex-col items-center space-y-4">
              <Button
                className="w-full bg-red-700 text-white font-bold py-3 rounded-lg hover:bg-red-800 focus:ring-2 focus:ring-red-500 transition-all"
                disabled={loading}
              >
                Approve Donor
              </Button>
            </div>
          </>
        );

      case 'systemmanager':
        return (
          <>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-5xl font-bold text-red-700 drop-shadow-md">Donor Profile (System Manager)</h2>
              <Button
                onClick={isEditing ? handleSave : () => setIsEditing(true)}
                gradientDuoTone="redToPink"
                size="lg"
                className="flex items-center"
                disabled={loading}
              >
                {loading ? <Spinner size="sm" className="mr-2" /> : isEditing ? <FaSave className="mr-2" /> : <FaEdit className="mr-2" />}
                {loading ? 'Saving...' : isEditing ? 'Save' : 'Edit Profile'}
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-700">
              <div className="flex flex-col items-center space-y-6">
                <FaUser className="text-8xl text-red-700" />
                {isEditing ? (
                  <>
                    <TextInput
                      name="name"
                      value={donor.name}
                      onChange={handleChange}
                      className="text-center w-full"
                      required
                      color={errors.name ? 'failure' : 'gray'}
                      aria-label="Donor name"
                    />
                    {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
                  </>
                ) : (
                  <h3 className="text-3xl font-semibold">{donor.name}</h3>
                )}
                <div className="text-lg">Date of Birth: {donor.dob}</div>
                <div className="flex items-center gap-3">
                  <FaIdCard className="text-red-700" />
                  <span>NIC: {donor.nic}</span>
                </div>
              </div>
              <div className="space-y-6 text-lg">
                <div className="flex items-center gap-3">
                  <FaTint className="text-red-700" />
                  <span className="font-medium">Blood Type: {donor.bloodType}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-red-700" />
                  {isEditing ? (
                    <>
                      <TextInput
                        name="email"
                        value={donor.email}
                        onChange={handleChange}
                        className="w-full"
                        required
                        color={errors.email ? 'failure' : 'gray'}
                        aria-label="Donor email"
                      />
                      {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
                    </>
                  ) : (
                    <span>{donor.email}</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <FaPhone className="text-red-700" />
                  {isEditing ? (
                    <>
                      <TextInput
                        name="phone"
                        value={donor.phone}
                        onChange={handleChange}
                        className="w-full"
                        required
                        pattern="\d{10}"
                        color={errors.phone ? 'failure' : 'gray'}
                        aria-label="Donor phone number"
                      />
                      {errors.phone && <p className="text-red-600 text-sm">{errors.phone}</p>}
                    </>
                  ) : (
                    <span>{donor.phone}</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-red-700" />
                  {isEditing ? (
                    <>
                      <TextInput
                        name="location"
                        value={donor.location}
                        onChange={handleChange}
                        className="w-full"
                        required
                        color={errors.location ? 'failure' : 'gray'}
                        aria-label="Donor location"
                      />
                      {errors.location && <p className="text-red-600 text-sm">{errors.location}</p>}
                    </>
                  ) : (
                    <span>{donor.location}</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <FaCalendarAlt className="text-red-700" />
                  <span>Last Donation: {donor.lastDonation}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaNotesMedical className="text-red-700" />
                  <span>Total Donations: {donor.totalDonations}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaCalendarAlt className="text-red-700" />
                  <span>{donor.eligibility}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaHeartbeat className="text-red-700" />
                  {isEditing ? (
                    <>
                      <TextInput
                        name="healthStatus"
                        value={donor.healthStatus}
                        onChange={handleChange}
                        className="w-full"
                        required
                        color={errors.healthStatus ? 'failure' : 'gray'}
                        aria-label="Health status"
                      />
                      {errors.healthStatus && <p className="text-red-600 text-sm">{errors.healthStatus}</p>}
                    </>
                  ) : (
                    <span>Health Status: {donor.healthStatus}</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {isEditing ? (
                    <>
                      <TextInput
                        name="notes"
                        value={donor.notes}
                        onChange={handleChange}
                        className="w-full italic text-gray-600"
                        required
                        color={errors.notes ? 'failure' : 'gray'}
                        aria-label="Donor notes"
                      />
                      {errors.notes && <p className="text-red-600 text-sm">{errors.notes}</p>}
                    </>
                  ) : (
                    <span className="italic text-gray-600">{donor.notes}</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <FaBan className="text-red-700" />
                  {isEditing ? (
                    <>
                      <TextInput
                        name="systemStatus"
                        value={donor.systemStatus}
                        onChange={handleChange}
                        className="w-full"
                        required
                        color={errors.systemStatus ? 'failure' : 'gray'}
                        aria-label="System status"
                      />
                      {errors.systemStatus && <p className="text-red-600 text-sm">{errors.systemStatus}</p>}
                    </>
                  ) : (
                    <span>System Status: {donor.systemStatus}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-10 flex flex-col items-center space-y-4">
              <Button
                className="w-full bg-red-700 text-white font-bold py-3 rounded-lg hover:bg-red-800 focus:ring-2 focus:ring-red-500 transition-all"
                disabled={loading}
              >
                Deactivate Donor Account
              </Button>
            </div>
          </>
        );

      default:
        return <div className="text-center text-red-700">Unauthorized Role</div>;
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-red-400 to-red-600 p-6">
      <Card className="w-full max-w-4xl p-10 shadow-2xl rounded-3xl bg-white bg-opacity-95 border border-red-100">
        {renderProfileContent()}
      </Card>
    </div>
  );
}