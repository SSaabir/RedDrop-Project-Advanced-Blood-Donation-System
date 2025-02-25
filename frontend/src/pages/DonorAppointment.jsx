import React, { useState } from "react";
import { Button, Card, Label, TextInput, Textarea, Spinner } from "flowbite-react";
import background from '../assets/bg2.jpg'; // Ensure the image exists

export default function DonorAppointment() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ 
    donorName: "", 
    address: "", 
    phoneNumber: "", 
    nicNumber: "", 
    email: "", 
    file: null 
  });

  const handleChange = (e) => {
    const { id, value, type, files } = e.target;
    setFormData({ ...formData, [id]: type === "file" ? files[0] : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Appointment scheduled successfully!");
    }, 2000);
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-cover bg-center p-6"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-xl border border-gray-200">
        
        {/* Left Section: Information */}
        <div className="w-full md:w-1/2 space-y-6">
          <h2 className="text-4xl font-bold text-red-700 text-center md:text-left">Donor Information</h2>

          <div className="bg-red-100 p-6 rounded-xl border border-red-300 shadow-md hover:shadow-lg transition-all duration-300">
            <h3 className="text-xl font-semibold text-red-700">Stock Availability</h3>
            <p className="text-gray-700 mt-2">Real-time updates on available blood units.</p>
          </div>

          <div className="bg-red-100 p-6 rounded-xl border border-red-300 shadow-md hover:shadow-lg transition-all duration-300">
            <h3 className="text-xl font-semibold text-red-700">Donor Eligibility</h3>
            <p className="text-gray-700 mt-2">Check donor requirements before scheduling.</p>
          </div>

          <div className="bg-red-100 p-6 rounded-xl border border-red-300 shadow-md hover:shadow-lg transition-all duration-300">
            <h3 className="text-xl font-semibold text-red-700">Donation Guidelines</h3>
            <p className="text-gray-700 mt-2">Understand the process before donating blood.</p>
          </div>
        </div>

        {/* Right Section: Appointment Form */}
        <div className="w-full md:w-1/2">
          <h3 className="text-3xl font-semibold text-red-700 text-center">Schedule an Appointment</h3>
          <form className="space-y-6 mt-6" onSubmit={handleSubmit}>
            
            <div>
              <Label htmlFor="donorName" value="Donor Name" className="text-gray-700 font-medium" />
              <TextInput
                id="donorName"
                type="text"
                placeholder="Enter donor name"
                required
                value={formData.donorName}
                onChange={handleChange}
                className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 transition-all"
              />
            </div>

            <div>
              <Label htmlFor="address" value="Address" className="text-gray-700 font-medium" />
              <TextInput
                id="address"
                placeholder="Enter address"
                required
                value={formData.address}
                onChange={handleChange}
                className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 transition-all"
              />
            </div>

            <div>
              <Label htmlFor="phoneNumber" value="Phone Number" className="text-gray-700 font-medium" />
              <TextInput
                id="phoneNumber"
                type="tel"
                placeholder="Enter phone number"
                required
                value={formData.phoneNumber}
                onChange={handleChange}
                className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 transition-all"
              />
            </div>

            <div>
              <Label htmlFor="nicNumber" value="NIC Number" className="text-gray-700 font-medium" />
              <TextInput
                id="nicNumber"
                type="text"
                placeholder="Enter NIC number"
                required
                value={formData.nicNumber}
                onChange={handleChange}
                className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 transition-all"
              />
            </div>

            <div>
              <Label htmlFor="email" value="Email" className="text-gray-700 font-medium" />
              <TextInput
                id="email"
                type="email"
                placeholder="Enter email address"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 transition-all"
              />
            </div>

            <div>
              <Label htmlFor="file" value="Upload Document" className="text-gray-700 font-medium" />
              <input
                id="file"
                type="file"
                required
                onChange={handleChange}
                className="mt-2 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-red-500 transition-all"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 rounded-lg shadow-lg transition-all flex items-center justify-center"
            >
              {loading ? <Spinner color="white" size="sm" /> : "Schedule Appointment"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
