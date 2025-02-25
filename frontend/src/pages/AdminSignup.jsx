import React from "react";
import { Button, Card, Label, TextInput } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";

export default function AdminSignup() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F2F4FB] p-6">
      <Card className="w-full max-w-lg p-8 shadow-xl rounded-xl bg-white border border-gray-300">
        <h2 className="text-3xl font-bold text-center text-[#45315D] mb-6">
          Admin Signup
        </h2>
        <form className="space-y-5">
          <div>
            <Label htmlFor="adminName" value="Full Name" className="text-[#45315D] font-medium" />
            <TextInput id="adminName" type="text" placeholder="John Doe" required />
          </div>
          
          <div>
            <Label htmlFor="adminEmail" value="Email Address" className="text-[#45315D] font-medium" />
            <TextInput id="adminEmail" type="email" placeholder="admin@example.com" required />
          </div>

          <div>
            <Label htmlFor="adminUsername" value="Username" className="text-[#45315D] font-medium" />
            <TextInput id="adminUsername" type="text" placeholder="Admin123" required />
          </div>

          <div>
            <Label htmlFor="password" value="Password" className="text-[#45315D] font-medium" />
            <TextInput id="password" type="password" placeholder="••••••••" required />
          </div>
          
          <div>
            <Label htmlFor="confirmPassword" value="Confirm Password" className="text-[#45315D] font-medium" />
            <TextInput id="confirmPassword" type="password" placeholder="••••••••" required />
          </div>

          <Button type="submit" className="w-full bg-[#FF2400] text-white font-bold py-3 rounded-lg">
            Sign Up
          </Button>

          <p className="text-center text-sm text-[#45315D] mt-4">
            Already have an account?{' '}
            <button onClick={() => navigate("/admin-login")} className="text-[#FF9280] font-medium hover:underline">
              Login here
            </button>
          </p>
        </form>
      </Card>
    </div>
  );
}


