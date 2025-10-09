// src/components/admin/StatCard.jsx
import React from 'react';

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow flex items-center space-x-4">
    <div className="text-3xl bg-blue-100 text-blue-600 p-3 rounded-full">{icon}</div>
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

export default StatCard;