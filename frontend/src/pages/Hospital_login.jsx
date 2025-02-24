import React from "react";
import { Button, Card, Label, TextInput } from "flowbite-react";
import { Link } from "react-router-dom";

export default function Hospital_login() {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-cover bg-center p-6"
      style={{ backgroundImage: 'url("/path/to/blood-donation.jpg")' }}
    >
      <Card className="w-full max-w-md p-10 shadow-2xl rounded-2xl bg-white bg-opacity-90">
        <h2 className="text-4xl font-extrabold text-center text-red-700 mb-8">
          Hospital Login
        </h2>
        <form className="space-y-6">
          {/* Hospital Email Input */}
          <div>
            <Label htmlFor="hospitalEmail" value="Hospital Email" className="text-gray-700 font-medium" />
            <TextInput id="hospitalEmail" type="email" placeholder="hospital@example.com" required className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500" />
          </div>

          {/* Password Input */}
          <div>
            <Label htmlFor="password" value="Password" className="text-gray-700 font-medium" />
            <TextInput id="password" type="password" placeholder="••••••••" required className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500" />
          </div>

          {/* Login Button */}
          <Button type="submit" className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 rounded-lg shadow-lg transition-all">
            Login
          </Button>
        </form>

        

       
      </Card>
    </div>
  );
}
