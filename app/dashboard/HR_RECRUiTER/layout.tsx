'use client';

import React, { useState } from 'react';
import DynamicNav from './DynamicNav';

export default function HRRecruiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isNavExpanded, setIsNavExpanded] = useState(false);

  const handleNavExpandChange = (expanded: boolean) => {
    setIsNavExpanded(expanded);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DynamicNav onExpandChange={handleNavExpandChange} />
      <main className={`flex-1 ${isNavExpanded ? 'ml-64' : 'ml-20'} transition-all duration-300 ease-in-out`}>
        {children}
      </main>
    </div>
  );
} 