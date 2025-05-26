'use client';

import { useState, useEffect } from 'react';

interface DashboardStats {
  totalCandidates: number;
  activeJobs: number;
  upcomingInterviews: number;
  pendingFeedback: number;
}

interface RecentActivity {
  id: string;
  type: 'candidate' | 'job' | 'interview' | 'feedback' | 'team';
  action: string;
  details: string;
  timestamp: string;
}

// Initial data for first-time users
const initialStats: DashboardStats = {
  totalCandidates: 45,
  activeJobs: 12,
  upcomingInterviews: 8,
  pendingFeedback: 5
};

const initialActivities: RecentActivity[] = [
  {
    id: '1',
    type: 'candidate',
    action: 'New Application',
    details: 'John Smith applied for Senior Software Engineer',
    timestamp: '2024-03-20 10:30 AM'
  },
  {
    id: '2',
    type: 'team',
    action: 'Team Update',
    details: 'New hiring team member joined - Sarah Wilson',
    timestamp: '2024-03-20 09:45 AM'
  },
  {
    id: '3',
    type: 'interview',
    action: 'Interview Scheduled',
    details: 'Technical interview with Sarah Johnson for Product Manager',
    timestamp: '2024-03-20 09:15 AM'
  },
  {
    id: '4',
    type: 'job',
    action: 'New Job Posted',
    details: 'UX Designer position opened',
    timestamp: '2024-03-19 02:45 PM'
  },
  {
    id: '5',
    type: 'feedback',
    action: 'Feedback Submitted',
    details: 'Michael Brown\'s interview feedback submitted',
    timestamp: '2024-03-19 11:20 AM'
  }
];

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  isPositive: boolean;
}

const StatCard = ({ title, value, change, isPositive }: StatCardProps) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
    <h3 className="text-sm font-medium text-gray-600">{title}</h3>
    <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
    <div className="mt-2 flex items-center">
      <span className={`text-sm font-medium ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
        {change}
      </span>
    </div>
  </div>
);

interface JobCardProps {
  title: string;
  department: string;
  applicants: number;
  status: 'Open' | 'Closed' | 'Draft';
}

const JobCard = ({ title, department, applicants, status }: JobCardProps) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow duration-200">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">{department}</p>
      </div>
      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
        status === 'Open' ? 'bg-emerald-50 text-emerald-700' :
        status === 'Closed' ? 'bg-rose-50 text-rose-700' :
        'bg-gray-50 text-gray-700'
      }`}>
        {status}
      </span>
    </div>
    <div className="mt-4">
      <p className="text-sm font-medium text-gray-600">{applicants} applicants</p>
    </div>
  </div>
);

export default function DashboardPage() {
  // Load stats from localStorage or use initial data
  const [stats, setStats] = useState<DashboardStats>(() => {
    if (typeof window !== 'undefined') {
      const savedStats = localStorage.getItem('dashboardStats');
      return savedStats ? JSON.parse(savedStats) : initialStats;
    }
    return initialStats;
  });

  // Load activities from localStorage or use initial data
  const [activities, setActivities] = useState<RecentActivity[]>(() => {
    if (typeof window !== 'undefined') {
      const savedActivities = localStorage.getItem('dashboardActivities');
      return savedActivities ? JSON.parse(savedActivities) : initialActivities;
    }
    return initialActivities;
  });

  // Save stats to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('dashboardStats', JSON.stringify(stats));
    }
  }, [stats]);

  // Save activities to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('dashboardActivities', JSON.stringify(activities));
    }
  }, [activities]);

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'candidate':
        return (
          <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
            <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        );
      case 'team':
        return (
          <div className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center">
            <svg className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        );
      case 'job':
        return (
          <div className="h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center">
            <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        );
      case 'interview':
        return (
          <div className="h-8 w-8 rounded-full bg-purple-50 flex items-center justify-center">
            <svg className="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        );
      case 'feedback':
        return (
          <div className="h-8 w-8 rounded-full bg-amber-50 flex items-center justify-center">
            <svg className="h-4 w-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  const [recentJobs] = useState<JobCardProps[]>([
    {
      title: 'Senior Software Engineer',
      department: 'Engineering',
      applicants: 45,
      status: 'Open'
    },
    {
      title: 'Product Manager',
      department: 'Product',
      applicants: 32,
      status: 'Open'
    },
    {
      title: 'UX Designer',
      department: 'Design',
      applicants: 28,
      status: 'Closed'
    }
  ]);

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Job Postings"
          value={stats.activeJobs}
          change="+2 from last month"
          isPositive={true}
        />
        <StatCard
          title="Total Applicants"
          value={stats.totalCandidates}
          change="+15% from last month"
          isPositive={true}
        />
        <StatCard
          title="Interviews Scheduled"
          value={stats.upcomingInterviews}
          change="-3 from last week"
          isPositive={false}
        />
        <StatCard
          title="Positions Filled"
          value={stats.activeJobs}
          change="+4 from last month"
          isPositive={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Job Postings</h2>
          <div className="space-y-4">
            {recentJobs.map((job, index) => (
              <JobCard key={index} {...job} />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activities</h2>
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                {getActivityIcon(activity.type)}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">{activity.action}</h3>
                    <span className="text-sm text-gray-500">{activity.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{activity.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
