import React from 'react';
import { Button } from 'flowbite-react';

export default function ContactUs () {
  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        {/* Page Title */}
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
          Contact Us
        </h1>

        {/* Contact Form and Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Send Us a Message</h2>
            <form>
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your Name"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your Email"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Message</label>
                <textarea
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="5"
                  placeholder="Your Message"
                ></textarea>
              </div>
              <Button gradientDuoTone="purpleToBlue" pill className="w-full">
                Send Message
              </Button>
            </form>
          </div>

          {/* Company Info and Map */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Our Location</h2>
            <p className="text-gray-600 mb-4">
              123 Tylac Street, Paintville, PV 12345
            </p>
            <p className="text-gray-600 mb-4">Email: info@tylac.com</p>
            <p className="text-gray-600 mb-4">Phone: +1 (123) 456-7890</p>
            {/* Map Placeholder */}
            <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Map will go here</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};