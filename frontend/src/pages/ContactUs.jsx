import React, { useState } from 'react';
import { Button, Spinner, TextInput, Textarea } from 'flowbite-react';
import { toast } from 'react-toastify'; // Added for consistent feedback
import map from '../assets/map.jpg';
import contactus from '../assets/contactus.jpg';
import { useInquiry } from '../hooks/useinquiry';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    email: '',
    subject: '',
    message: '',
    category: 'General',
  });
  const [errors, setErrors] = useState({});
  const { createInquiry, loading } = useInquiry(); // Assuming hook provides loading, no error

  const categories = ['General', 'Technical', 'Complaint', 'Other'];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.subject) newErrors.subject = 'Subject is required';
    if (!formData.message) newErrors.message = 'Message is required';
    if (!categories.includes(formData.category)) newErrors.category = 'Invalid category';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' })); // Clear error on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      await createInquiry(formData);
      toast.success('Message sent successfully!');
      setFormData({ email: '', subject: '', message: '', category: 'General' });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Error sending message');
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
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
                <TextInput
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  required
                  disabled={loading}
                  color={errors.email ? 'failure' : 'gray'}
                />
                {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="subject" className="block text-gray-700 mb-2">Subject</label>
                <TextInput
                  id="subject"
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Subject"
                  required
                  disabled={loading}
                  color={errors.subject ? 'failure' : 'gray'}
                />
                {errors.subject && <p className="text-red-600 text-sm mt-1">{errors.subject}</p>}
              </div>
              <div>
                <label htmlFor="message" className="block text-gray-700 mb-2">Message</label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Your Message"
                  required
                  disabled={loading}
                  color={errors.message ? 'failure' : 'gray'}
                />
                {errors.message && <p className="text-red-600 text-sm mt-1">{errors.message}</p>}
              </div>
              <div>
                <label htmlFor="category" className="block text-gray-700 mb-2">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={loading}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && <p className="text-red-600 text-sm mt-1">{errors.category}</p>}
              </div>
              <Button
                type="submit"
                gradientDuoTone="purpleToBlue"
                pill
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </Button>
            </form>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Our Location</h2>
            <p className="text-gray-600 mb-4">BOC Merchant Tower, 28 St Michaels Rd</p>
            <p className="text-gray-600 mb-4">Email: redDrop@gmail.com</p>
            <p className="text-gray-600 mb-4">Phone: +1 (123) 456-7890</p>
            <div className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
              <img
                src={map}
                alt="Location Map"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}