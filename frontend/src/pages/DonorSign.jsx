import React from "react";
import { Button, Card, Label, TextInput, Select } from "flowbite-react";
import { useNavigate } from "react-router-dom";

export default function DonorSign() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-cover bg-center p-6 bg-gray-900 bg-opacity-50 backdrop-blur-lg">
      <Card className="w-full max-w-4xl p-10 shadow-2xl rounded-2xl bg-white bg-opacity-80 backdrop-blur-lg">
        <h2 className="text-4xl font-extrabold text-center text-red-600 mb-8 drop-shadow-md">
          Donor Registration
        </h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            {[
              { id: "fullName", label: "Full Name", placeholder: "John Doe" },
              { id: "age", label: "Age", placeholder: "25", type: "number" },
              { id: "phone", label: "Phone Number", placeholder: "+1234567890", type: "tel" },
            ].map((field) => (
              <div key={field.id}>
                <Label htmlFor={field.id} value={field.label} className="text-gray-700 font-medium" />
                <TextInput id={field.id} type={field.type || "text"} placeholder={field.placeholder} required />
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div>
              <Label htmlFor="bloodGroup" value="Blood Group" className="text-gray-700 font-medium" />
              <Select id="bloodGroup" required>
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="gender" value="Gender" className="text-gray-700 font-medium" />
              <Select id="gender" required>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="location" value="Location" className="text-gray-700 font-medium" />
              <TextInput id="location" type="text" placeholder="City, Country" required />
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
