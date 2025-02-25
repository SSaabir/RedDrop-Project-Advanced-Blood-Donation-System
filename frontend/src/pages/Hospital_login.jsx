import React from "react";
import { Button, Card, Label, TextInput } from "flowbite-react";
import { Link } from "react-router-dom";
import background from '../assets/bg2.jpg'; // Ensure this path is correct

export default function HospitalLogin() {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-cover bg-center p-6 bg-gray-900 bg-opacity-50 backdrop-blur-lg"
      style={{ backgroundImage: `url(${background})` }}
    >
      <Card className="w-full max-w-md p-10 shadow-2xl rounded-2xl bg-white bg-opacity-90 backdrop-blur-md">
        <h2 className="text-4xl font-extrabold text-center text-red-700 mb-6 drop-shadow-md">
          Hospital Login
        </h2>
        <form className="space-y-6">
          {/* Hospital Email Input */}
          <div>
            <Label htmlFor="hospitalEmail" value="Hospital Email" className="text-gray-700 font-medium" />
            <TextInput
              id="hospitalEmail"
              type="email"
              placeholder="hospital@example.com"
              required
              className="mt-2 p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500 transition-all"
            />
          </div>

          {/* Password Input */}
          <div>
            <Label htmlFor="password" value="Password" className="text-gray-700 font-medium" />
            <TextInput
              id="password"
              type="password"
              placeholder="••••••••"
              required
              className="mt-2 p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500 transition-all"
            />
          </div>

          {/* Login Button */}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 rounded-lg shadow-lg transition-all transform hover:scale-105"
          >
            Login
          </Button>

         
        
        </form>
      </Card>
    </div>
  );
}
