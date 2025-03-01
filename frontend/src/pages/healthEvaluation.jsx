import React, { useState, useEffect } from "react";
import { Button, Label, TextInput, Spinner, Select, Textarea } from "flowbite-react";
import background from '../assets/bg2.jpg';
import { useHospital } from "../hooks/hospital";

export default function HealthEvaluationForm() {
  const [loading, setLoading] = useState(false);
  const { hospitals, fetchHospitals } = useHospital();
  const [formData, setFormData] = useState({
    donorId: "",
    hospitalId: "",
    evaluationDate: "",
    evaluationTime: "",
    passStatus: "Pending",
    progressStatus: "Not Started",
    notes: ""
  });

  // ✅ Fetch donor ID when component mounts
  useEffect(() => {
    const storedDonorId = localStorage.getItem("donorId");
    if (storedDonorId) {
      setFormData(prev => ({ ...prev, donorId: storedDonorId }));
    }
  }, []);

  // ✅ Fetch hospitals when component mounts
  useEffect(() => {
    fetchHospitals();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Health Evaluation scheduled successfully!");
      setFormData({
        donorId: localStorage.getItem("donorId") || "",
        hospitalId: "",
        evaluationDate: "",
        evaluationTime: "",
        passStatus: "Pending",
        progressStatus: "Not Started",
        notes: ""
      });
    }, 2000);
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-cover bg-center p-6"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="w-full max-w-3xl bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-xl border border-gray-200">
        <h3 className="text-3xl font-semibold text-red-700 text-center">Schedule Health Evaluation</h3>
        <form className="space-y-6 mt-6" onSubmit={handleSubmit}>
          
          <div>
            <Label htmlFor="hospitalId" value="Select Hospital" className="text-gray-700 font-medium" />
            <Select id="hospitalId" required value={formData.hospitalId} onChange={handleChange}>
              <option value="" disabled>Select a hospital</option>
              {hospitals.map(hospital => (
                <option key={hospital._id} value={hospital._id}>{hospital.name}</option>
              ))}
            </Select>
          </div>
          
          <div>
            <Label htmlFor="evaluationDate" value="Evaluation Date" className="text-gray-700 font-medium" />
            <TextInput id="evaluationDate" type="date" required value={formData.evaluationDate} onChange={handleChange} />
          </div>
          
          <div>
            <Label htmlFor="evaluationTime" value="Evaluation Time" className="text-gray-700 font-medium" />
            <TextInput id="evaluationTime" type="time" required value={formData.evaluationTime} onChange={handleChange} />
          </div>
          
          <div>
            <Label htmlFor="notes" value="Additional Notes" className="text-gray-700 font-medium" />
            <Textarea id="notes" placeholder="Enter any additional details" value={formData.notes} onChange={handleChange} />
          </div>
          
          <Button type="submit" className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-3 rounded-lg shadow-lg transition-all flex items-center justify-center">
            {loading ? <Spinner color="white" size="sm" /> : "Schedule Evaluation"}
          </Button>
        </form>
      </div>
    </div>
  );
}
