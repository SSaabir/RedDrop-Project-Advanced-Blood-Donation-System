import React, { useState } from "react";
import { Button, Card, Label, TextInput, Spinner } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { useSignin } from '../hooks/useSignin.js';
import { toast } from 'react-toastify'; // Added for feedback

export default function AdminLogin() {
  const navigate = useNavigate();
  const { signinA, loading } = useSignin(); // Assuming no error per your hook pattern
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
    // Optional: Add complexity rules, e.g., min length
    // else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
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
      await signinA(formData);
      toast.success('Logged in successfully!');
      navigate('/dashboard'); // Redirect on success (adjust path as needed)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Error logging in');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F2F4FB] p-6">
      <Card className="w-full max-w-lg p-8 shadow-xl rounded-xl bg-white border border-gray-200 bg-opacity-95 backdrop-blur-sm">
        <h2 className="text-3xl font-bold text-center text-[#45315D] mb-6">
          Admin Login
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="email" value="Email" className="text-[#45315D] font-medium" />
            <TextInput
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              color={errors.email ? 'failure' : 'gray'}
              className="mt-1"
              aria-label="Admin email"
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <Label htmlFor="password" value="Password" className="text-[#45315D] font-medium" />
            <TextInput
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              color={errors.password ? 'failure' : 'gray'}
              className="mt-1"
              aria-label="Admin password"
            />
            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
          </div>

         

          <Button
            type="submit"
            gradientDuoTone="purpleToPink"
            size="lg"
            className="w-full font-bold shadow-md hover:shadow-lg transition-shadow"
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

          <p className="text-center text-sm text-[#45315D]">
            Don’t have an admin account?{' '}
            <button
              onClick={() => navigate("/admin-register")}
              className="text-[#FF9280] font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-[#FF9280]"
              disabled={loading}
            >
              Sign up
            </button>
          </p>
        </form>
      </Card>
    </div>
  );
}