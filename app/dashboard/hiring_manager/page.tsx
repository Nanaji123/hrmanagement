'use client';

import { useState } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  isPositive: boolean;
}

const StatCard = ({ title, value, change, isPositive }: StatCardProps) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
    <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
    <div className="mt-2 flex items-center">
      <span className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
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
  <div className="bg-white rounded-lg shadow p-4">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{department}</p>
      </div>
      <span className={`px-2 py-1 text-xs rounded-full ${
        status === 'Open' ? 'bg-green-100 text-green-800' :
        status === 'Closed' ? 'bg-red-100 text-red-800' :
        'bg-gray-100 text-gray-800'
      }`}>
        {status}
      </span>
    </div>
    <div className="mt-4">
      <p className="text-sm text-gray-600">{applicants} applicants</p>
    </div>
  </div>
);

export default function Dashboard() {
  const [stats] = useState({
    activeJobs: 12,
    totalApplicants: 156,
    interviewsScheduled: 24,
    positionsFilled: 8
  });

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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Job Postings"
          value={stats.activeJobs}
          change="+2 from last month"
          isPositive={true}
        />
        <StatCard
          title="Total Applicants"
          value={stats.totalApplicants}
          change="+15% from last month"
          isPositive={true}
        />
        <StatCard
          title="Interviews Scheduled"
          value={stats.interviewsScheduled}
          change="-3 from last week"
          isPositive={false}
        />
        <StatCard
          title="Positions Filled"
          value={stats.positionsFilled}
          change="+4 from last month"
          isPositive={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Job Postings</h2>
          <div className="space-y-4">
            {recentJobs.map((job, index) => (
              <JobCard key={index} {...job} />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Upcoming Interviews</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium">John Smith</h3>
                <p className="text-sm text-gray-500">Senior Software Engineer</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">Today, 2:00 PM</p>
                <p className="text-xs text-gray-500">Technical Round</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium">Sarah Johnson</h3>
                <p className="text-sm text-gray-500">Product Manager</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">Tomorrow, 11:00 AM</p>
                <p className="text-xs text-gray-500">HR Round</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
