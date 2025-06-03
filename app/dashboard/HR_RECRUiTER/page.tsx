'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Users, CalendarIcon, CheckCircleIcon, ClockIcon, UserPlusIcon, BarChart2, CogIcon } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-b from-[#050d25] to-[#0d1021] px-6 py-10 text-white flex items-center justify-center">
      <div className="w-full bg-gradient-to-br from-cyan-400/40 via-blue-700/30 to-transparent rounded-3xl shadow-[0_0_40px_#00f7ff30] border border-[#2e314d] p-8 md:p-12">
        <h1 className="text-3xl font-bold text-cyan-200 drop-shadow-[0_0_10px_#00f7ff]">HR Recruiter Dashboard</h1>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-[#0e101c] p-6 rounded-2xl shadow-[0_0_20px_#00f7ff30] border border-[#2e314d] flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-cyan-300">Total Candidates</p>
              <p className="text-2xl font-semibold text-cyan-100 mt-1">{totalCandidates}</p>
            </div>
            <div className="p-3 bg-blue-900/30 rounded-full">
              <Users className="h-6 w-6 text-cyan-400" />
            </div>
          </div>
          <div className="bg-[#0e101c] p-6 rounded-2xl shadow-[0_0_20px_#00f7ff30] border border-[#2e314d] flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-cyan-300">Active Interviews</p>
              <p className="text-2xl font-semibold text-cyan-100 mt-1">{candidatesInScreening}</p>
            </div>
            <div className="p-3 bg-green-900/30 rounded-full">
              <CalendarIcon className="h-6 w-6 text-green-400" />
            </div>
          </div>
          <div className="bg-[#0e101c] p-6 rounded-2xl shadow-[0_0_20px_#00f7ff30] border border-[#2e314d] flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-cyan-300">Hired This Month</p>
              <p className="text-2xl font-semibold text-cyan-100 mt-1">{hiredCandidates}</p>
            </div>
            <div className="p-3 bg-emerald-900/30 rounded-full">
              <CheckCircleIcon className="h-6 w-6 text-emerald-400" />
            </div>
          </div>
          <div className="bg-[#0e101c] p-6 rounded-2xl shadow-[0_0_20px_#00f7ff30] border border-[#2e314d] flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-cyan-300">Pending Reviews</p>
              <p className="text-2xl font-semibold text-cyan-100 mt-1">{rejectedCandidates}</p>
            </div>
            <div className="p-3 bg-yellow-900/30 rounded-full">
              <ClockIcon className="h-6 w-6 text-yellow-300" />
            </div>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-lg font-semibold text-cyan-200 mb-4">Recent Candidates</h2>
            <div className="bg-[#181b2e] rounded-2xl shadow-[0_0_20px_#00f7ff20] border border-[#23264a]">
              <div className="divide-y divide-[#23264a]">
                {recentCandidates.map((candidate) => (
                  <div key={candidate.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-cyan-100">{candidate.name}</h3>
                        <p className="text-sm text-cyan-300">{candidate.position}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        candidate.status === 'Hired' ? 'bg-emerald-900/30 text-emerald-300' :
                        candidate.status === 'Interview' ? 'bg-blue-900/30 text-cyan-300' :
                        'bg-yellow-900/30 text-yellow-200'
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
            <h2 className="text-lg font-semibold text-cyan-200 mb-4">Upcoming Interviews</h2>
            <div className="bg-[#181b2e] rounded-2xl shadow-[0_0_20px_#00f7ff20] border border-[#23264a]">
              <div className="divide-y divide-[#23264a]">
                {upcomingInterviews.map((interview) => (
                  <div key={interview.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-cyan-100">{interview.candidate}</h3>
                        <p className="text-sm text-cyan-300">{interview.position}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-cyan-100">{interview.date}</p>
                        <p className="text-xs text-cyan-300">{interview.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-cyan-200 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/dashboard/HR_RECRUiTER/Candidate_Management" className="bg-[#181b2e] p-4 rounded-2xl shadow-[0_0_10px_#00f7ff30] border border-[#23264a] hover:bg-[#23264a] transition">
              <div className="flex items-center">
                <UserPlusIcon className="h-5 w-5 text-cyan-400" />
                <span className="ml-2 text-sm font-medium text-cyan-100">Add New Candidate</span>
              </div>
            </Link>
            <Link href="/dashboard/HR_RECRUiTER/interview_sch" className="bg-[#181b2e] p-4 rounded-2xl shadow-[0_0_10px_#00f7ff30] border border-[#23264a] hover:bg-[#23264a] transition">
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 text-cyan-400" />
                <span className="ml-2 text-sm font-medium text-cyan-100">Schedule Interview</span>
              </div>
            </Link>
            <Link href="/dashboard/HR_RECRUiTER/interview_panel" className="bg-[#181b2e] p-4 rounded-2xl shadow-[0_0_10px_#00f7ff30] border border-[#23264a] hover:bg-[#23264a] transition">
              <div className="flex items-center">
                <BarChart2 className="h-5 w-5 text-cyan-400" />
                <span className="ml-2 text-sm font-medium text-cyan-100">View Reports</span>
              </div>
            </Link>
            <Link href="/dashboard/HR_RECRUiTER/profile" className="bg-[#181b2e] p-4 rounded-2xl shadow-[0_0_10px_#00f7ff30] border border-[#23264a] hover:bg-[#23264a] transition">
              <div className="flex items-center">
                <CogIcon className="h-5 w-5 text-cyan-400" />
                <span className="ml-2 text-sm font-medium text-cyan-100">Settings</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRRecruiterDashboard;
