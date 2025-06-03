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
  type: 'candidate' | 'job' | 'interview' | 'feedback';
  action: string;
  details: string;
  timestamp: string;
}

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
    type: 'interview',
    action: 'Interview Scheduled',
    details: 'Technical interview with Sarah Johnson for Product Manager',
    timestamp: '2024-03-20 09:15 AM'
  },
  {
    id: '3',
    type: 'job',
    action: 'New Job Posted',
    details: 'UX Designer position opened',
    timestamp: '2024-03-19 02:45 PM'
  },
  {
    id: '4',
    type: 'feedback',
    action: 'Feedback Submitted',
    details: "Michael Brown's interview feedback submitted",
    timestamp: '2024-03-19 11:20 AM'
  }
];

const StatCard = ({ title, value, change, isPositive }: { title: string, value: string | number, change: string, isPositive: boolean }) => (
  <div className="bg-[#0e101c] text-white rounded-xl p-6 shadow-[0_0_20px_#00f7ff40] border border-[#2e314d] hover:shadow-[0_0_30px_#00f7ff60] transition duration-300">
    <h3 className="text-sm text-[#9aa0b4]">{title}</h3>
    <p className="mt-2 text-3xl font-bold">{value}</p>
    <p className={`mt-1 text-sm ${isPositive ? 'text-cyan-400' : 'text-rose-400'}`}>{change}</p>
  </div>
);

const JobCard = ({ title, department, applicants, status }: { title: string, department: string, applicants: number, status: 'Open' | 'Closed' | 'Draft' }) => (
  <div className="bg-[#0e101c] text-white rounded-xl p-4 shadow-[0_0_15px_#00f7ff20] border border-[#2e314d] hover:shadow-[0_0_25px_#00f7ff50] transition duration-300">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-[#9aa0b4]">{department}</p>
      </div>
      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
        status === 'Open' ? 'bg-cyan-900 text-cyan-300' :
        status === 'Closed' ? 'bg-red-900 text-red-300' :
        'bg-gray-800 text-gray-300'
      }`}>
        {status}
      </span>
    </div>
    <div className="mt-4">
      <p className="text-sm text-[#9aa0b4]">{applicants} applicants</p>
    </div>
  </div>
);

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(() => {
    if (typeof window !== 'undefined') {
      const savedStats = localStorage.getItem('dashboardStats');
      return savedStats ? JSON.parse(savedStats) : initialStats;
    }
    return initialStats;
  });

  const [activities, setActivities] = useState<RecentActivity[]>(() => {
    if (typeof window !== 'undefined') {
      const savedActivities = localStorage.getItem('dashboardActivities');
      return savedActivities ? JSON.parse(savedActivities) : initialActivities;
    }
    return initialActivities;
  });

  useEffect(() => {
    localStorage.setItem('dashboardStats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('dashboardActivities', JSON.stringify(activities));
  }, [activities]);

  const getActivityIcon = (type: RecentActivity['type']) => {
    const baseClass = "h-4 w-4";
    switch (type) {
      case 'candidate':
        return <svg className={`${baseClass} text-blue-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>;
      case 'job':
        return <svg className={`${baseClass} text-green-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m2 4H7m2-8h6m2-4H7" />
        </svg>;
      case 'interview':
        return <svg className={`${baseClass} text-yellow-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2v-5H3v5a2 2 0 002 2z" />
        </svg>;
      case 'feedback':
        return <svg className={`${baseClass} text-pink-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h6m-6 4h10M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050d25] to-[#0d1021] px-6 py-10 text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-cyan-300 drop-shadow-[0_0_10px_#00f7ff]">HR Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard title="Total Candidates" value={stats.totalCandidates} change="+5%" isPositive />
          <StatCard title="Active Jobs" value={stats.activeJobs} change="+3%" isPositive />
          <StatCard title="Upcoming Interviews" value={stats.upcomingInterviews} change="0%" isPositive />
          <StatCard title="Pending Feedback" value={stats.pendingFeedback} change="-2%" isPositive={false} />
        </div>

        {/* Job Cards */}
        <h2 className="text-2xl font-semibold mb-4 text-cyan-200">Active Job Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <JobCard title="Frontend Developer" department="Engineering" applicants={12} status="Open" />
          <JobCard title="UX Designer" department="Design" applicants={8} status="Draft" />
          <JobCard title="HR Executive" department="HR" applicants={5} status="Closed" />
        </div>

        {/* Activities */}
        <h2 className="text-2xl font-semibold mb-4 text-cyan-200">Recent Activity</h2>
        <ul className="space-y-4">
          {activities.map(activity => (
            <li key={activity.id} className="bg-[#11131f] border border-[#2e314d] rounded-lg p-4 flex items-start shadow-[0_0_15px_#00f7ff30] hover:shadow-[0_0_25px_#00f7ff50] transition">
              <div className="mr-4">
                <div className="h-10 w-10 rounded-full bg-[#1f2238] flex items-center justify-center">
                  {getActivityIcon(activity.type)}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-white">{activity.action}</p>
                <p className="text-xs text-[#9aa0b4]">{activity.details}</p>
                <p className="text-xs text-[#5f6b8b] mt-1">{activity.timestamp}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
