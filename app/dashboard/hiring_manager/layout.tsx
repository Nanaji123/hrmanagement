'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname();
  
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard/hiring_manager', icon: '📊' },
    { name: 'Job Postings', path: '/dashboard/hiring_manager/jobs', icon: '📝' },
    { name: 'Candidates', path: '/dashboard/hiring_manager/candidates', icon: '👥' },
    { name: 'Interviews', path: '/dashboard/hiring_manager/interviews', icon: '📅' },
    { name: 'Feedback', path: '/dashboard/hiring_manager/feedback', icon: '📋' },
    { name: 'Team', path: '/dashboard/hiring_manager/team', icon: '👥' },
    { name: 'Analytics', path: '/dashboard/hiring_manager/analytics', icon: '📈' },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 fixed left-0 top-0">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-800">HR Manager</h1>
      </div>
      <nav className="mt-8">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 ${
              pathname === item.path ? 'bg-gray-100 border-l-4 border-blue-500' : ''
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};

const Header = () => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 fixed top-0 right-0 left-64 z-10">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold text-gray-800">Hiring Manager Dashboard</h2>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-600 hover:text-gray-800">
            🔔
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gray-300"></div>
            <span className="text-sm font-medium text-gray-700">John Doe</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default function HiringManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header />
      <main className="ml-64 pt-16">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
} 