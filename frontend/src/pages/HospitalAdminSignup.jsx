import React, { useState } from "react";
import { Button, Card, Label, TextInput } from "flowbite-react";
import { FiUpload } from "react-icons/fi";
import background from '../assets/bg4.jpg';

export default function HospitalAdminSignup() {
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
      className="flex min-h-screen items-center justify-center bg-cover bg-center p-6 bg-gray-900 bg-opacity-50 backdrop-blur-lg"
      style={{ backgroundImage: `url(${background})` }}
    >
      <Card className="w-full max-w-4xl p-10 shadow-2xl rounded-2xl bg-white bg-opacity-80 backdrop-blur-lg">
        <h2 className="text-4xl font-extrabold text-center text-blue-600 mb-8 drop-shadow-md">
          Hospital Admin Registration
        </h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            {[  
              { id: "firstName", label: "First Name", placeholder: "mr" },
              { id: "lastName", label: "Last Name", placeholder: "Example" },
              { id: "dob", label: "Date of Birth", placeholder: "YYYY-MM-DD", type: "date" },
            ].map((field) => (
              <div key={field.id} className="relative">
                <Label htmlFor={field.id} value={field.label} className="text-gray-700 font-medium" />
                <TextInput
                  id={field.id}
                  type={field.type || "text"}
                  placeholder={field.placeholder}
                  required
                  className="mt-2 p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            ))}
          </div>

          <div className="space-y-6">
            {[  
              { id: "phoneNumber", label: "Phone Number", placeholder: "+1234567890", type: "tel" },
              { id: "email", label: "Email", placeholder: "admin@example.com", type: "email" },
              { id: "password", label: "Password", placeholder: "••••••••", type: "password" },
            ].map((field) => (
              <div key={field.id} className="relative">
                <Label htmlFor={field.id} value={field.label} className="text-gray-700 font-medium" />
                <TextInput
                  id={field.id}
                  type={field.type}
                  placeholder={field.placeholder}
                  required
                  className="mt-2 p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            ))}
          </div>
          
          {/* Image Upload Section (Full Width) */}
          <div className="md:col-span-2">
            <Label htmlFor="adminImage" value="Upload Profile Image" className="text-gray-700 font-medium" />
            <label className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:border-blue-500 transition-all mt-2 p-4 bg-gray-50 hover:bg-gray-100">
              <input
                type="file"
                id="adminImage"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <FiUpload className="text-gray-500 text-5xl" />
              <span className="mt-2 text-sm text-gray-600 font-medium">Click to upload</span>
            </label>
            {image && (
              <div className="mt-4">
                <img src={image} alt="Uploaded Preview" className="w-full h-40 object-cover rounded-lg shadow-md border" />
              </div>
            )}
          </div>
          
          {/* Register Button (Full Width) */}
          <div className="md:col-span-2">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold py-3 rounded-lg shadow-lg transition-all transform hover:scale-105"
            >
              Register Now
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
