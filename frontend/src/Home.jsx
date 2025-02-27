import React, { useState } from 'react';
import { Navbar, Button, TextInput, Textarea } from 'flowbite-react';
import { HiArrowRight } from 'react-icons/hi';
import { FaStar } from 'react-icons/fa';
export default function Home () {
  const [feedbacks, setFeedbacks] = useState([
    { name: "John Doe", email: "john@example.com", feedback: "Great paint! It lasted through a heavy storm.", rating: 5 },
    { name: "Jane Smith", email: "jane@example.com", feedback: "The colors are very vibrant, love it!", rating: 4 },
    { name: "Michael Brown", email: "michael@example.com", feedback: "Eco-friendly and easy to apply.", rating: 5 }
  ]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newFeedback = { name, email, feedback, rating };
    setFeedbacks([...feedbacks, newFeedback]);
    setName('');
    setEmail('');
    setFeedback('');
    setRating(0);
  };
  return (
    <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-30"
        ></div>
        <div className="text-center text-white px-4 z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-fade-in">
            Waterproof Paint for the Outdoors
          </h1>
          <p className="text-xl md:text-2xl mb-8 animate-fade-in-up">
            Protect and beautify your outdoor spaces with Tylac's premium waterproof paint.
          </p>
          <Button gradientDuoTone="cyanToBlue" pill size="lg" className="animate-bounce">
            Explore Products
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Why Choose Tylac?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6 bg-gray-100 rounded-lg hover:shadow-lg transition-shadow duration-300">
              <img
                src="https://images.unsplash.com/photo-1598928636135-d146006ff4be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Superior Protection"
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">Superior Protection</h3>
              <p className="text-gray-600">
                Our paint provides unmatched protection against rain, UV rays, and extreme weather.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6 bg-gray-100 rounded-lg hover:shadow-lg transition-shadow duration-300">
              <img
                src="https://images.unsplash.com/photo-1618220179428-22790b461013?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2127&q=80"
                alt="Vibrant Colors"
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">Vibrant Colors</h3>
              <p className="text-gray-600">
                Choose from a wide range of colors that stay vibrant for years.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6 bg-gray-100 rounded-lg hover:shadow-lg transition-shadow duration-300">
              <img
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2127&q=80"
                alt="Eco-Friendly"
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">Eco-Friendly</h3>
              <p className="text-gray-600">
                Made with environmentally friendly materials, safe for your family and the planet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-16 bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="container mx-auto px-6 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your Space?
          </h2>
          <p className="text-xl mb-8">
            Discover the power of Tylac's waterproof paint today.
          </p>
          <Button gradientDuoTone="cyanToBlue" pill size="lg">
            Shop Now
          </Button>
        </div>
      </section>

      {/* Feedbacks Display Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Customer Feedbacks
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {feedbacks.map((fb, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{fb.name}</h3>
                <p className="text-gray-600 mb-2">{fb.email}</p>
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < fb.rating ? "text-yellow-400" : "text-gray-300"} />
                  ))}
                </div>
                <p className="text-gray-600">{fb.feedback}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feedback Form Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            We'd Love to Hear From You
          </h2>
          <form className="max-w-2xl mx-auto" onSubmit={handleSubmit}>
            <div className="mb-6">
              <TextInput id="name" type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="mb-6">
              <TextInput id="email" type="email" placeholder="Your Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="mb-6">
              <Textarea id="feedback" placeholder="Your Feedback" rows={5} value={feedback} onChange={(e) => setFeedback(e.target.value)} required />
            </div>
            {/* Star Rating */}
            <div className="mb-6 flex justify-center">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={i < rating ? "text-yellow-400 cursor-pointer" : "text-gray-300 cursor-pointer"} onClick={() => setRating(i + 1)} />
              ))}
            </div>
            <div className="text-center">
              <Button gradientDuoTone="cyanToBlue" pill size="lg" type="submit">
                Submit Feedback
              </Button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};