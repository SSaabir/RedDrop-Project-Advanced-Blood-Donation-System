import React from 'react';
import { Card } from 'flowbite-react';

export default function Terms() {
  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Terms & Conditions
        </h1>

        {/* Terms Content */}
        <Card>
          <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-600 mb-4">
            By accessing or using this website, you agree to comply with and be bound by these Terms
            & Conditions. If you do not agree, please do not use this website.
          </p>

          <h2 className="text-2xl font-bold mb-4">2. Use of the Website</h2>
          <p className="text-gray-600 mb-4">
            You agree to use this website only for lawful purposes and in a manner that does not
            infringe the rights of others or restrict their use of the website.
          </p>

          <h2 className="text-2xl font-bold mb-4">3. Intellectual Property</h2>
          <p className="text-gray-600 mb-4">
            All content on this website, including text, graphics, logos, and images, is the
            property of Tylac and is protected by intellectual property laws. Unauthorized use is
            prohibited.
          </p>

          <h2 className="text-2xl font-bold mb-4">4. Limitation of Liability</h2>
          <p className="text-gray-600 mb-4">
            Tylac is not liable for any damages arising from the use of this website or the
            information provided. Use the website at your own risk.
          </p>

          <h2 className="text-2xl font-bold mb-4">5. Changes to Terms</h2>
          <p className="text-gray-600 mb-4">
            Tylac reserves the right to modify these Terms & Conditions at any time. Your continued
            use of the website constitutes acceptance of the updated terms.
          </p>

          <h2 className="text-2xl font-bold mb-4">6. Governing Law</h2>
          <p className="text-gray-600 mb-4">
            These Terms & Conditions are governed by the laws of the state of California, USA. Any
            disputes will be resolved in the courts of California.
          </p>
        </Card>
      </div>
    </div>
  );
}