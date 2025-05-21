'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  isCollapsed: boolean;
}

interface HeaderProps {
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed }) => {
  const pathname = usePathname();
  
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard/interviewer', icon: '📊' },
    { name: 'Interviews', path: '/dashboard/interviewer/interviews', icon: '📅' },
    { name: 'Feedback', path: '/dashboard/interviewer/feedback', icon: '📋' },
    { name: 'Profile', path: '/dashboard/interviewer/profile', icon: '👤' },
  ];

  return (
    <div className={`h-screen bg-gradient-to-b from-[#6C7A89] via-[#7C83FD] to-[#E0E7FF] border-r border-[#E0E7FF] fixed left-0 top-0 shadow-xl transition-all duration-300 ${
      isCollapsed ? 'w-20' : 'w-64'
    }`}>
      <div className={`p-4 flex items-center ${
        isCollapsed ? 'justify-center' : 'space-x-2'
      }`}>
        {!isCollapsed && (
          <h1 className="text-2xl font-bold text-[#2D3748] tracking-wide">Interviewer</h1>
        )}
        {isCollapsed && (
          <span className="text-2xl text-[#2D3748]">👨‍💼</span>
        )}
      </div>
      <nav className="mt-8">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`flex items-center px-4 py-3 text-[#2D3748] hover:bg-[#B8E1DD]/40 rounded-lg transition-all duration-200 ${
              pathname === item.path ? 'bg-[#FFD6C0]/60 border-l-4 border-[#7C83FD]' : ''
            } ${
              isCollapsed ? 'justify-center' : 'space-x-3'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            {!isCollapsed && <span className="font-medium">{item.name}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
};

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="h-16 bg-gradient-to-r from-[#E0E7FF] via-[#F0F4FF] to-[#B8E1DD] border-b border-[#E0E7FF] fixed top-0 right-0 left-64 z-10 shadow-md backdrop-blur-md">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center">
          <button onClick={toggleSidebar} className="p-2 mr-4 text-[#2D3748] hover:text-[#7C83FD]">
            ☰
          </button>
          <h2 className="text-xl font-semibold text-[#2D3748] drop-shadow">Interviewer Dashboard</h2>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 text-[#2D3748] hover:text-[#7C83FD]">
            🔔
          </button>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-[#2D3748]">John Doe</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default function InterviewerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0F4FF] via-[#E0E7FF] to-[#B8E1DD] relative overflow-hidden">
      <Sidebar isCollapsed={isSidebarCollapsed} />
      <Header toggleSidebar={toggleSidebar} />
      <main className={`pt-16 relative z-10 transition-all duration-300 ${
        isSidebarCollapsed ? 'ml-20' : 'ml-64'
      }`}>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
} 