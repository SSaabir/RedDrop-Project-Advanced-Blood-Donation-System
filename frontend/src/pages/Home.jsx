import React, { useState } from 'react';
import { Navbar, Button, TextInput, Textarea } from 'flowbite-react';
import { HiArrowRight } from 'react-icons/hi';
import { FaStar } from 'react-icons/fa';
import Homebg from '../assets/Homebg.jpg'
import Aboutbg from '../assets/Aboutbg.jpg'  
import About2 from '../assets/About2.jpg' 
import ab3 from '../assets/ab3.jpg' 
import ab4 from '../assets/ab4.jpg' 
import ab5 from '../assets/ab5.jpg' 
import Fund from '../assets/Fund.jpg'
import SupportIcon from '../components/SupportIcon'; // Import the SupportIcon component

export default function Home() {
  // Removed unused state and function
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-100"
          style={{ backgroundImage: `url(${About2})` }}
        ></div>
        <div className="text-center text-white px-4 z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-fade-in">
            "Save Lives, One Drop at a Time!"
          </h1>
          <p className="text-xl md:text-2xl mb-8 animate-fade-in-up">
            Your blood donation can give someone a second chance at life. Sign up today, find a nearby donation center, and become a hero in just a few minutes. Every drop counts!
          </p>
          <div className="flex justify-center">
            
          </div>
        </div>
      </section>

      {/* Mission and Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Our Vision, Mission and Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg hover:shadow-lg transition-shadow duration-300">
              <div className="text-4xl text-blue-500 mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Our Vision</h3>
              <p className="text-gray-600">
                Create a world where no life is lost due to a lack of access to safe and sufficient blood. We envision a global community united by compassion, where blood donation becomes a simple, accessible, and life-saving act for everyone.
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg hover:shadow-lg transition-shadow duration-300">
              <div className="text-4xl text-purple-500 mb-4">🏆</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Mission</h3>
              <p className="text-gray-600">
                We are committed to building a reliable and efficient blood donation ecosystem by encouraging regular donations, simplifying the donation process, and leveraging technology. Through partnerships with healthcare providers and communities.
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg hover:shadow-lg transition-shadow duration-300">
              <div className="text-4xl text-green-500 mb-4">🌍</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Core Values</h3>
              <p className="text-gray-600">
                We uphold the highest standards of integrity, prioritizing safety, transparency, and trust in every step of the blood donation process. Our focus is on creating meaningful impact, empowering donors, and ensuring every drop makes a difference.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-100"
          style={{ backgroundImage: `url(${Aboutbg})` }}
        ></div>
        <div className="text-center text-white px-4 z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-fade-in">
            About RedDrop
          </h1>
          <p className="text-xl md:text-2xl mb-8 animate-fade-in-up">
            DONATE YOUR BLOOD AND INSPIRE OTHERS TO DONATE
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-left">
              <img src={Homebg} alt="Our Story" className="w-full h-auto rounded-lg shadow-lg" />
            </div>
            <div className="animate-fade-in-right">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
              <p className="text-gray-600 mb-4">
                At RedDrop, we are dedicated to saving lives by connecting donors with those in urgent need. Our mission is to create a seamless and efficient platform where individuals can donate blood, find nearby donation centers, and request urgent blood support. We believe that every drop counts, and through technology, we aim to make the donation process simple, accessible, and impactful.
              </p>
              <p className="text-gray-600">
                With a commitment to transparency and reliability, our platform ensures real-time updates, secure data handling, and a user-friendly experience. Whether you are a donor looking to give the gift of life or a recipient in need, we are here to bridge the gap and strengthen the life-saving network of blood donation. Together, we can make a difference—one donation at a time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Why Choose RedDrop?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-100 rounded-lg hover:shadow-lg transition-shadow duration-300">
              <img src={ab3} alt="Superior Protection" className="w-full h-48 object-cover rounded-t-lg" />
              <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">Superior Protection</h3>
              <p className="text-gray-600">
                RedDrop ensures your blood donation saves lives by connecting you to patients in urgent need across hospitals and healthcare centers.
              </p>
            </div>
            <div className="text-center p-6 bg-gray-100 rounded-lg hover:shadow-lg transition-shadow duration-300">
              <img src={ab4} alt="Vibrant Colors" className="w-full h-48 object-cover rounded-t-lg" />
              <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">Vibrant Colors</h3>
              <p className="text-gray-600">
                Our platform offers a seamless, user-friendly experience, from finding donation centers to tracking your impact, making giving simple and rewarding.
              </p>
            </div>
            <div className="text-center p-6 bg-gray-100 rounded-lg hover:shadow-lg transition-shadow duration-300">
              <img src={ab5} alt="Eco-Friendly" className="w-full h-48 object-cover rounded-t-lg" />
              <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">Eco-Friendly</h3>
              <p className="text-gray-600">
                Partnering with trusted blood banks, we guarantee safety, reliability, and transparency, so your donation makes a real, life-changing difference.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
     <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
     <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      {/* Text section on the left in larger screens */}
      <div className="order-2 md:order-1 animate-fade-in-left text-justify">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
        <p className="text-gray-600 mb-4">
          At RedDrop, we are dedicated to saving lives by connecting donors with those in urgent need. Our mission is to create a seamless and efficient platform where individuals can donate blood, find nearby donation centers, and request urgent blood support. We believe that every drop counts, and through technology, we aim to make the donation process simple, accessible, and impactful.
        </p>
        <p className="text-gray-600">
          With a commitment to transparency and reliability, our platform ensures real-time updates, secure data handling, and a user-friendly experience. Whether you are a donor looking to give the gift of life or a recipient in need, we are here to bridge the gap and strengthen the life-saving network of blood donation. Together, we can make a difference—one donation at a time.
        </p>
      </div>

      {/* Image section on the right in larger screens */}
      <div className="order-1 md:order-2 animate-fade-in-right">
        <img src={Fund} alt="Our Story" className="w-full h-auto rounded-lg shadow-lg" />
        </div>
      </div>
     </div>
   </section>

      <SupportIcon />
    </div>
  );
}