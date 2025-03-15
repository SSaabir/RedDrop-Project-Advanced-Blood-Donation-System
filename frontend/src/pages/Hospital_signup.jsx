import React, { useState } from "react";
import { Button, Card, Label, TextInput, FileInput } from "flowbite-react";
import { useNavigate } from "react-router-dom";

export default function HospitalSignup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    identificationNumber: "",
    email: "",
    password: "",
    phoneNumber: "",
    address: "",
    startTime: "",
    endTime: "",
    image: null,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  // Handle Input Change
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value.trim() }));
  };

  // Handle File Upload (Image)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, image: file }));

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

    const hospitalData = new FormData();
    Object.keys(formData).forEach((key) => {
      hospitalData.append(key, formData[key]);
    });
    
    navigate("/Hospital_login");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-lg p-6">
      <Card className="w-full max-w-4xl p-10 shadow-2xl rounded-2xl bg-white bg-opacity-80 backdrop-blur-lg">
        <h2 className="text-4xl font-extrabold text-center text-red-600 mb-8 drop-shadow-md">Hospital Registration</h2>

        {errorMessage && <p className="text-red-600 text-center">{errorMessage}</p>}

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
          <div className="space-y-6">
            {["name", "city", "identificationNumber", "email", "password", "phoneNumber"].map((id, index) => (
              <div key={index}>
                <Label htmlFor={id} value={id.replace(/([A-Z])/g, ' $1').trim()} className="text-gray-700 font-medium" />
                <TextInput id={id} type={id === "email" ? "email" : id === "password" ? "password" : "text"} onChange={handleChange} required />
              </div>
            ))}
          </div>

          <div className="space-y-6">
            {["address", "startTime", "endTime"].map((id, index) => (
              <div key={index}>
                <Label htmlFor={id} value={id.replace(/([A-Z])/g, ' $1').trim()} className="text-gray-700 font-medium" />
                <TextInput id={id} type={id.includes("Time") ? "time" : "text"} onChange={handleChange} required />
              </div>
            ))}
            <div>
              <Label htmlFor="image" value="Hospital Image" className="text-gray-700 font-medium" />
              <FileInput id="image" onChange={handleFileChange} required />
              {imagePreview && <img src={imagePreview} alt="Hospital Preview" className="mt-4 w-32 h-32 object-cover rounded-lg border-2 border-gray-400" />}
            </div>
          </div>

          <div className="md:col-span-2 flex flex-col items-center space-y-4">
            <Button type="submit" className="w-full bg-red-600 text-white font-bold py-3 rounded-lg">Register Now</Button>
            <button onClick={() => navigate("/hospital-login")} className="text-red-600 font-medium hover:underline">Already have an account? Login</button>
          </div>
        </form>
      </Card>
    </div>
  );
}