'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  Calendar, 
  FileText, 
  UserCircle, 
  BarChart2,
  LogOut,
  Users2,
  Users as UserGroupIcon
} from 'lucide-react';

type UserRole = 'hr_manager' | 'hr_recruiter' | 'interviewer';

interface NavItem {
  name: string;
  href: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  role: UserRole;
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
    name: 'Profile',
    href: '/dashboard/hiring_manager/profile',
    icon: UserCircle,
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
    icon: Users2,
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
  {
    name: 'Interview Panel',
    href: '/dashboard/HR_RECRUiTER/interview_panel',
    icon: UserGroupIcon,
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

  const handleLogout = async (): Promise<void> => {
    try {
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Sign out from NextAuth
      await signOut({ 
        redirect: true,
        callbackUrl: '/auth/login'
      });
    } catch (error) {
      console.error('Logout failed:', error);
      // Fallback to manual redirect if signOut fails
      router.push('/auth/login');
    }
  };

  return (
    <div
      className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-100 transition-all duration-300 ease-in-out z-50  ${
        isExpanded ? 'w-64' : 'w-20'
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ height: '100vh' }}
    >
      <div className="p-4 h-full overflow-y-auto">
        <div className="flex items-center justify-center mb-8 pt-4">
          <h1 className={`text-xl font-bold ${isExpanded ? 'block' : 'hidden'}`}>
            {getRoleTitle()}
          </h1>
        </div>
        <nav className="space-y-2">
          {filteredNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-100 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-6 h-6" />
                {isExpanded && (
                  <span className="ml-3">{item.name}</span>
                )}
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 mt-4 text-gray-600 rounded-lg hover:bg-gray-50"
          >
            <LogOut className="w-6 h-6" />
            {isExpanded && (
              <span className="ml-3">Logout</span>
            )}
          </button>
        </nav>
      </div>
    </div>
  );
};

export default DynamicNav; 