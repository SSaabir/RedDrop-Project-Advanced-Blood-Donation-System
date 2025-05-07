import React, { useState } from "react";
import { Button, Card, Label, TextInput, Spinner } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { useSignin } from "../hooks/useSignin";
import { toast } from 'react-toastify';

export default function HospitalLogin() {
  const navigate = useNavigate();
  const { signinH, loading } = useSignin();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
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

    // Validate form and handle client-side errors
    if (!validateForm()) {
      if (errors.email) toast.error(errors.email);
      if (errors.password) toast.error(errors.password);
      return;
    }

    try {
      await signinH(formData); // Let useSignin handle success (toast, navigation)
    } catch (err) {
      // Handle network or unexpected errors
      const errorMsg =
        err?.response?.data?.error ||
        (err.message === 'Network Error'
          ? 'Network error. Please check your connection.'
          : 'Login failed. Please try again.');
      handleErrorResponse(errorMsg);
    }
  };

  // Helper function to handle errors consistently
  const handleErrorResponse = (errorMsg) => {
    const lowerMsg = errorMsg.toLowerCase();

    if (lowerMsg.includes('password')) {
      toast.error('Incorrect password. Please enter valid password');
      setErrors((prev) => ({ ...prev, password: 'Incorrect password' }));
    } else if (lowerMsg.includes('email') || lowerMsg.includes('hospital')) {
      toast.error('Email not found. Please enter valid email');
      setErrors((prev) => ({ ...prev, email: 'Email not found' }));
    } else {
      toast.error(errorMsg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 via-pink-100 to-purple-100 animate-gradient-x p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-red-200/30 via-pink-200/30 to-purple-200/30 animate-gradient-y opacity-50"></div>
      <Card className="w-full max-w-md p-10 bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-red-200/30 transition-all duration-300 hover:shadow-3xl hover:scale-105 z-10">
        <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-8 tracking-tight">
          Hospital Login
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <Label 
              htmlFor="email" 
              value="Hospital Email" 
              className="text-gray-800 font-semibold tracking-wide" 
            />
            <TextInput
              id="email"
              type="email"
              placeholder="hospital@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              color={errors.email ? 'failure' : 'gray'}
              className="mt-2 rounded-lg border-gray-200 focus:ring-2 focus:ring-red-300 focus:border-red-300 transition-all duration-300 bg-white/70"
              aria-label="Hospital email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1.5 font-medium animate-fade-in">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <Label 
              htmlFor="password" 
              value="Password" 
              className="text-gray-800 font-semibold tracking-wide" 
            />
            <TextInput
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              disabled={loading}
              color={errors.password ? 'failure' : 'gray'}
              className="mt-2 rounded-lg border-gray-200 focus:ring-2 focus:ring-red-300 focus:border-red-300 transition-all duration-300 bg-white/70"
              aria-label="Hospital password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1.5 font-medium animate-fade-in">
                {errors.password}
              </p>
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold rounded-xl shadow-lg hover:from-red-600 hover:to-pink-600 focus:ring-4 focus:ring-red-200 transition-all duration-300 disabled:opacity-60"
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
      </Card>
      <style jsx>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient 15s ease infinite;
        }
        @keyframes gradientY {
          0% {
            background-position: 50% 0%;
          }
          50% {
            background-position: 50% 100%;
          }
          100% {
            background-position: 50% 0%;
          }
        }
        .animate-gradient-y {
          background-size: 200% 200%;
          animation: gradientY 20s ease infinite;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}