import React, { useState } from "react";
import { Button, Card, Label, TextInput, Checkbox, Spinner } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { useSignin } from '../hooks/useSignin';
import { toast } from 'react-toastify'; // Added for feedback

export default function DonorLogin() {
  const navigate = useNavigate();
  const { signinD, loading } = useSignin(); // Assuming no error per your hook pattern
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
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
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value.trim(),
    }));
    if (id !== 'rememberMe') setErrors((prev) => ({ ...prev, [id]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      await signinD(formData);
      toast.success('Logged in successfully!');
      navigate('/dashboard'); // Adjust path as needed
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Error logging in');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cover bg-center p-6 bg-gray-900 bg-opacity-50 backdrop-blur-lg">
      <Card className="relative w-full max-w-md p-10 shadow-2xl rounded-2xl bg-white bg-opacity-95 backdrop-blur-md border border-red-100">
        {/* Hospital Login Button */}
        <Button
          onClick={() => navigate("/Hospital_login")}
          color="light"
          size="sm"
          className="absolute top-4 right-4 text-red-600 border-red-600 hover:bg-red-50 focus:ring-red-300"
        >
          Hospital Login
        </Button>

        <h2 className="text-4xl font-extrabold text-center text-red-700 mb-6 drop-shadow-md">
          Donor Login
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="email" value="Email" className="text-gray-700 font-medium" />
            <TextInput
              id="email"
              type="email"
              placeholder="donor@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              color={errors.email ? 'failure' : 'gray'}
              className="mt-1"
              aria-label="Donor email"
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
              className="mt-1"
              aria-label="Donor password"
            />
            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
          </div>

          <div className="flex justify-between items-center">
            <label className="flex items-center space-x-2">
              <Checkbox
                id="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                disabled={loading}
                className="text-red-600 focus:ring-red-500"
              />
              <span className="text-gray-700 text-sm">Remember Me</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-red-600 text-sm font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Forgot Password?
            </Link>
          </div>

          <Button
            type="submit"
            gradientDuoTone="redToPink"
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

          <p className="text-center text-sm text-gray-700">
            Don’t have an account?{' '}
            <button
              onClick={() => navigate("/register")}
              className="text-red-600 font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-red-500"
              disabled={loading}
            >
              Sign Up
            </button>
          </p>
        </form>
      </Card>
    </div>
  );
}