import React from 'react';
import { Card, List } from 'flowbite-react';

export default function FAQ() {
  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Frequently Asked Questions (FAQ)
        </h1>

        {/* FAQ List */}
        <Card>
          <h2 className="text-2xl font-bold mb-4">General Questions</h2>
          <List>
            <List.Item>
              <strong>What surfaces can I use Tylac Waterproof Paint on?</strong>
              <p className="text-gray-600">
                Tylac Waterproof Paint is suitable for outdoor surfaces such as wood, concrete,
                metal, and masonry. It is not recommended for use on flexible surfaces like rubber
                or vinyl.
              </p>
            </List.Item>
            <List.Item>
              <strong>How long does the paint take to dry?</strong>
              <p className="text-gray-600">
                The paint typically dries to the touch in 1-2 hours, but it is recommended to wait
                24 hours before exposing it to moisture or heavy use.
              </p>
            </List.Item>
            <List.Item>
              <strong>Can I apply the paint in cold weather?</strong>
              <p className="text-gray-600">
                For best results, apply the paint in temperatures between 50°F and 90°F. Avoid
                painting in freezing or extremely hot conditions.
              </p>
            </List.Item>
          </List>

          <h2 className="text-2xl font-bold mt-8 mb-4">Application Questions</h2>
          <List>
            <List.Item>
              <strong>Do I need to prime the surface before painting?</strong>
              <p className="text-gray-600">
                Priming is optional but recommended for best results, especially on porous or uneven
                surfaces.
              </p>
            </List.Item>
            <List.Item>
              <strong>How many coats should I apply?</strong>
              <p className="text-gray-600">
                For optimal protection, apply at least two thin, even coats. Allow the first coat to
                dry completely before applying the second.
              </p>
            </List.Item>
            <List.Item>
              <strong>Can I use a sprayer to apply the paint?</strong>
              <p className="text-gray-600">
                Yes, Tylac Waterproof Paint can be applied using a brush, roller, or sprayer. Ensure
                the sprayer is compatible with water-based paints.
              </p>
            </List.Item>
          </List>

          <h2 className="text-2xl font-bold mt-8 mb-4">Safety Questions</h2>
          <List>
            <List.Item>
              <strong>Is the paint safe for children and pets?</strong>
              <p className="text-gray-600">
                Once fully dried, the paint is safe. However, keep children and pets away from wet
                paint and ensure proper ventilation during application.
              </p>
            </List.Item>
            <List.Item>
              <strong>What should I do if I get paint on my skin?</strong>
              <p className="text-gray-600">
                Wash the affected area immediately with soap and water. Avoid contact with eyes and
                mucous membranes.
              </p>
            </List.Item>
            <List.Item>
              <strong>How should I dispose of leftover paint?</strong>
              <p className="text-gray-600">
                Dispose of leftover paint and containers according to local regulations. Do not pour
                paint down drains or into the environment.
              </p>
            </List.Item>
          </List>
        </Card>
      </div>
    </div>
  );
}