'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Search,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
  UserCircle
} from 'lucide-react';

interface HeaderProps {
  isNavExpanded: boolean;
}

const Header: React.FC<HeaderProps> = ({ isNavExpanded }) => {
  const router = useRouter();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/auth/login');
  };

  return (
    <header className={`h-16 bg-[#0e101c] border-b border-[#2e314d] fixed top-0 right-0 z-10 shadow-[0_0_20px_#00f7ff40] transition-all duration-300 ${
      isNavExpanded ? 'left-64' : 'left-20'
    }`}>
      <div className="flex items-center justify-end h-full px-6">
        {/* Right section - Search, Notifications and Profile */}
        <div className="flex items-center space-x-4 text-white">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-64 pl-4 pr-10 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-emerald-500 focus:ring-emerald-500"
            />
            <Search className="absolute right-4 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-gray-50 rounded-lg transition-colors duration-200 relative focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <Bell className="h-6 w-6" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-100 py-2">
                <div className="px-4 py-2 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {/* Notification items */}
                  <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                    <p className="text-sm font-medium text-gray-900">New interview scheduled</p>
                    <p className="text-xs text-gray-700">2 minutes ago</p>
                  </div>
                  {/* Add more notification items */}
                </div>
              </div>
            )}
          </div>

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <div className="h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center">
                <span className="text-emerald-600 font-medium">JD</span>
              </div>
              <span className="text-sm font-medium text-gray-900">John Doe</span>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2">
                <Link href="/dashboard/interviewer/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-emerald-600">
                  <UserCircle className="h-4 w-4 mr-2" />
                  Profile
                </Link>
                <Link href="/dashboard/interviewer/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-emerald-600">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 