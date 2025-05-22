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
  LogOut
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  role: 'hr_manager' | 'hr_recruiter' | 'interviewer';
}

const navItems: NavItem[] = [
  // HR Manager items
  {
    name: 'Dashboard',
    href: '/dashboard/hiring_manager',
    icon: LayoutDashboard,
    role: 'hr_manager'
  },
  {
    name: 'Job Postings',
    href: '/dashboard/hiring_manager/jobs',
    icon: Briefcase,
    role: 'hr_manager'
  },
  {
    name: 'Candidates',
    href: '/dashboard/hiring_manager/candidates',
    icon: Users,
    role: 'hr_manager'
  },
  {
    name: 'Interviews',
    href: '/dashboard/hiring_manager/interviews',
    icon: Calendar,
    role: 'hr_manager'
  },
  {
    name: 'Feedback',
    href: '/dashboard/hiring_manager/feedback',
    icon: FileText,
    role: 'hr_manager'
  },
  {
    name: 'Team',
    href: '/dashboard/hiring_manager/team',
    icon: UserCircle,
    role: 'hr_manager'
  },
  {
    name: 'Analytics',
    href: '/dashboard/hiring_manager/analytics',
    icon: BarChart2,
    role: 'hr_manager'
  },
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
    name: 'Interview Schedule',
    href: '/dashboard/HR_RECRUiTER/interview_sch',
    icon: Calendar,
    role: 'hr_recruiter'
  },
  // Interviewer items
  {
    name: 'Dashboard',
    href: '/dashboard/interviewer',
    icon: LayoutDashboard,
    role: 'interviewer'
  },
  {
    name: 'My Interviews',
    href: '/dashboard/interviewer/interviews',
    icon: Calendar,
    role: 'interviewer'
  },
  {
    name: 'Feedback',
    href: '/dashboard/interviewer/feedback',
    icon: FileText,
    role: 'interviewer'
  },
  {
    name: 'Candidates',
    href: '/dashboard/interviewer/candidates',
    icon: Users,
    role: 'interviewer'
  },
  {
    name: 'Schedule',
    href: '/dashboard/interviewer/schedule',
    icon: Calendar,
    role: 'interviewer'
  },
  {
    name: 'Profile',
    href: '/dashboard/interviewer/profile',
    icon: UserCircle,
    role: 'interviewer'
  }
];

interface DynamicNavProps {
  onExpandChange?: (isExpanded: boolean) => void;
  userRole?: 'hr_manager' | 'hr_recruiter' | 'interviewer';
}

const DynamicNav = ({ onExpandChange, userRole = 'hr_manager' }: DynamicNavProps) => {
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

  const filteredNavItems = navItems.filter(item => item.role === userRole);

  const getRoleTitle = () => {
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
            className={`flex items-center p-3 rounded-lg transition-all duration-200 w-full text-gray-600 hover:bg-gray-50 hover:text-red-600 ${
              isExpanded ? 'space-x-3' : 'justify-center'
            }`}
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              router.push('/auth/login');
            }}
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