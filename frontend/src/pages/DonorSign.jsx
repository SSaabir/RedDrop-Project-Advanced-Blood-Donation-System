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
    city: "",
    nic: "",
    image: null,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [imagePreview, setImagePreview] = useState(null); // Add state for image preview

  // Handle Input Change
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value.trim() }));
  };

  // Handle File Upload (Image)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, image: file }));
    
    // Create an image preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(formData).some((val) => val === "" || val === null)) {
      setErrorMessage("Please fill out all fields");
      return;
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
        <h2 className="text-4xl font-extrabold text-center text-red-600 mb-8 drop-shadow-md">Donor Registration</h2>

        {errorMessage && <p className="text-red-600 text-center">{errorMessage}</p>}

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
          <div className="space-y-6">
            {["firstName", "lastName", "phoneNumber", "email", "password"].map((id, index) => (
              <div key={index}>
                <Label htmlFor={id} value={id.replace(/([A-Z])/g, ' $1').trim()} className="text-gray-700 font-medium" />
                <TextInput
                  id={id}
                  type={id === "password" ? "password" : id === "email" ? "email" : "text"}
                  placeholder={id === "password" ? "••••••••" : "Enter " + id}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}
          </div>

          <div className="space-y-6">
            {["dob", "city", "nic"].map((id, index) => (
              <div key={index}>
                <Label htmlFor={id} value={id.replace(/([A-Z])/g, ' $1').trim()} className="text-gray-700 font-medium" />
                <TextInput id={id} type={id === "dob" ? "date" : "text"} onChange={handleChange} required />
              </div>
            ))}
            {[{ id: "bloodType", options: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"] }, { id: "gender", options: ["Male", "Female", "Other"] }].map((field, index) => (
              <div key={index}>
                <Label htmlFor={field.id} value={field.id.replace(/([A-Z])/g, ' $1').trim()} className="text-gray-700 font-medium" />
                <Select id={field.id} onChange={handleChange} required>
                  <option value="">Select {field.id.replace(/([A-Z])/g, ' $1').trim()}</option>
                  {field.options.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </Select>
              </div>
            ))}
            <div>
              <Label htmlFor="image" value="Profile Picture" className="text-gray-700 font-medium" />
              <FileInput id="image" onChange={handleFileChange} required />
              {/* Display the image preview */}
              {imagePreview && (
                <div className="mt-4">
                  <img src={imagePreview} alt="Profile Preview" className="w-32 h-32 object-cover rounded-full border-2 border-gray-400" />
                </div>
              )}
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
