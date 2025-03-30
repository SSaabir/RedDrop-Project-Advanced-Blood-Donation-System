import React, { useState } from "react";
import { Button, Card, Label, TextInput, Spinner } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { useSignin } from "../hooks/useSignin";
import { useAuthContext } from "../hooks/useAuthContext";
import { toast } from 'react-toastify'; // Added for feedback
import background from '../assets/hospital.jpg'; // Ensure this path is correct

export default function HospitalAdminLogin() {
  const { user } = useAuthContext();
  const userId = user?.userObj?._id;
  const navigate = useNavigate();
  const { signinHD, loading } = useSignin(); // Assuming no error per your hook pattern
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    // Optional: Add complexity, e.g., if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value.trim() }));
    setErrors((prev) => ({ ...prev, [id]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      await signinHD(formData, userId);
      toast.success('Logged in successfully!');
      navigate('/hospital-admin-dashboard'); // Adjust path as needed
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Error logging in');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-10">
      <div className="flex w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Left Side - Image */}
        <div className="w-1/2 hidden md:block">
          <img src={background} alt="Hospital Admin" className="w-full h-full object-cover" loading="lazy" />
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 p-12 flex flex-col justify-center">
          <h2 className="text-4xl font-extrabold text-center text-blue-700 mb-8 drop-shadow-md">
            Hospital Admin Login
          </h2>

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email" value="Admin Email" className="text-gray-700 font-medium" />
              <TextInput
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                color={errors.email ? 'failure' : 'gray'}
                className="mt-3 p-4 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition-all"
                aria-label="Hospital admin email"
              />
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <Label htmlFor="password" value="Password" className="text-gray-700 font-medium" />
              <TextInput
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
                color={errors.password ? 'failure' : 'gray'}
                className="mt-3 p-4 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition-all"
                aria-label="Hospital admin password"
              />
              {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
            </div>

            <Button
              type="submit"
              gradientDuoTone="cyanToBlue"
              size="lg"
              className="w-full font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}