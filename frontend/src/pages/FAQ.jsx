import React from "react";
import { Card, Accordion, Button } from "flowbite-react";

export default function FAQ() {
  const faqSections = [
    {
      title: "General Questions",
      items: [
        {
          question: "Who can donate blood?",
          answer:
            "Most healthy adults aged 18-65 can donate blood. Eligibility depends on factors such as weight, recent travel, and medical history.",
        },
        {
          question: "How often can I donate blood?",
          answer:
            "Whole blood donations can be made every 8 weeks (56 days), while platelet donations can be made every 2 weeks.",
        },
        {
          question: "Is blood donation safe?",
          answer:
            "Yes, donating blood is a safe process. New, sterile equipment is used for each donor, ensuring no risk of infection.",
        },
      ],
    },
    {
      title: "Donation Process",
      items: [
        {
          question: "How long does the donation process take?",
          answer:
            "The entire process takes about 45-60 minutes, but the actual blood donation only takes about 10 minutes.",
        },
        {
          question: "What should I do before donating blood?",
          answer:
            "Stay hydrated, eat a healthy meal, and avoid alcohol or caffeine before donating.",
        },
        {
          question: "What happens after I donate blood?",
          answer:
            "You will be given refreshments and asked to rest for a few minutes before resuming normal activities. Avoid heavy exercise for the rest of the day.",
        },
      ],
    },
    {
      title: "Health & Safety",
      items: [
        {
          question: "Are there any side effects of donating blood?",
          answer:
            "Some donors may experience mild dizziness or bruising at the injection site, but these effects are temporary.",
        },
        {
          question: "Can I donate blood if I have a cold or flu?",
          answer:
            "No, you must be in good health and free of infections to donate blood.",
        },
        {
          question: "How is donated blood used?",
          answer:
            "Donated blood is used for surgeries, accident victims, cancer treatments, and patients with blood disorders.",
        },
      ],
    },
  ];

  return (
    <div
      className="py-16 bg-gray-50 min-h-screen"
      style={{
        backgroundImage: "url('/images/blood-donation-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-center text-red-700 mb-8">
          Frequently Asked Questions (FAQ)
        </h1>

        {/* FAQ Content */}
        <Card className="bg-white shadow-lg rounded-lg border border-gray-200">
          <Accordion flush>
            {faqSections.map((section, index) => (
              <Accordion.Panel key={index}>
                <Accordion.Title className="text-xl font-semibold text-red-700 hover:text-red-800 focus:ring-red-300">
                  {section.title}
                </Accordion.Title>
                <Accordion.Content>
                  <div className="space-y-4">
                    {section.items.map((item, idx) => (
                      <div key={idx}>
                        <strong className="text-gray-800">{item.question}</strong>
                        <p className="text-gray-600 mt-1">{item.answer}</p>
                      </div>
                    ))}
                  </div>
                </Accordion.Content>
              </Accordion.Panel>
            ))}
          </Accordion>

          {/* Back Button */}
          <div className="mt-6 flex justify-center">
            <Button
              gradientDuoTone="redToPink"
              onClick={() => window.history.back()}
              className="w-40"
            >
              Back
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}