'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Users, CalendarIcon, CheckCircleIcon, ClockIcon, UserPlusIcon, ChartBarIcon, CogIcon } from 'lucide-react';

interface Candidate {
  id: number;
  name: string;
  position: string;
  status: string;
}

interface Interview {
  id: number;
  candidate: string;
  position: string;
  date: string;
  time: string;
}

const HRRecruiterDashboard = () => {
  const [totalCandidates] = useState(156);
  const [candidatesInScreening] = useState(24);
  const [hiredCandidates] = useState(12);
  const [rejectedCandidates] = useState(8);

  const recentCandidates: Candidate[] = [
    { id: 1, name: 'John Doe', position: 'Software Engineer', status: 'Hired' },
    { id: 2, name: 'Jane Smith', position: 'Product Manager', status: 'Interview' },
    { id: 3, name: 'Mike Johnson', position: 'UX Designer', status: 'Rejected' },
  ];

  const upcomingInterviews: Interview[] = [
    { id: 1, candidate: 'Alice Brown', position: 'Frontend Developer', date: '2024-03-20', time: '10:00 AM' },
    { id: 2, candidate: 'Bob Wilson', position: 'Backend Developer', date: '2024-03-20', time: '2:00 PM' },
    { id: 3, candidate: 'Carol Davis', position: 'DevOps Engineer', date: '2024-03-21', time: '11:00 AM' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900">HR Recruiter Dashboard</h1>
        
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Candidates</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{totalCandidates}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Interviews</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{candidatesInScreening}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-full">
                <CalendarIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Hired This Month</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{hiredCandidates}</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-full">
                <CheckCircleIcon className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{rejectedCandidates}</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-full">
                <ClockIcon className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Candidates</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="divide-y divide-gray-100">
                {recentCandidates.map((candidate) => (
                  <div key={candidate.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{candidate.name}</h3>
                        <p className="text-sm text-gray-500">{candidate.position}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        candidate.status === 'Hired' ? 'bg-green-50 text-green-700' :
                        candidate.status === 'Interview' ? 'bg-blue-50 text-blue-700' :
                        'bg-yellow-50 text-yellow-700'
                      }`}>
                        {candidate.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Interviews</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="divide-y divide-gray-100">
                {upcomingInterviews.map((interview) => (
                  <div key={interview.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{interview.candidate}</h3>
                        <p className="text-sm text-gray-500">{interview.position}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-900">{interview.date}</p>
                        <p className="text-xs text-gray-500">{interview.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/dashboard/HR_RECRUiTER/candidates/new" className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:bg-gray-50">
              <div className="flex items-center">
                <UserPlusIcon className="h-5 w-5 text-gray-400" />
                <span className="ml-2 text-sm font-medium text-gray-900">Add New Candidate</span>
              </div>
            </Link>
            <Link href="/dashboard/HR_RECRUiTER/interviews/schedule" className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:bg-gray-50">
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
                <span className="ml-2 text-sm font-medium text-gray-900">Schedule Interview</span>
              </div>
            </Link>
            <Link href="/dashboard/HR_RECRUiTER/reports" className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:bg-gray-50">
              <div className="flex items-center">
                <ChartBarIcon className="h-5 w-5 text-gray-400" />
                <span className="ml-2 text-sm font-medium text-gray-900">View Reports</span>
              </div>
            </Link>
            <Link href="/dashboard/HR_RECRUiTER/settings" className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:bg-gray-50">
              <div className="flex items-center">
                <CogIcon className="h-5 w-5 text-gray-400" />
                <span className="ml-2 text-sm font-medium text-gray-900">Settings</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRRecruiterDashboard;
