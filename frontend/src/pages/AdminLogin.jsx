import React from "react";
import { Button, Card, Label, TextInput } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F2F4FB] p-6">
      <Card className="w-full max-w-lg p-8 shadow-xl rounded-xl bg-white border border-gray-300">
        <h2 className="text-3xl font-bold text-center text-[#45315D] mb-6">
          Admin Login
        </h2>
        <form className="space-y-5">
          <div>
            <Label htmlFor="adminUsername" value="Username" className="text-[#45315D] font-medium" />
            <TextInput id="adminUsername" type="text" placeholder="Admin123" required />
          </div>

          <div>
            <Label htmlFor="password" value="Password" className="text-[#45315D] font-medium" />
            <TextInput id="password" type="password" placeholder="••••••••" required />
          </div>

          <div className="flex justify-between items-center">
            <Link to="/forgot-password" className="text-[#FF2400] text-sm hover:underline">
              Forgot Password?
            </Link>
          </div>

          <Button type="submit" className="w-full bg-[#FF2400] text-white font-bold py-3 rounded-lg">
            Login
          </Button>

          <p className="text-center text-sm text-[#45315D] mt-4">
            Don't have an admin account?{' '}
            <button onClick={() => navigate("/admin-register")} className="text-[#FF9280] font-medium hover:underline">
              sign up
            </button>
          </p>
        </form>
      </Card>
    </div>
  );
}


