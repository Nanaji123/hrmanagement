'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface SidebarProps {
  isCollapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed }) => {
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
    <div className={`h-screen bg-white border-r border-gray-100 fixed left-0 top-0 shadow-sm transition-all duration-300 ${
      isCollapsed ? 'w-20' : 'w-64'
    }`}>
      <div className={`p-4 flex items-center ${
        isCollapsed ? 'justify-center' : 'space-x-2'
      }`}>
        {!isCollapsed && (
          <h1 className="text-xl font-bold text-gray-900">HR Manager</h1>
        )}
         {isCollapsed && (
          <span className="text-xl text-emerald-600">💼</span>
         )}
      </div>
      <nav className="mt-8">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-emerald-600 rounded-lg transition-all duration-200 ${
              pathname === item.path ? 'bg-emerald-50 text-emerald-600 border-l-4 border-emerald-500' : ''
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

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const router = useRouter();

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Redirect to login page
    router.push('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-gray-100 fixed top-0 right-0 left-64 z-10 shadow-sm">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar} 
            className="p-2 mr-4 text-gray-600 hover:text-emerald-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
          >
            ☰
          </button>
          <h2 className="text-xl font-semibold text-gray-900">Hiring Manager Dashboard</h2>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-gray-50 rounded-lg transition-colors duration-200">
            🔔
          </button>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center">
                <span className="text-emerald-600 font-medium">JD</span>
              </div>
              <span className="text-sm font-medium text-gray-900">John Doe</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-50 rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>
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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-gray-50">
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