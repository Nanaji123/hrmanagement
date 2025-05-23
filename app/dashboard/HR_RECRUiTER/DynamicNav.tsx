'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  Calendar, 
  FileText, 
  UserCircle, 
  BarChart2,
  LogOut,
  Users as UserGroupIcon
} from 'lucide-react';

type UserRole = 'hr_manager' | 'hr_recruiter' | 'interviewer';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  role: UserRole;
}

const navItems: NavItem[] = [
  // HR Recruiter items
  {
    name: 'Dashboard',
    href: '/dashboard/HR_RECRUiTER',
    icon: LayoutDashboard,
    role: 'hr_recruiter'
  },
  {
    name: 'Candidate Management',
    href: '/dashboard/HR_RECRUiTER/Candidate_Management',
    icon: Users,
    role: 'hr_recruiter'
  },
  {
    name: 'Interview Panel',
    href: '/dashboard/HR_RECRUiTER/interview_panel',
    icon: UserGroupIcon,
    role: 'hr_recruiter'
  },
  // Interviewer items
  {
    name: 'Calendar',
    href: '/dashboard/HR_RECRUiTER/calendar',
    icon: Calendar,
    role: 'interviewer'
  },
  {
    name: 'Interview Management',
    href: '/dashboard/HR_RECRUiTER/interview_management',
    icon: FileText,
    role: 'interviewer'
  }
];

interface DynamicNavProps {
  onExpandChange?: (isExpanded: boolean) => void;
  userRole?: UserRole;
}

const DynamicNav: React.FC<DynamicNavProps> = ({ 
  onExpandChange, 
  userRole = 'hr_manager' 
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (onExpandChange) {
      onExpandChange(isExpanded);
    }
  }, [isExpanded, onExpandChange]);

  const handleMouseEnter = (): void => {
    setIsExpanded(true);
  };

  const handleMouseLeave = (): void => {
    setIsExpanded(false);
  };

  const filteredNavItems = navItems.filter(item => item.role === userRole);

  const getRoleTitle = (): string => {
    switch (userRole) {
      case 'hr_manager':
        return 'HR Manager';
      case 'hr_recruiter':
        return 'HR Recruiter';
      case 'interviewer':
        return 'Interviewer';
      default:
        return 'HR Portal';
    }
  };

  const handleLogout = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/auth/login');
  };

  return (
    <div
      className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-100 transition-all duration-300 ease-in-out z-50 shadow-sm ${
        isExpanded ? 'w-64' : 'w-20'
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ height: '100vh' }}
    >
      <div className="p-4 h-full overflow-y-auto">
        <div className="flex items-center justify-center mb-8 pt-4">
          <Briefcase className="h-6 w-6 text-emerald-600" />
          {isExpanded && (
            <span className="ml-3 text-xl font-semibold text-gray-900">{getRoleTitle()}</span>
          )}
        </div>
        <nav className="space-y-2">
          {filteredNavItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-600 border-l-4 border-emerald-500'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-emerald-600'
                } ${isExpanded ? 'space-x-3' : 'justify-center'}`}
              >
                <item.icon className="h-5 w-5" />
                {isExpanded && (
                  <span className="font-medium">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="mt-8">
          <button
            type="button"
            className={`flex items-center p-3 rounded-lg transition-all duration-200 w-full text-gray-600 hover:bg-gray-50 hover:text-red-600 ${
              isExpanded ? 'space-x-3' : 'justify-center'
            }`}
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            {isExpanded && (
              <span className="font-medium">Logout</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DynamicNav; 