import React from 'react';
import { Card, List } from 'flowbite-react';

export default function FAQ() {
  return (
    <div className="py-16 bg-gray-50" style={{
      backgroundImage: "url('/images/blood-donation-bg.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}>
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-center text-red-700 mb-8">
          Frequently Asked Questions (FAQ)
        </h1>

        {/* FAQ List */}
        <Card className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-red-600">General Questions</h2>
          <List className="list-disc pl-5">
            <List.Item>
              <strong>Who can donate blood?</strong>
              <p className="text-gray-600">
                Most healthy adults aged 18-65 can donate blood. Eligibility depends on factors such as weight,
                recent travel, and medical history.
              </p>
            </List.Item>
            <List.Item>
              <strong>How often can I donate blood?</strong>
              <p className="text-gray-600">
                Whole blood donations can be made every 8 weeks (56 days), while platelet donations can be made every 2 weeks.
              </p>
            </List.Item>
            <List.Item>
              <strong>Is blood donation safe?</strong>
              <p className="text-gray-600">
                Yes, donating blood is a safe process. New, sterile equipment is used for each donor, ensuring no risk of infection.
              </p>
            </List.Item>
          </List>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-red-600">Donation Process</h2>
          <List className="list-disc pl-5">
            <List.Item>
              <strong>How long does the donation process take?</strong>
              <p className="text-gray-600">
                The entire process takes about 45-60 minutes, but the actual blood donation only takes about 10 minutes.
              </p>
            </List.Item>
            <List.Item>
              <strong>What should I do before donating blood?</strong>
              <p className="text-gray-600">
                Stay hydrated, eat a healthy meal, and avoid alcohol or caffeine before donating.
              </p>
            </List.Item>
            <List.Item>
              <strong>What happens after I donate blood?</strong>
              <p className="text-gray-600">
                You will be given refreshments and asked to rest for a few minutes before resuming normal activities.
                Avoid heavy exercise for the rest of the day.
              </p>
            </List.Item>
          </List>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-red-600">Health & Safety</h2>
          <List className="list-disc pl-5">
            <List.Item>
              <strong>Are there any side effects of donating blood?</strong>
              <p className="text-gray-600">
                Some donors may experience mild dizziness or bruising at the injection site, but these effects are temporary.
              </p>
            </List.Item>
            <List.Item>
              <strong>Can I donate blood if I have a cold or flu?</strong>
              <p className="text-gray-600">
                No, you must be in good health and free of infections to donate blood.
              </p>
            </List.Item>
            <List.Item>
              <strong>How is donated blood used?</strong>
              <p className="text-gray-600">
                Donated blood is used for surgeries, accident victims, cancer treatments, and patients with blood disorders.
              </p>
            </List.Item>
          </List>
        </Card>
      </div>
    </div>
  );
}
  