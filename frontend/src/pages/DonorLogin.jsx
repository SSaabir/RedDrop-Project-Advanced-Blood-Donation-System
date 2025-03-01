import React, {useState} from "react";
import { Button, Card, Label, TextInput, Checkbox } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { useSignin } from '../hooks/useSignin';

export default function DonorLogin() {
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState({});
  const {signinD, loading, error} = useSignin();

  const HandleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value.trim()});
  };

  const HandleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return setErrorMessage('Please fill out all fields');
    }
   await signinD(formData);
}

  return (
    <div className="flex min-h-screen items-center justify-center bg-cover bg-center p-6 bg-gray-900 bg-opacity-50 backdrop-blur-lg">
      <Card className="w-full max-w-md p-10 shadow-2xl rounded-2xl bg-white bg-opacity-90 backdrop-blur-md">
        <h2 className="text-4xl font-extrabold text-center text-red-700 mb-6 drop-shadow-md">
          Donor Login
        </h2>
        <form className="space-y-6" onSubmit={HandleSubmit}>
          <div>
            <Label htmlFor="donorEmail" value="Email" className="text-gray-700 font-medium" />
            <TextInput id="email" type="email" placeholder="donor@example.com" onChange={HandleChange} required />
          </div>

          <div>
            <Label htmlFor="password" value="Password" className="text-gray-700 font-medium" />
            <TextInput id="password" type="password" placeholder="••••••••" onChange={HandleChange} required />
          </div>

          <div className="flex justify-between items-center">
            <label className="flex items-center space-x-2">
              <Checkbox id="rememberMe" />
              <span className="text-gray-700 text-sm">Remember Me</span>
            </label>
            <Link to="/forgot-password" className="text-red-600 text-sm hover:underline">
              Forgot Password?
            </Link>
          </div>

          <Button type="submit" className="w-full bg-red-600 text-white font-bold py-3 rounded-lg">
            Login
          </Button>

          <p className="text-center text-sm text-gray-700 mt-4">
            Don't have an account?{' '}
            <button onClick={() => navigate("/register")} className="text-red-600 font-medium hover:underline">
              Sign Up
            </button>
          </p>
        </form>
      </Card>
    </div>
  );
}
