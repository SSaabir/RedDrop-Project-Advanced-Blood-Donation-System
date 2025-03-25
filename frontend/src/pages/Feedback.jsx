import React, { useState } from 'react';
import { Card, TextInput, Textarea, Button } from 'flowbite-react';
import { FaStar } from 'react-icons/fa';
import FeedbackBG from '../assets/FeedbackBG.jpg';

export default function Feedback() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);

  const feedbacks = [
    {
      name: "John Doe",
      email: "john.doe@example.com",
      rating: 4,
      feedback: "Great service, I loved the experience!"
    },
    {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      rating: 5,
      feedback: "Amazing platform for blood donation. Highly recommend!"
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="relative py-16 bg-gray-50">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-70"
        style={{ backgroundImage: `url(${FeedbackBG})` }}
      ></div>
      
      {/* Content Section */}
      <div className="relative container mx-auto px-6 z-10">
        {/* Customer Feedback Section */}
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
          Donor Feedbacks
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {feedbacks.map((fb, index) => (
            <Card key={index} className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{fb.name}</h3>
              <p className="text-gray-600 mb-2">{fb.email}</p>
              <div className="flex mb-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={i < fb.rating ? "text-yellow-400" : "text-gray-300"} />
                ))}
              </div>
              <p className="text-gray-600">{fb.feedback}</p>
            </Card>
          ))}
        </div>

        {/* Feedback Form Section */}
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12 mt-16">
          We'd Love to Hear From You
        </h2>
        <form className="max-w-2xl mx-auto" onSubmit={handleSubmit}>
          <div className="mb-6">
            <TextInput
              id="name"
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <TextInput
              id="email"
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <Textarea
              id="feedback"
              placeholder="Your Feedback"
              rows={5}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              required
            />
          </div>

          {/* Star Rating */}
          <div className="mb-6 flex justify-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={i < rating ? "text-yellow-400 cursor-pointer" : "text-gray-300 cursor-pointer"}
                onClick={() => setRating(i + 1)}
              />
            ))}
          </div>

          {/* Submit Button - Centered */}
          <div className="flex justify-center mt-6">
            <Button gradientDuoTone="cyanToBlue" pill size="lg" type="submit">
              Submit Feedback
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
