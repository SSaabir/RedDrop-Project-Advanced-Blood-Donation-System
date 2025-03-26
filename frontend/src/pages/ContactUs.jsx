import React, { useState } from 'react';
import { Button } from 'flowbite-react';
import axios from 'axios';
import map from '../assets/map.jpg';
import contactus from '../assets/contactus.jpg';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    email: '',
    subject: '',
    message: '',
    category: 'General', // Default category
  });

  const categories = ['General', 'Technical', 'Complaint', 'Other'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/inquiries', formData);
      alert('Message sent successfully!');
      setFormData({ email: '', subject: '', message: '', category: 'General' });
    } catch (error) {
      alert('Error sending message');
    }
  };

  return (
    <div className="py-16 bg-gray-50 relative">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-50 z-0"
        style={{ backgroundImage: `url(${contactus})` }}
      ></div>
      <div className="container mx-auto px-6 relative z-10">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
          Contact Us
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Your Email"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Subject"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="5"
                  placeholder="Your Message"
                  required
                ></textarea>
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <Button type="submit" gradientDuoTone="purpleToBlue" pill className="w-full">
                Send Message
              </Button>
            </form>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Our Location</h2>
            <p className="text-gray-600 mb-4">BOC Merchant Tower, 28 St Michaels Rd</p>
            <p className="text-gray-600 mb-4">Email: redDrop@gmail.com</p>
            <p className="text-gray-600 mb-4">Phone: +1 (123) 456-7890</p>
            <div className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
              <img src={map} alt="Location Map" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
