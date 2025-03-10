// HomePage.jsx

import React from 'react';

function HomePage() {
  return (
    <div className="bg-gray-100 min-h-screen p-6">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-6">NGO Connect Dashboard</h1>

      {/* Top Section: Carousel + Recent Achievements */}
      <div className="md:flex md:space-x-4">
        {/* Carousel Placeholder */}
        <div className="bg-white p-4 rounded-md shadow-md mb-4 md:mb-0 md:w-2/3">
          <h2 className="text-xl font-semibold mb-2">Upcoming Drives</h2>
          <div className="bg-gray-200 h-40 flex items-center justify-center text-gray-500">
            {/* Replace this with a real carousel library or component */}
            Carousel goes here
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="bg-white p-4 rounded-md shadow-md md:w-1/3">
          <h2 className="text-xl font-semibold mb-2">Recent Achievements</h2>
          <ul className="list-disc list-inside text-gray-600">
            <li>Achievement #1</li>
            <li>Achievement #2</li>
            <li>Achievement #3</li>
          </ul>
        </div>
      </div>

      {/* Bottom Section: Dashboard Actions */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Dashboard Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <button className="bg-blue-500 text-white py-2 px-4 rounded shadow hover:bg-blue-600">
            Organise an Event
          </button>
          <button className="bg-green-500 text-white py-2 px-4 rounded shadow hover:bg-green-600">
            View NGO Activity
          </button>
          <button className="bg-pink-500 text-white py-2 px-4 rounded shadow hover:bg-pink-600">
            Grant Applications
          </button>
          <button className="bg-orange-500 text-white py-2 px-4 rounded shadow hover:bg-orange-600">
            Emergency Requests
          </button>
          <button className="bg-purple-500 text-white py-2 px-4 rounded shadow hover:bg-purple-600">
            Participate in Initiative
          </button>
          <button className="bg-teal-500 text-white py-2 px-4 rounded shadow hover:bg-teal-600">
            Support Center
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
