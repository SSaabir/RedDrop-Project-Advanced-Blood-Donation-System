import React, { useState } from "react";
import { Button, Card, Label, TextInput, Spinner } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { useSignin } from "../hooks/useSignin";
import { toast } from 'react-toastify';
import background from '../assets/bg2.jpg';

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
    if (!validateForm()) {
      // Highlight specific field errors
      if (errors.email) toast.error(errors.email);
      if (errors.password) toast.error(errors.password);
      return;
    }

    try {
      const response = await signinH(formData);
      
      if (response?.success) {
        toast.success('Login successful! Redirecting...');
        navigate('/hospital-dashboard');
      } else {
        // Handle API response errors
        const errorMsg = response?.message?.toLowerCase() || '';
        
        if (errorMsg.includes('password')) {
          toast.error('Incorrect password. Please enter valid password');
          setErrors(prev => ({ ...prev, password: 'Incorrect password' }));
        } else if (errorMsg.includes('email') || errorMsg.includes('hospital')) {
          toast.error('Email not found. Please enter valid email');
          setErrors(prev => ({ ...prev, email: 'Email not found' }));
        } else {
          toast.error('Login failed. Please try again.');
        }
      }
    } catch (err) {
      const errorMsg = err?.response?.data?.message?.toLowerCase() || err.message?.toLowerCase() || '';
      
      if (errorMsg.includes('password')) {
        toast.error('Incorrect password. Please enter valid password');
        setErrors(prev => ({ ...prev, password: 'Incorrect password' }));
      } else if (errorMsg.includes('email') || errorMsg.includes('hospital')) {
        toast.error('Email not found. Please enter valid email');
        setErrors(prev => ({ ...prev, email: 'Email not found' }));
      } else if (err.message === 'Network Error') {
        toast.error('Network error. Please check your connection.');
      } else {
        toast.error('Login failed. Please try again.');
      }
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-cover bg-center p-6 bg-gray-900 bg-opacity-50 backdrop-blur-lg"
      style={{ backgroundImage: `url(${background})` }}
    >
      <Card className="w-full max-w-md p-10 shadow-2xl rounded-2xl bg-white bg-opacity-95 backdrop-blur-md border border-red-100">
        <h2 className="text-4xl font-extrabold text-center text-red-700 mb-8 drop-shadow-md">
          Hospital Login
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="email" value="Hospital Email" className="text-gray-700 font-medium" />
            <TextInput
              id="email"
              type="email"
              placeholder="hospital@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              color={errors.email ? 'failure' : 'gray'}
              className="mt-2 p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500 transition-all"
              aria-label="Hospital email"
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
              minLength={6}
              disabled={loading}
              color={errors.password ? 'failure' : 'gray'}
              className="mt-2 p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500 transition-all"
              aria-label="Hospital password"
            />
            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
          </div>

          <Button
            type="submit"
            gradientDuoTone="redToPink"
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
      </Card>
    </div>
  );
}