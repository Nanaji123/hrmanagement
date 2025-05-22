'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface NavItem {
  name: string;
  href: string;
  icon: string;
}

const navItems: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard/HR_RECRUiTER',
    icon: '📊'
  },
  {
    name: 'Candidate Management',
    href: '/dashboard/HR_RECRUiTER/Candidate_Management',
    icon: '👥'
  },
  {
    name: 'Interview Schedule',
    href: '/dashboard/HR_RECRUiTER/interview_sch',
    icon: '📅'
  }
];

interface DynamicNavProps {
  onExpandChange?: (isExpanded: boolean) => void;
}

const DynamicNav = ({ onExpandChange }: DynamicNavProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    onExpandChange?.(isExpanded);
  }, [isExpanded, onExpandChange]);

  const handleMouseEnter = () => {
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    setIsExpanded(false);
  };

  return (
    <div
      className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-blue-50 to-blue-100 transition-all duration-300 ease-in-out z-50 shadow-md ${
        isExpanded ? 'w-64' : 'w-20'
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ height: '100vh' }}
    >
      <div className="p-4 h-full overflow-y-auto">
        <div className="flex items-center justify-center mb-8 pt-4">
          <span className="text-3xl bg-white p-2 rounded-lg shadow-sm">👥</span>
          {isExpanded && (
            <span className="ml-3 text-xl font-semibold text-blue-700">HR Recruiter</span>
          )}
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-100 text-blue-700 shadow-sm'
                    : 'text-blue-600 hover:bg-blue-50 hover:shadow-sm'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                {isExpanded && (
                  <span className="ml-3 font-medium">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="mt-8">
          <button
            className={`flex items-center p-3 rounded-lg transition-all duration-200 w-full text-red-600 hover:bg-red-50 hover:shadow-sm`}
            onClick={() => {
              // TODO: Implement more robust logout logic if needed (e.g., server-side invalidation)
              localStorage.removeItem('authToken'); // Remove the authentication token from localStorage
              router.push('/login'); // Redirect to the login page
            }}
          >
            <span className="text-xl">➡️</span>
            {isExpanded && (
              <span className="ml-3 font-medium">Logout</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DynamicNav; 