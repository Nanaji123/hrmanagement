'use client';

import React, { useState, useEffect } from 'react';
import DynamicNav from './HR_RECRUiTER/DynamicNav';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const pathname = usePathname();

  // Determine user role based on the current path
  const getUserRole = () => {
    if (pathname.includes('/hiring_manager')) {
      return 'hr_manager';
    } else if (pathname.includes('/HR_RECRUiTER')) {
      return 'hr_recruiter';
    } else if (pathname.includes('/interviewer')) {
      return 'interviewer';
    }
    return 'hr_manager'; // Default role
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DynamicNav onExpandChange={setIsNavExpanded} userRole={getUserRole()} />
      <div 
        className={`transition-all duration-300 ease-in-out ${
          isNavExpanded ? 'ml-64' : 'ml-20'
        }`}
      >
        <main className="p-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 