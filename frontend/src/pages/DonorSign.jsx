import React, { useState } from "react";
import { Button, Card, Label, TextInput, Select, FileInput } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { useDonor } from "../hooks/donor";

export default function DonorSign() {
  const navigate = useNavigate();
  const { createDonor, loading, error } = useDonor();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
    dob: "",
    bloodType: "",
    gender: "",
    location: "",
    image: null, // File input
  });
  const [errorMessage, setErrorMessage] = useState("");

  // Handle Input Change
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value.trim() }));
  };

  // Handle File Upload
  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(formData).some((val) => val === "" || val === null)) {
      return setErrorMessage("Please fill out all fields");
    }

    // Convert form data to FormData object for file upload
    const donorData = new FormData();
    Object.keys(formData).forEach((key) => {
      donorData.append(key, formData[key]);
    });

    await createDonor(donorData);
    navigate("/donor-login");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cover bg-center p-6 bg-gray-900 bg-opacity-50 backdrop-blur-lg">
      <Card className="w-full max-w-4xl p-10 shadow-2xl rounded-2xl bg-white bg-opacity-80 backdrop-blur-lg">
        <h2 className="text-4xl font-extrabold text-center text-red-600 mb-8 drop-shadow-md">
          Donor Registration
        </h2>

        {errorMessage && <p className="text-red-600 text-center">{errorMessage}</p>}

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
          <div className="space-y-6">
            {[
              { id: "firstName", label: "First Name", placeholder: "John" },
              { id: "lastName", label: "Last Name", placeholder: "Doe" },
              { id: "phoneNumber", label: "Phone Number", placeholder: "+1234567890", type: "tel" },
              { id: "email", label: "Email", placeholder: "example@example.com", type: "email" },
              { id: "password", label: "Password", placeholder: "••••••••", type: "password" },
            ].map((field) => (
              <div key={field.id}>
                <Label htmlFor={field.id} value={field.label} className="text-gray-700 font-medium" />
                <TextInput id={field.id} type={field.type || "text"} placeholder={field.placeholder} onChange={handleChange} required />
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div>
              <Label htmlFor="dob" value="Date of Birth" className="text-gray-700 font-medium" />
              <TextInput id="dob" type="date" onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="bloodType" value="Blood Type" className="text-gray-700 font-medium" />
              <Select id="bloodType" onChange={handleChange} required>
                <option value="">Select Blood Type</option>
                {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="gender" value="Gender" className="text-gray-700 font-medium" />
              <Select id="gender" onChange={handleChange} required>
                <option value="">Select Gender</option>
                {["Male", "Female", "Other"].map((gender) => (
                  <option key={gender} value={gender}>
                    {gender}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="location" value="Location" className="text-gray-700 font-medium" />
              <TextInput id="location" type="text" placeholder="City, Country" onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="image" value="Profile Picture" className="text-gray-700 font-medium" />
              <FileInput id="image" onChange={handleFileChange} required />
            </div>
          </div>

          <div className="md:col-span-2 flex flex-col items-center space-y-4">
            <Button type="submit" className="w-full bg-red-600 text-white font-bold py-3 rounded-lg" disabled={loading}>
              {loading ? "Registering..." : "Register Now"}
            </Button>
            {error && <p className="text-red-600">{error}</p>}
            <button onClick={() => navigate("/donor-login")} className="text-red-600 font-medium hover:underline">
              Already have an account? Login
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
