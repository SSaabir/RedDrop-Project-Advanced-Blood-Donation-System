import React, { useState, useEffect } from "react";
import { Card, Button, TextInput, Label, Spinner, Select } from "flowbite-react";
import {
  FaUser, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaEnvelope, FaIdCard, FaEdit, FaSave, FaTrash
} from "react-icons/fa";
import { useAuthContext } from "../hooks/useAuthContext";
import { useHospital } from "../hooks/hospital";
import { useDonor } from "../hooks/donor";
import { useHospitalAdmin } from "../hooks/useHospitalAdmin";
import { useSystemManager } from "../hooks/useSystemManager";
import { useLogout } from "../hooks/useLogout";
import { toast } from 'react-toastify';
import moment from 'moment';
import validator from 'validator';

export default function Profile() {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const { hospitals, fetchHospitals, loading: hLoading } = useHospital();
  const { updateDonor } = useDonor();
  const { updateHospital } = useHospital();
  const { updateHospitalAdmin } = useHospitalAdmin();
  const { updateManager } = useSystemManager();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const userId = user?.userObj?._id || null;
  const userRole = user?.role || 'null';

  const [profileData, setProfileData] = useState(() => {
    if (userRole === 'Donor') {
      return {
        firstName: user?.userObj?.firstName || "John",
        lastName: user?.userObj?.lastName || "Doe",
        email: user?.userObj?.email || "johndoe@example.com",
        phoneNumber: user?.userObj?.phoneNumber || "1234567890",
        city: user?.userObj?.city || "New York",
        dob: user?.userObj?.dob ? moment(user?.userObj?.dob).format("YYYY-MM-DD") : "1996-04-15",
        bloodType: user?.userObj?.bloodType || "O+",
        nic: user?.userObj?.nic || "123456789V",
        healthStatus: user?.userObj?.healthStatus || false,
        activeStatus: user?.userObj?.activeStatus !== undefined ? user?.userObj?.activeStatus : true,
        appointmentStatus: user?.userObj?.appointmentStatus || false,
      };
    } else if (userRole === 'Hospital') {
      return {
        name: user?.userObj?.name || "City Hospital",
        email: user?.userObj?.email || "hospital@example.com",
        phoneNumber: user?.userObj?.phoneNumber || "1234567890",
        city: user?.userObj?.city || "New York",
        address: user?.userObj?.address || "123 Main St",
        startTime: user?.userObj?.startTime || "08:00",
        endTime: user?.userObj?.endTime || "17:00",
        systemManagerId: user?.userObj?.systemManagerId || "",
        identificationNumber: user?.userObj?.identificationNumber || "HOSP123",
        activeStatus: user?.userObj?.activeStatus !== undefined ? user?.userObj?.activeStatus : true,
      };
    } else if (userRole === 'HospitalAdmin') {
      return {
        firstName: user?.userObj?.firstName || "Jane",
        lastName: user?.userObj?.lastName || "Smith",
        email: user?.userObj?.email || "admin@example.com",
        phoneNumber: user?.userObj?.phoneNumber || "1234567890",
        address: user?.userObj?.address || "456 Elm St",
        dob: user?.userObj?.dob ? moment(user?.userObj?.dob).format("YYYY-MM-DD") : "1985-06-20",
        nic: user?.userObj?.nic || "987654321V",
        hospitalId: user?.userObj?.hospitalId || "",
        activeStatus: user?.userObj?.activeStatus !== undefined ? user?.userObj?.activeStatus : true,
      };
    } else if (userRole === 'Manager') {
      return {
        firstName: user?.userObj?.firstName || "Alice",
        lastName: user?.userObj?.lastName || "Johnson",
        email: user?.userObj?.email || "manager@example.com",
        phoneNumber: user?.userObj?.phoneNumber || "1234567890",
        address: user?.userObj?.address || "789 Oak St",
        dob: user?.userObj?.dob ? moment(user?.userObj?.dob).format("YYYY-MM-DD") : "1980-01-01",
        nic: user?.userObj?.nic || "456789123V",
        role: user?.userObj?.role || "Master",
        activeStatus: user?.userObj?.activeStatus !== undefined ? user?.userObj?.activeStatus : true,
      };
    }
    return {};
  });

  useEffect(() => {
    if (userRole === 'HospitalAdmin') {
      fetchHospitals();
    }
  }, [userRole, fetchHospitals]);

  const validateForm = () => {
    const newErrors = {};
    if (['Donor', 'Hospital', 'HospitalAdmin', 'Manager'].includes(userRole)) {
      if (!profileData.email) newErrors.email = 'Email is required';
      else if (!validator.isEmail(profileData.email)) newErrors.email = 'Invalid email format';
      if (!profileData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
      else if (!/^\d{10}$/.test(profileData.phoneNumber)) newErrors.phoneNumber = 'Must be a 10-digit number';
    }
    if (userRole === 'Donor') {
      if (!profileData.firstName) newErrors.firstName = 'First name is required';
      if (!profileData.lastName) newErrors.lastName = 'Last name is required';
      if (!profileData.city) newErrors.city = 'City is required';
      if (!profileData.dob) newErrors.dob = 'Date of birth is required';
      else if (moment().diff(moment(profileData.dob), 'years') < 18) newErrors.dob = 'Must be at least 18 years old';
      if (!profileData.bloodType) newErrors.bloodType = 'Blood type is required';
      if (!profileData.nic) newErrors.nic = 'NIC is required';
    } else if (userRole === 'Hospital') {
      if (!profileData.name) newErrors.name = 'Name is required';
      if (!profileData.city) newErrors.city = 'City is required';
      if (!profileData.address) newErrors.address = 'Address is required';
      if (!profileData.startTime || !moment(profileData.startTime, 'HH:mm', true).isValid()) newErrors.startTime = 'Valid start time (HH:mm) is required';
      if (!profileData.endTime || !moment(profileData.endTime, 'HH:mm', true).isValid()) newErrors.endTime = 'Valid end time (HH:mm) is required';
    } else if (userRole === 'HospitalAdmin') {
      if (!profileData.firstName) newErrors.firstName = 'First name is required';
      if (!profileData.lastName) newErrors.lastName = 'Last name is required';
      if (!profileData.dob) newErrors.dob = 'Date of birth is required';
      else if (moment().diff(moment(profileData.dob), 'years') < 18) newErrors.dob = 'Must be at least 18 years old';
      if (!profileData.nic) newErrors.nic = 'NIC is required';
      if (!profileData.hospitalId) newErrors.hospitalId = 'Hospital is required';
    } else if (userRole === 'Manager') {
      if (!profileData.firstName) newErrors.firstName = 'First name is required';
      if (!profileData.lastName) newErrors.lastName = 'Last name is required';
      if (!profileData.address) newErrors.address = 'Address is required';
      if (!profileData.dob) newErrors.dob = 'Date of birth is required';
      else if (moment().diff(moment(profileData.dob), 'years') < 18) newErrors.dob = 'Must be at least 18 years old';
      if (!profileData.nic) newErrors.nic = 'NIC is required';
      if (!profileData.role) newErrors.role = 'Role is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    setLoading(true);
    try {
      if (userRole === 'Donor') {
        await updateDonor(userId, profileData);
      } else if (userRole === 'Hospital') {
        await updateHospital(userId, profileData);
      } else if (userRole === 'HospitalAdmin') {
        await updateHospitalAdmin(userId, profileData);
      } else if (userRole === 'systemManager') {
        await updateManager(userId, profileData);
      }
      setIsEditing(false);
    } catch (err) {
      toast.error('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async () => {
    if (!window.confirm('Are you sure you want to deactivate your account? You will be logged out.')) {
      return;
    }
    setLoading(true);
    try {
      if (userRole === 'Donor') {
        await useDonor().activateDeactivateDonor(userId);
      } else if (userRole === 'Hospital') {
        await useHospital().activateDeactivateHospital(userId);
      } else if (userRole === 'HospitalAdmin') {
        await useHospitalAdmin().activateDeactivateHospitalAdmin(userId);
      } else if (userRole === 'Manager') {
        await useSystemManager().activateDeactivateManager(userId);
      }
      logout();
    } catch (err) {
      toast.error('Error deactivating account');
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
              <div className="flex gap-4">
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
                <Button
                  onClick={handleDeactivate}
                  color="failure"
                  size="lg"
                  className="flex items-center"
                  disabled={loading}
                >
                  <FaTrash className="mr-2" />
                  Deactivate Account
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-700">
              <div className="flex flex-col items-center space-y-6">
                <FaUser className="text-8xl text-red-700" />
                {isEditing ? (
                  <>
                    <TextInput
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleChange}
                      className="text-center w-full"
                      required
                      color={errors.firstName ? 'failure' : 'gray'}
                      aria-label="First name"
                    />
                    {errors.firstName && <p className="text-red-600 text-sm">{errors.firstName}</p>}
                    <TextInput
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleChange}
                      className="text-center w-full"
                      required
                      color={errors.lastName ? 'failure' : 'gray'}
                      aria-label="Last name"
                    />
                    {errors.lastName && <p className="text-red-600 text-sm">{errors.lastName}</p>}
                  </>
                ) : (
                  <h3 className="text-3xl font-semibold">{`${profileData.firstName} ${profileData.lastName}`}</h3>
                )}
              </div>
              <div className="space-y-6 text-lg">
                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-red-700" />
                  {isEditing ? (
                    <>
                      <TextInput
                        name="email"
                        value={profileData.email}
                        onChange={handleChange}
                        className="w-full"
                        required
                        color={errors.email ? 'failure' : 'gray'}
                        aria-label="Email"
                      />
                      {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
                    </>
                  ) : (
                    <span>{profileData.email}</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <FaPhone className="text-red-700" />
                  {isEditing ? (
                    <>
                      <TextInput
                        name="phoneNumber"
                        value={profileData.phoneNumber}
                        onChange={handleChange}
                        className="w-full"
                        required
                        color={errors.phoneNumber ? 'failure' : 'gray'}
                        aria-label="Phone number"
                      />
                      {errors.phoneNumber && <p className="text-red-600 text-sm">{errors.phoneNumber}</p>}
                    </>
                  ) : (
                    <span>{profileData.phoneNumber}</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-red-700" />
                  {isEditing ? (
                    <>
                      <TextInput
                        name="city"
                        value={profileData.city}
                        onChange={handleChange}
                        className="w-full"
                        required
                        color={errors.city ? 'failure' : 'gray'}
                        aria-label="City"
                      />
                      {errors.city && <p className="text-red-600 text-sm">{errors.city}</p>}
                    </>
                  ) : (
                    <span>{profileData.city}</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <FaCalendarAlt className="text-red-700" />
                  {isEditing ? (
                    <>
                      <TextInput
                        name="dob"
                        type="date"
                        value={profileData.dob}
                        onChange={handleChange}
                        className="w-full"
                        required
                        color={errors.dob ? 'failure' : 'gray'}
                        aria-label="Date of birth"
                      />
                      {errors.dob && <p className="text-red-600 text-sm">{errors.dob}</p>}
                    </>
                  ) : (
                    <span>{moment(profileData.dob).format('MMMM D, YYYY')}</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <FaIdCard className="text-red-700" />
                  {isEditing ? (
                    <>
                      <TextInput
                        name="nic"
                        value={profileData.nic}
                        onChange={handleChange}
                        className="w-full"
                        required
                        color={errors.nic ? 'failure' : 'gray'}
                        aria-label="NIC"
                      />
                      {errors.nic && <p className="text-red-600 text-sm">{errors.nic}</p>}
                    </>
                  ) : (
                    <span>{profileData.nic}</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span>Blood Type: {profileData.bloodType}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>Health Status: {profileData.healthStatus ? 'Healthy' : 'Not Healthy'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>Appointment Status: {profileData.appointmentStatus ? 'Scheduled' : 'Not Scheduled'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>Active Status: {profileData.activeStatus ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
            </div>
          </>
        );

      case 'hospital':
        return (
          <>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-5xl font-bold text-red-700 drop-shadow-md">Hospital Profile</h2>
              <div className="flex gap-4">
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
                <Button
                  onClick={handleDeactivate}
                  color="failure"
                  size="lg"
                  className="flex items-center"
                  disabled={loading}
                >
                  <FaTrash className="mr-2" />
                  Deactivate Account
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-700">
              <div className="flex flex-col items-center space-y-6">
                <FaUser className="text-8xl text-red-700" />
                {isEditing ? (
                  <>
                    <TextInput
                      name="name"
                      value={profileData.name}
                      onChange={handleChange}
                      className="text-center w-full"
                      required
                      color={errors.name ? 'failure' : 'gray'}
                      aria-label="Hospital name"
                    />
                    {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
                  </>
                ) : (
                  <h3 className="text-3xl font-semibold">{profileData.name}</h3>
                )}
              </div>
              <div className="space-y-6 text-lg">
                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-red-700" />
                  {isEditing ? (
                    <>
                      <TextInput
                        name="email"
                        value={profileData.email}
                        onChange={handleChange}
                        className="w-full"
                        required
                        color={errors.email ? 'failure' : 'gray'}
                        aria-label="Email"
                      />
                      {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
                    </>
                  ) : (
                    <span>{profileData.email}</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <FaPhone className="text-red-700" />
                  {isEditing ? (
                    <>
                      <TextInput
                        name="phoneNumber"
                        value={profileData.phoneNumber}
                        onChange={handleChange}
                        className="w-full"
                        required
                        color={errors.phoneNumber ? 'failure' : 'gray'}
                        aria-label="Phone number"
                      />
                      {errors.phoneNumber && <p className="text-red-600 text-sm">{errors.phoneNumber}</p>}
                    </>
                  ) : (
                    <span>{profileData.phoneNumber}</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-red-700" />
                  {isEditing ? (
                    <>
                      <TextInput
                        name="city"
                        value={profileData.city}
                        onChange={handleChange}
                        className="w-full"
                        required
                        color={errors.city ? 'failure' : 'gray'}
                        aria-label="City"
                      />
                      {errors.city && <p className="text-red-600 text-sm">{errors.city}</p>}
                    </>
                  ) : (
                    <span>{profileData.city}</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-red-700" />
                  {isEditing ? (
                    <>
                      <TextInput
                        name="address"
                        value={profileData.address}
                        onChange={handleChange}
                        className="w-full"
                        required
                        color={errors.address ? 'failure' : 'gray'}
                        aria-label="Address"
                      />
                      {errors.address && <p className="text-red-600 text-sm">{errors.address}</p>}
                    </>
                  ) : (
                    <span>{profileData.address}</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <FaCalendarAlt className="text-red-700" />
                  {isEditing ? (
                    <>
                      <TextInput
                        name="startTime"
                        value={profileData.startTime}
                        onChange={handleChange}
                        className="w-full"
                        required
                        color={errors.startTime ? 'failure' : 'gray'}
                        aria-label="Start time"
                      />
                      {errors.startTime && <p className="text-red-600 text-sm">{errors.startTime}</p>}
                    </>
                  ) : (
                    <span>Start Time: {profileData.startTime}</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <FaCalendarAlt className="text-red-700" />
                  {isEditing ? (
                    <>
                      <TextInput
                        name="endTime"
                        value={profileData.endTime}
                        onChange={handleChange}
                        className="w-full"
                        required
                        color={errors.endTime ? 'failure' : 'gray'}
                        aria-label="End time"
                      />
                      {errors.endTime && <p className="text-red-600 text-sm">{errors.endTime}</p>}
                    </>
                  ) : (
                    <span>End Time: {profileData.endTime}</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span>Identification Number: {profileData.identificationNumber}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>System Manager ID: {profileData.systemManagerId}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>Active Status: {profileData.activeStatus ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
            </div>
          </>
        );

      case 'hospitaladmin':
        return (
          <>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-5xl font-bold text-red-700 drop-shadow-md">Hospital Admin Profile</h2>
              <div className="flex gap-4">
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
                <Button
                  onClick={handleDeactivate}
                  color="failure"
                  size="lg"
                  className="flex items-center"
                  disabled={loading}
                >
                  <FaTrash className="mr-2" />
                  Deactivate Account
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-700">
              <div className="flex flex-col items-center space-y-6">
                <FaUser className="text-8xl text-red-700" />
                {isEditing ? (
                  <>
                    <TextInput
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleChange}
                      className="text-center w-full"
                      required
                      color={errors.firstName ? 'failure' : 'gray'}
                      aria-label="First name"
                    />
                    {errors.firstName && <p className="text-red-600 text-sm">{errors.firstName}</p>}
                    <TextInput
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleChange}
                      className="text-center w-full"
                      required
                      color={errors.lastName ? 'failure' : 'gray'}
                      aria-label="Last name"
                    />
                    {errors.lastName && <p className="text-red-600 text-sm">{errors.lastName}</p>}
                  </>
                ) : (
                  <h3 className="text-3xl font-semibold">{`${profileData.firstName} ${profileData.lastName}`}</h3>
                )}
              </div>
              <div className="space-y-6 text-lg">
                {isEditing && (
                  <div className="flex items-center gap-3">
                    <Label htmlFor="hospitalId" value="Select Hospital" className="text-red-700" />
                    <Select
                      id="hospitalId"
                      name="hospitalId"
                      value={profileData.hospitalId}
                      onChange={handleChange}
                      required
                      color={errors.hospitalId ? 'failure' : 'gray'}
                      aria-label="Select hospital"
                    >
                      <option value="" disabled>Select a hospital</option>
                      {hospitals && hospitals.map((hospital) => (
                        <option key={hospital._id} value={hospital._id}>{hospital.name}</option>
                      ))}
                    </Select>
                    {errors.hospitalId && <p className="text-red-600 text-sm">{errors.hospitalId}</p>}
                  </div>
                )}
                {!isEditing && profileData.hospitalId && (
                  <div className="flex items-center gap-3">
                    <span>Hospital: {hospitals?.find(h => h._id === profileData.hospitalId)?.name || 'N/A'}</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-red-700" />
                  {isEditing ? (
                    <>
                      <TextInput
                        name="email"
                        value={profileData.email}
                        onChange={handleChange}
                        className="w-full"
                        required
                        color={errors.email ? 'failure' : 'gray'}
                        aria-label="Email"
                      />
                      {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
                    </>
                  ) : (
                    <span>{profileData.email}</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <FaPhone className="text-red-700" />
                  {isEditing ? (
                    <>
                      <TextInput
                        name="phoneNumber"
                        value={profileData.phoneNumber}
                        onChange={handleChange}
                        className="w-full"
                        required
                        color={errors.phoneNumber ? 'failure' : 'gray'}
                        aria-label="Phone number"
                      />
                      {errors.phoneNumber && <p className="text-red-600 text-sm">{errors.phoneNumber}</p>}
                    </>
                  ) : (
                    <span>{profileData.phoneNumber}</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-red-700" />
                  {isEditing ? (
                    <>
                      <TextInput
                        name="address"
                        value={profileData.address}
                        onChange={handleChange}
                        className="w-full"
                        color={errors.address ? 'failure' : 'gray'}
                        aria-label="Address"
                      />
                      {errors.address && <p className="text-red-600 text-sm">{errors.address}</p>}
                    </>
                  ) : (
                    <span>{profileData.address || 'N/A'}</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <FaCalendarAlt className="text-red-700" />
                  {isEditing ? (
                    <>
                      <TextInput
                        name="dob"
                        type="date"
                        value={profileData.dob}
                        onChange={handleChange}
                        className="w-full"
                        required
                        color={errors.dob ? 'failure' : 'gray'}
                        aria-label="Date of birth"
                      />
                      {errors.dob && <p className="text-red-600 text-sm">{errors.dob}</p>}
                    </>
                  ) : (
                    <span>{moment(profileData.dob).format('MMMM D, YYYY')}</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <FaIdCard className="text-red-700" />
                  {isEditing ? (
                    <>
                      <TextInput
                        name="nic"
                        value={profileData.nic}
                        onChange={handleChange}
                        className="w-full"
                        required
                        color={errors.nic ? 'failure' : 'gray'}
                        aria-label="NIC"
                      />
                      {errors.nic && <p className="text-red-600 text-sm">{errors.nic}</p>}
                    </>
                  ) : (
                    <span>{profileData.nic}</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span>Active Status: {profileData.activeStatus ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
            </div>
          </>
        );

      case 'manager':
        return (
          <>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-5xl font-bold text-red-700 drop-shadow-md">System Manager Profile</h2>
              <div className="flex gap-4">
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
                <Button
                  onClick={handleDeactivate}
                  color="failure"
                  size="lg"
                  className="flex items-center"
                  disabled={loading}
                >
                  <FaTrash className="mr-2" />
                  Deactivate Account
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-700">
              <div className="flex flex-col items-center space-y-6">
                <FaUser className="text-8xl text-red-700" />
                {isEditing ? (
                  <>
                    <TextInput
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleChange}
                      className="text-center w-full"
                      required
                      color={errors.firstName ? 'failure' : 'gray'}
                      aria-label="First name"
                    />
                    {errors.firstName && <p className="text-red-600 text-sm">{errors.firstName}</p>}
                    <TextInput
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleChange}
                      className="text-center w-full"
                      required
                      color={errors.lastName ? 'failure' : 'gray'}
                      aria-label="Last name"
                    />
                    {errors.lastName && <p className="text-red-600 text-sm">{errors.lastName}</p>}
                  </>
                ) : (
                  <h3 className="text-3xl font-semibold">{`${profileData.firstName} ${profileData.lastName}`}</h3>
                )}
              </div>
              <div className="space-y-6 text-lg">
                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-red-700" />
                  {isEditing ? (
                    <>
                      <TextInput
                        name="email"
                        value={profileData.email}
                        onChange={handleChange}
                        className="w-full"
                        required
                        color={errors.email ? 'failure' : 'gray'}
                        aria-label="Email"
                      />
                      {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
                    </>
                  ) : (
                    <span>{profileData.email}</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <FaPhone className="text-red-700" />
                  {isEditing ? (
                    <>
                      <TextInput
                        name="phoneNumber"
                        value={profileData.phoneNumber}
                        onChange={handleChange}
                        className="w-full"
                        required
                        color={errors.phoneNumber ? 'failure' : 'gray'}
                        aria-label="Phone number"
                      />
                      {errors.phoneNumber && <p className="text-red-600 text-sm">{errors.phoneNumber}</p>}
                    </>
                  ) : (
                    <span>{profileData.phoneNumber}</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-red-700" />
                  {isEditing ? (
                    <>
                      <TextInput
                        name="address"
                        value={profileData.address}
                        onChange={handleChange}
                        className="w-full"
                        required
                        color={errors.address ? 'failure' : 'gray'}
                        aria-label="Address"
                      />
                      {errors.address && <p className="text-red-600 text-sm">{errors.address}</p>}
                    </>
                  ) : (
                    <span>{profileData.address}</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <FaCalendarAlt className="text-red-700" />
                  {isEditing ? (
                    <>
                      <TextInput
                        name="dob"
                        type="date"
                        value={profileData.dob}
                        onChange={handleChange}
                        className="w-full"
                        required
                        color={errors.dob ? 'failure' : 'gray'}
                        aria-label="Date of birth"
                      />
                      {errors.dob && <p className="text-red-600 text-sm">{errors.dob}</p>}
                    </>
                  ) : (
                    <span>{moment(profileData.dob).format('MMMM D, YYYY')}</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <FaIdCard className="text-red-700" />
                  {isEditing ? (
                    <>
                      <TextInput
                        name="nic"
                        value={profileData.nic}
                        onChange={handleChange}
                        className="w-full"
                        required
                        color={errors.nic ? 'failure' : 'gray'}
                        aria-label="NIC"
                      />
                      {errors.nic && <p className="text-red-600 text-sm">{errors.nic}</p>}
                    </>
                  ) : (
                    <span>{profileData.nic}</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {isEditing ? (
                    <>
                      <Select
                        name="role"
                        value={profileData.role}
                        onChange={handleChange}
                        className="w-full"
                        required
                        color={errors.role ? 'failure' : 'gray'}
                        aria-label="Role"
                      >
                        <option value="Master">Master</option>
                        <option value="Junior">Junior</option>
                      </Select>
                      {errors.role && <p className="text-red-600 text-sm">{errors.role}</p>}
                    </>
                  ) : (
                    <span>Role: {profileData.role}</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span>Active Status: {profileData.activeStatus ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
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
        {hLoading && userRole === 'HospitalAdmin' ? (
          <div className="text-center">
            <Spinner size="lg" />
            <p>Loading hospitals...</p>
          </div>
        ) : (
          renderProfileContent()
        )}
      </Card>
    </div>
  );
}