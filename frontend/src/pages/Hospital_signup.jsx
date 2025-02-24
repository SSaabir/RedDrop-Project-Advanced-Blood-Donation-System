import React, { useState } from "react";
import { Button, Card, Label, TextInput } from "flowbite-react";
import { Link } from "react-router-dom";
import { FiUpload } from "react-icons/fi";

export default function HospitalSignup() {
  const [image, setImage] = useState(null);

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

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-cover bg-center p-6 bg-gray-100"
      style={{ backgroundImage: 'url("/path/to/blood-donation.jpg")' }}
    >
      <Card className="w-full max-w-lg p-10 shadow-2xl rounded-2xl bg-white bg-opacity-95 backdrop-blur-md">
        <h2 className="text-4xl font-extrabold text-center text-red-600 mb-8 drop-shadow-md">
          Hospital Registration
        </h2>
        <form className="space-y-6">
          {[
            { id: "hospitalId", label: "Hospital ID", placeholder: "HOSP-12345" },
            { id: "hospitalName", label: "Hospital Name", placeholder: "City Hospital" },
            { id: "hospitalAddress", label: "Hospital Address", placeholder: "123 Main St, City" },
            { id: "hospitalPhone", label: "Phone Number", placeholder: "+1234567890", type: "tel" },
            { id: "hospitalEmail", label: "Email", placeholder: "hospital@example.com", type: "email" },
            { id: "password", label: "Password", placeholder: "••••••••", type: "password" }
          ].map((field) => (
            <div key={field.id}>
              <Label htmlFor={field.id} value={field.label} className="text-gray-700 font-medium" />
              <TextInput
                id={field.id}
                type={field.type || "text"}
                placeholder={field.placeholder}
                required
                className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 transition-all"
              />
            </div>
          ))}

          {/* Image Upload */}
          <div>
            <Label htmlFor="hospitalImage" value="Upload Hospital Image" className="text-gray-700 font-medium" />
            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:border-red-500 transition-all mt-2">
              <input
                type="file"
                id="hospitalImage"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <FiUpload className="text-gray-500 text-4xl" />
              <span className="mt-2 text-sm text-gray-500">Click to upload</span>
            </label>
            {image && (
              <div className="mt-4">
                <img src={image} alt="Uploaded Preview" className="w-full h-40 object-cover rounded-lg shadow-md border" />
              </div>
            )}
          </div>

          {/* Register Button */}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-bold py-3 rounded-lg shadow-lg transition-all transform hover:scale-105"
          >
            Register Now
          </Button>
        </form>
      </Card>
    </div>
  );
}
