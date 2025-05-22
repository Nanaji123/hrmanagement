'use client';

import React, { useState } from 'react';
import DynamicNav from './HR_RECRUiTER/DynamicNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isNavExpanded, setIsNavExpanded] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <DynamicNav onExpandChange={setIsNavExpanded} />
      <div 
        className={`transition-all duration-300 ease-in-out ${
          isNavExpanded ? 'ml-64' : 'ml-20'
        }`}
      >
        <main className="p-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-blue-50">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 