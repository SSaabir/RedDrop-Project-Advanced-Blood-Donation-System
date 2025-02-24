import React, { useState } from "react";
import { Button, Card, Label, TextInput, Textarea } from "flowbite-react";

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
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <Card className="w-full max-w-6xl p-6 shadow-2xl rounded-2xl bg-white">
        <h2 className="text-3xl font-bold text-center text-red-700 mb-6">
          Emergency Blood Request
        </h2>

        {/* Layout: Information on Left & Form on Right */}
        <div className="grid grid-cols-2 gap-8">
          {/* Left Section: Information */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold text-red-600 mb-4">Information</h3>

            {/* Stock Section */}
            <div className="bg-white p-4 rounded-lg shadow-md mb-4">
              <h4 className="text-xl font-semibold text-red-600">Stock</h4>
              <p className="text-gray-700">Available blood units displayed here.</p>
            </div>

            {/* Donor Section */}
            <div className="bg-white p-4 rounded-lg shadow-md mb-4">
              <h4 className="text-xl font-semibold text-red-600">Donor</h4>
              <p className="text-gray-700">Information about donors.</p>
            </div>

            {/* Additional Information */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h4 className="text-xl font-semibold text-red-600">Why Donate?</h4>
              <p className="text-gray-700">
                Blood donation helps save lives. If you require emergency blood, 
                please fill out the request form.
              </p>
            </div>
          </div>

          {/* Right Section: Request Form */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold text-red-600 mb-4">Request Form</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" value="Full Name" className="text-gray-700 font-medium" />
                  <TextInput id="name" type="text" placeholder="Enter your full name" required />
                </div>

                <div>
                  <Label htmlFor="id" value="ID Number" className="text-gray-700 font-medium" />
                  <TextInput id="id" type="text" placeholder="Enter your ID number" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="hospitalName" value="Hospital Name" className="text-gray-700 font-medium" />
                  <TextInput id="hospitalName" type="text" placeholder="Enter hospital name" required />
                </div>

                <div>
                  <Label htmlFor="address" value="Address" className="text-gray-700 font-medium" />
                  <TextInput id="address" type="text" placeholder="Enter your address" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone" value="Phone Number" className="text-gray-700 font-medium" />
                  <TextInput id="phone" type="tel" placeholder="Enter phone number" required />
                </div>

                <div>
                  <Label htmlFor="bloodType" value="Blood Type Needed" className="text-gray-700 font-medium" />
                  <TextInput id="bloodType" type="text" placeholder="E.g., A+, O-" required />
                </div>
              </div>

              <div>
                <Label htmlFor="units" value="Number of Units" className="text-gray-700 font-medium" />
                <TextInput id="units" type="number" placeholder="Enter required units" required />
              </div>

              <div>
                <Label htmlFor="reason" value="Reason for Request" className="text-gray-700 font-medium" />
                <Textarea id="reason" placeholder="Provide details" required />
              </div>

              {/* Image Upload */}
              <div>
                <Label htmlFor="image" value="Upload Image" className="text-gray-700 font-medium" />
                <input type="file" id="image" accept="image/*" onChange={handleImageChange} className="mt-2 p-3 w-full border border-gray-300 rounded-lg" />
                {image && (
                  <div className="mt-4">
                    <img src={image} alt="Uploaded Preview" className="w-full h-40 object-cover rounded-lg border border-gray-300" />
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg shadow-lg transition-all">
                Submit Request
              </Button>
            </form>
          </div>
        </div>
      </Card>
    </div>
  );
}
