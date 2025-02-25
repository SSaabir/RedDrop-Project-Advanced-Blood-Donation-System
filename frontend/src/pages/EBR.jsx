import React, { useState } from "react";
import { Button, Card, Label, TextInput, Textarea } from "flowbite-react";
import background from '../assets/bg1.jpg';

export default function EmergencyBloodRequest() {
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
      className="flex min-h-screen items-center justify-center p-6 bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <Card className="w-full max-w-6xl p-8 shadow-2xl rounded-2xl bg-white bg-opacity-90 backdrop-blur-md">
        <h2 className="text-4xl font-extrabold text-center text-red-700 mb-8">
          Emergency Blood Request
        </h2>

        {/* Grid Layout: Info on Left & Form on Right */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Left Section: Information */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold text-red-600 mb-4">Information</h3>

            {/* Stock Section */}
            <div className="bg-white p-5 rounded-lg shadow-md mb-4">
              <h4 className="text-xl font-semibold text-red-600">Stock Availability</h4>
              <p className="text-gray-700">Current available blood units will be displayed here.</p>
            </div>

            {/* Donor Section */}
            <div className="bg-white p-5 rounded-lg shadow-md mb-4">
              <h4 className="text-xl font-semibold text-red-600">Donor Information</h4>
              <p className="text-gray-700">Details about our registered donors.</p>
            </div>

            {/* Additional Information */}
            <div className="bg-white p-5 rounded-lg shadow-md">
              <h4 className="text-xl font-semibold text-red-600">Why Donate?</h4>
              <p className="text-gray-700">
                Blood donation saves lives. If you require emergency blood, please complete the request form.
              </p>
            </div>
          </div>

          {/* Right Section: Request Form */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold text-red-600 mb-4">Request Form</h3>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" value="Full Name" />
                  <TextInput id="name" type="text" placeholder="Enter your full name" required className="mt-2 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500" />
                </div>
                <div>
                  <Label htmlFor="id" value="ID Number" />
                  <TextInput id="id" type="text" placeholder="Enter your ID number" required className="mt-2 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="hospitalName" value="Hospital Name" />
                  <TextInput id="hospitalName" type="text" placeholder="Enter hospital name" required className="mt-2 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500" />
                </div>
                <div>
                  <Label htmlFor="address" value="Address" />
                  <TextInput id="address" type="text" placeholder="Enter your address" required className="mt-2 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone" value="Phone Number" />
                  <TextInput id="phone" type="tel" placeholder="Enter phone number" required className="mt-2 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500" />
                </div>
                <div>
                  <Label htmlFor="bloodType" value="Blood Type Needed" />
                  <TextInput id="bloodType" type="text" placeholder="E.g., A+, O-" required className="mt-2 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500" />
                </div>
              </div>

              <div>
                <Label htmlFor="units" value="Number of Units" />
                <TextInput id="units" type="number" placeholder="Enter required units" required className="mt-2 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500" />
              </div>

              <div>
                <Label htmlFor="reason" value="Reason for Request" />
                <Textarea id="reason" placeholder="Provide details" required className="mt-2 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500" />
              </div>

              {/* Image Upload */}
              <div>
                <Label htmlFor="image" value="Upload Image (Optional)" />
                <input type="file" id="image" accept="image/*" onChange={handleImageChange} className="mt-2 p-3 w-full border border-gray-300 rounded-lg shadow-sm" />
                {image && (
                  <div className="mt-4">
                    <img src={image} alt="Uploaded Preview" className="w-full h-40 object-cover rounded-lg border border-gray-300" />
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 rounded-lg shadow-lg transition-all transform hover:scale-105">
                Submit Request
              </Button>
            </form>
          </div>
        </div>
      </Card>
    </div>
  );
}
