import React, { useState } from "react";
import { Button, Card, Label, TextInput, Textarea, Spinner } from "flowbite-react";

export default function DonorAppointment() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ donorName: "", appointmentDate: "", evaluationNotes: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Appointment scheduled successfully!");
    }, 2000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <Card className="w-full max-w-4xl p-8 shadow-2xl rounded-2xl bg-white">
        <h2 className="text-4xl font-bold text-center text-red-700 mb-8">Donor Appointment</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Stock Section */}
          <div className="bg-red-50 p-6 rounded-xl border border-red-300 shadow-md">
            <h3 className="text-xl font-semibold text-red-700">Stock Availability</h3>
            <p className="text-gray-700 mt-2">Real-time updates on available blood units.</p>
          </div>

          {/* Donor Section */}
          <div className="bg-red-50 p-6 rounded-xl border border-red-300 shadow-md">
            <h3 className="text-xl font-semibold text-red-700">Donor Information</h3>
            <p className="text-gray-700 mt-2">Check donor eligibility and details.</p>
          </div>
        </div>

        {/* Information Section */}
        <div className="bg-red-50 p-6 mt-6 rounded-xl border border-red-300 shadow-md">
          <h3 className="text-xl font-semibold text-red-700">Donation Guidelines</h3>
          <p className="text-gray-700 mt-2">Understand the process and requirements before donating blood.</p>
        </div>

        {/* Donor Appointment Section */}
        <div className="mt-8">
          <h3 className="text-2xl font-semibold text-red-700">Schedule an Appointment</h3>
          <form className="space-y-6 mt-6" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="donorName" value="Donor Name" className="text-gray-700 font-medium" />
              <TextInput id="donorName" type="text" placeholder="Enter donor name" required value={formData.donorName} onChange={handleChange} className="mt-2 p-3 w-full border border-gray-300 rounded-lg" />
            </div>

            <div>
              <Label htmlFor="appointmentDate" value="Appointment Date" className="text-gray-700 font-medium" />
              <TextInput id="appointmentDate" type="date" required value={formData.appointmentDate} onChange={handleChange} className="mt-2 p-3 w-full border border-gray-300 rounded-lg" />
            </div>

            <div>
              <Label htmlFor="evaluationNotes" value="Evaluation Notes" className="text-gray-700 font-medium" />
              <Textarea id="evaluationNotes" placeholder="Enter evaluation details" required value={formData.evaluationNotes} onChange={handleChange} className="mt-2 p-3 w-full border border-gray-300 rounded-lg" />
            </div>

            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg shadow-lg transition-all flex items-center justify-center">
              {loading ? <Spinner color="white" size="sm" /> : "Schedule Appointment"}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
