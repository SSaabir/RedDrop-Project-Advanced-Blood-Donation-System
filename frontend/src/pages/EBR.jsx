import React, { useState } from "react";
import { Button, Card, Label, TextInput, Textarea, Select, Datepicker } from "flowbite-react";
import { useEmergencyBR } from "../hooks/useEmergencyBR";  // Importing the hook
import background from '../assets/bg1.jpg';


export default function EmergencyBloodRequest() {
  const { createEmergencyRequest } = useEmergencyBR();
  const [formData, setFormData] = useState({
    name: '',
    proofOfIdentificationNumber: '', // Renamed from 'id'
    hospitalName: '',
    address: '',
    phoneNumber: '', 
    patientBlood: '', 
    units: '',
    reason: '',
    criticalLevel: 'Medium', 
    withinDate: null, 
  });
  const [image, setImage] = useState(null);

  // Handle image change
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form input change
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle date change
  const handleDateChange = (date) => {
    setFormData((prevData) => ({
      ...prevData,
      withinDate: date ? date.toISOString().split("T")[0] : null, // "YYYY-MM-DD" or null
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.withinDate) {
      alert("Please select a date for 'Needed By'");
      return;
    }
  
    const fileInput = document.querySelector("#image");
    const file = fileInput && fileInput.files ? fileInput.files[0] : null;
  
    const requestData = {
      ...formData,
      proofDocument: file ? file : null, // Ensure file or null
    };
  
    await createEmergencyRequest(requestData, file);
    setFormData({
      name: '',
      proofOfIdentificationNumber: '',
      hospitalName: '',
      address: '',
      phoneNumber: '',
      patientBlood: '',
      units: '',
      reason: '',
      criticalLevel: 'Medium',
      withinDate: null,
    });
    setImage(null);
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center p-6 bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <Card className="w-full max-w-6xl p-8 shadow-2xl rounded-2xl bg-white bg-opacity-90 backdrop-blur-md">
        <h2 className="text-4xl font-extrabold text-center text-red-700 mb-8">
          Emergency Blood Request
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold text-red-600 mb-4">Information</h3>
            <div className="bg-white p-5 rounded-lg shadow-md mb-4">
              <h4 className="text-xl font-semibold text-red-600">Stock Availability</h4>
              <p className="text-gray-700">Current available blood units will be displayed here.</p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-md mb-4">
              <h4 className="text-xl font-semibold text-red-600">Donor Information</h4>
              <p className="text-gray-700">Details about our registered donors.</p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-md">
              <h4 className="text-xl font-semibold text-red-600">Why Donate?</h4>
              <p className="text-gray-700">
                Blood donation saves lives. If you require emergency blood, please complete the request form.
              </p>
            </div>
          </div>

          <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold text-red-600 mb-4">Request Form</h3>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" value="Full Name" />
                  <TextInput
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                    className="mt-2 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <Label htmlFor="proofOfIdentificationNumber" value="ID Number" /> {/* Updated */}
                  <TextInput
                    id="proofOfIdentificationNumber"
                    type="text"
                    name="proofOfIdentificationNumber"
                    value={formData.proofOfIdentificationNumber}
                    onChange={handleInputChange}
                    placeholder="Enter your ID number"
                    required
                    className="mt-2 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="hospitalName" value="Hospital Name" />
                  <TextInput
                    id="hospitalName"
                    type="text"
                    name="hospitalName"
                    value={formData.hospitalName}
                    onChange={handleInputChange}
                    placeholder="Enter hospital name"
                    required
                    className="mt-2 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <Label htmlFor="address" value="Address" />
                  <TextInput
                    id="address"
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter your address"
                    required
                    className="mt-2 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phoneNumber" value="Phone Number" /> {/* Updated */}
                  <TextInput
                    id="phoneNumber"
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="Enter 10-digit phone number"
                    required
                    pattern="\d{10}" // Added validation
                    className="mt-2 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <Label htmlFor="patientBlood" value="Blood Type Needed" /> {/* Updated */}
                  <Select
                    id="patientBlood"
                    name="patientBlood"
                    value={formData.patientBlood}
                    onChange={handleInputChange}
                    required
                    className="mt-2 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Select Blood Type</option>
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="units" value="Number of Units" />
                  <TextInput
                    id="units"
                    type="number"
                    name="units"
                    value={formData.units}
                    onChange={handleInputChange}
                    placeholder="Enter required units"
                    required
                    min="1" // Added validation
                    className="mt-2 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <Label htmlFor="criticalLevel" value="Critical Level" /> {/* Added */}
                  <Select
                    id="criticalLevel"
                    name="criticalLevel"
                    value={formData.criticalLevel}
                    onChange={handleInputChange}
                    required
                    className="mt-2 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="withinDate" value="Needed By" /> {/* Added */}
                <Datepicker
                  id="withinDate"
                  name="withinDate"
                  onSelectedDateChanged={handleDateChange}
                  minDate={new Date()} // Prevent past dates
                  required
                  className="mt-2 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <Label htmlFor="reason" value="Reason for Request" />
                <Textarea
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  placeholder="Provide details"
                  required
                  className="mt-2 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <Label htmlFor="image" value="Upload Image (Optional)" />
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-2 p-3 w-full border border-gray-300 rounded-lg shadow-sm"
                />
                {image && (
                  <div className="mt-4">
                    <img
                      src={image}
                      alt="Uploaded Preview"
                      className="max-w-xs border-2 border-gray-300 rounded-lg"
                    />
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white p-3 mt-6 rounded-lg shadow-lg">
                Submit Request
              </Button>
            </form>
          </div>
        </div>
      </Card>
    </div>
  );
}
