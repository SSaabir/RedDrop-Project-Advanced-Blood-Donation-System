import React, { useState, useEffect } from 'react';
import { Card, TextInput, Textarea, Button } from 'flowbite-react';
import { FaStar } from 'react-icons/fa';
import FeedbackBG from '../assets/FeedbackBG.jpg';

export default function Feedback() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [feedbacks, setFeedbacks] = useState([]); // State to store fetched feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch feedbacks when component mounts
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/feedback'); // Adjust URL as needed
        if (!response.ok) throw new Error('Failed to load feedbacks');
        const data = await response.json();
        setFeedbacks(data);
      } catch (err) {
        setError('Failed to load feedbacks');
      }
    };
    fetchFeedbacks();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const feedbackData = { name, email, feedback, rating };

    try {
      const response = await fetch('http://localhost:5000/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackData),
      }); // Adjust URL
      if (!response.ok) throw new Error('Failed to submit feedback');
      const newFeedback = await response.json();
      setFeedbacks((prev) => [...prev, newFeedback.feedback]); // Add new feedback to list
      setName('');
      setEmail('');
      setFeedback('');
      setRating(0);
      alert('Feedback submitted successfully!');
    } catch (err) {
      setError(err.message || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
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
        {feedbacks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {feedbacks.map((fb, index) => (
              <Card key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{fb.name}</h3>
                <p className="text-gray-600 mb-2">{fb.email}</p>
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={i < fb.rating ? 'text-yellow-400' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <p className="text-gray-600">{fb.feedback}</p>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">No feedback available yet.</p>
        )}

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
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
            />
          </div>

          {/* Star Rating */}
          <div className="mb-6 flex justify-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={
                  i < rating ? 'text-yellow-400 cursor-pointer' : 'text-gray-300 cursor-pointer'
                }
                onClick={() => !loading && setRating(i + 1)} // Disable clicking when loading
              />
            ))}
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          {/* Submit Button - Centered */}
          <div className="flex justify-center mt-6">
            <Button
              gradientDuoTone="cyanToBlue"
              pill
              size="lg"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}