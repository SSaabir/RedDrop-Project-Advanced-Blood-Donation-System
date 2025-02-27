import React from "react";
import { Card, Button } from "flowbite-react";
import { FaUser, FaTint, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaHeartbeat, FaNotesMedical } from "react-icons/fa";

export default function DonorProfile() {
  const donor = {
    name: "John Doe",
    bloodType: "O+",
    age: 28,
    phone: "+1 234 567 890",
    location: "New York, USA",
    lastDonation: "January 15, 2025",
    totalDonations: 5,
    eligibility: "Eligible for next donation on March 15, 2025",
    healthStatus: "Excellent",
    notes: "No recent illnesses or medications."
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-red-400 to-red-600 p-6">
      <Card className="w-full max-w-4xl p-10 shadow-2xl rounded-3xl bg-white bg-opacity-90">
        <h2 className="text-5xl font-bold text-center text-red-700 mb-8">Donor Profile</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
          <div className="flex flex-col items-center space-y-4">
            <FaUser className="text-8xl text-red-700" />
            <h3 className="text-3xl font-semibold">{donor.name}</h3>
            <p className="text-xl">Age: {donor.age}</p>
          </div>
          <div className="space-y-4 text-lg">
            <div className="flex items-center gap-2">
              <FaTint className="text-red-700" />
              <span className="font-medium">Blood Type: {donor.bloodType}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaPhone className="text-red-700" />
              <span>{donor.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-red-700" />
              <span>{donor.location}</span>
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
