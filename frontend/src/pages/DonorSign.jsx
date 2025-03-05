import React, { useState } from "react";
import { Button, Card, Label, TextInput, Select, FileInput, Alert } from "flowbite-react";
import { useNavigate } from "react-router-dom";

export default function DonorSign() {
  const navigate = useNavigate();
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
    image: null,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { id, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: files ? files[0] : value, // Handle file input separately
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.bloodType) {
      setError("Please fill out all required fields.");
      return;
    }

    // Create FormData object for sending including image
    const submitData = new FormData();
    Object.keys(formData).forEach((key) => submitData.append(key, formData[key]));

    try {
      const response = await fetch("http://localhost:5000/api/donor", {
        method: "POST",
        body: submitData, // Sending formData instead of JSON
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to register donor");
      }

      setSuccess(true);
      setTimeout(() => navigate("/donor-login"), 2000); // Redirect after 2 sec
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cover bg-center p-6 bg-gray-900 bg-opacity-50 backdrop-blur-lg">
      <Card className="w-full max-w-4xl p-10 shadow-2xl rounded-2xl bg-white bg-opacity-80 backdrop-blur-lg">
        <h2 className="text-4xl font-extrabold text-center text-red-600 mb-8 drop-shadow-md">
          Donor Registration
        </h2>

        {error && <Alert color="failure">{error}</Alert>}
        {success && <Alert color="success">Registration Successful!</Alert>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            {[ 
              { id: "firstName", label: "First Name", placeholder: "John" },
              { id: "lastName", label: "Last Name", placeholder: "Doe" },
              { id: "phoneNumber", label: "Phone Number", placeholder: "+1234567890", type: "tel" },
              { id: "email", label: "Email", placeholder: "example@example.com", type: "email" },
              { id: "password", label: "Password", placeholder: "********", type: "password" },
            ].map((field) => (
              <div key={field.id}>
                <Label htmlFor={field.id} value={field.label} className="text-gray-700 font-medium" />
                <TextInput id={field.id} type={field.type || "text"} placeholder={field.placeholder} required onChange={handleChange} />
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div>
              <Label htmlFor="dob" value="Date of Birth" className="text-gray-700 font-medium" />
              <TextInput id="dob" type="date" required onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="bloodType" value="Blood Type" className="text-gray-700 font-medium" />
              <Select id="bloodType" required onChange={handleChange}>
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
              <Select id="gender" required onChange={handleChange}>
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
              <TextInput id="location" type="text" placeholder="City, Country" required onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="image" value="Profile Picture" className="text-gray-700 font-medium" />
              <FileInput id="image" required onChange={handleChange} />
            </div>
          </div>

          <div className="md:col-span-2 flex flex-col items-center space-y-4">
            <Button type="submit" className="w-full bg-red-600 text-white font-bold py-3 rounded-lg">
              Register Now
            </Button>
            <button onClick={() => navigate("/donor-login")} className="text-red-600 font-medium hover:underline">
              Already have an account? Login
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
