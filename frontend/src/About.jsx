import React from 'react';

export default function AboutPageBody () {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523217582562-09d0def993a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80')] bg-cover bg-center opacity-30"
        ></div>
        <div className="text-center text-white px-4 z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-fade-in">
            About Tylac
          </h1>
          <p className="text-xl md:text-2xl mb-8 animate-fade-in-up">
            Pioneering waterproof paint solutions for a brighter, more durable future.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="animate-fade-in-left">
              <img
                src="https://images.unsplash.com/photo-1600585152220-90363fe7e115?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Our Story"
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
            {/* Content */}
            <div className="animate-fade-in-right">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
              <p className="text-gray-600 mb-4">
                Tylac was founded in 2010 with a simple mission: to create the most durable and
                environmentally friendly waterproof paint for outdoor spaces. Our journey began in a
                small garage, where our founders experimented with innovative formulas to combat the
                challenges of weathering and fading.
              </p>
              <p className="text-gray-600">
                Today, Tylac is a trusted name in the industry, known for its vibrant colors,
                superior protection, and commitment to sustainability. We continue to push
                boundaries, ensuring our products meet the highest standards of quality and
                performance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission and Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Our Mission and Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Mission */}
            <div className="text-center p-6 bg-white rounded-lg hover:shadow-lg transition-shadow duration-300">
              <div className="text-4xl text-blue-500 mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Our Mission</h3>
              <p className="text-gray-600">
                To provide innovative, eco-friendly waterproof paint solutions that protect and
                beautify outdoor spaces for generations.
              </p>
            </div>

            {/* Quality */}
            <div className="text-center p-6 bg-white rounded-lg hover:shadow-lg transition-shadow duration-300">
              <div className="text-4xl text-purple-500 mb-4">🏆</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Quality</h3>
              <p className="text-gray-600">
                We are committed to delivering products that exceed industry standards for durability
                and performance.
              </p>
            </div>

            {/* Sustainability */}
            <div className="text-center p-6 bg-white rounded-lg hover:shadow-lg transition-shadow duration-300">
              <div className="text-4xl text-green-500 mb-4">🌍</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Sustainability</h3>
              <p className="text-gray-600">
                Our products are designed with the planet in mind, using eco-friendly materials and
                processes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Team Member 1 */}
            <div className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow duration-300">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1064&q=80"
                alt="Team Member 1"
                className="w-32 h-32 mx-auto rounded-full mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Jane Doe</h3>
              <p className="text-gray-600">CEO & Founder</p>
            </div>

            {/* Team Member 2 */}
            <div className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow duration-300">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80"
                alt="Team Member 2"
                className="w-32 h-32 mx-auto rounded-full mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">John Smith</h3>
              <p className="text-gray-600">Head of Product Development</p>
            </div>

            {/* Team Member 3 */}
            <div className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow duration-300">
              <img
                src="https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80"
                alt="Team Member 3"
                className="w-32 h-32 mx-auto rounded-full mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Emily Clark</h3>
              <p className="text-gray-600">Sustainability Lead</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
