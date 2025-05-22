'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

interface Candidate {
  id: string;
  name: string;
  department: string;
  status: string;
  // Add other fields as needed
}

const HRRecruiterDashboard = () => {
  const [allCandidates, setAllCandidates] = useState<Candidate[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<string>('applications');

  useEffect(() => {
    // Read from local storage
    const storedCandidatesString = localStorage.getItem('candidates');
    const storedCandidates: Candidate[] = storedCandidatesString ? JSON.parse(storedCandidatesString) : [];
    setAllCandidates(storedCandidates);
    setLoading(false);
  }, []);

  const filteredCandidates = useMemo(() => {
    if (selectedDepartment === 'all') {
      return allCandidates;
    }
    return allCandidates.filter(candidate => candidate.department === selectedDepartment);
  }, [allCandidates, selectedDepartment]);

  // Calculate metrics based on filtered candidates
  const totalCandidates = filteredCandidates.length;
  const candidatesInScreening = filteredCandidates.filter(candidate => candidate.status === 'Screening').length;
  const hiredCandidates = filteredCandidates.filter(candidate => candidate.status === 'Hired').length;
  const rejectedCandidates = filteredCandidates.filter(candidate => candidate.status === 'Rejected').length;

  // Placeholder metrics
  const openPositions = 15;
  const timeToFill = 26;
  const offerAcceptanceRatio = '72.73%';
  const offerAccepted = 8;
  const offerProvided = 11;
  const costPerHire = '$17K';
  const timeToHire = 15;

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-blue-700">HR Recruiter Dashboard</h1>
        
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-sm border border-blue-100">
          <h3 className="text-lg font-semibold text-blue-700 mb-2">Total Candidates</h3>
          <p className="text-3xl font-bold text-blue-600">{totalCandidates}</p>
          <p className="text-sm text-blue-500 mt-2">+12% from last month</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-sm border border-green-100">
          <h3 className="text-lg font-semibold text-green-700 mb-2">Active Interviews</h3>
          <p className="text-3xl font-bold text-green-600">{candidatesInScreening}</p>
          <p className="text-sm text-green-500 mt-2">8 scheduled for today</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl shadow-sm border border-purple-100">
          <h3 className="text-lg font-semibold text-purple-700 mb-2">Hired This Month</h3>
          <p className="text-3xl font-bold text-purple-600">{hiredCandidates}</p>
          <p className="text-sm text-purple-500 mt-2">+3 from last month</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl shadow-sm border border-orange-100">
          <h3 className="text-lg font-semibold text-orange-700 mb-2">Pending Reviews</h3>
          <p className="text-3xl font-bold text-orange-600">{rejectedCandidates}</p>
          <p className="text-sm text-orange-500 mt-2">5 urgent</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-50">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">Recent Candidates</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                    {i}
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-700">Candidate Name {i}</h4>
                    <p className="text-sm text-blue-500">Applied for Software Engineer</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">New</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-50">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">Upcoming Interviews</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center text-green-600 font-semibold">
                    {i}
                  </div>
                  <div>
                    <h4 className="font-medium text-green-700">Interview with Candidate {i}</h4>
                    <p className="text-sm text-green-500">Today at 2:00 PM</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm">Scheduled</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-50">
        <h2 className="text-xl font-semibold text-blue-700 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/dashboard/HR_RECRUiTER/Candidate_Management" 
                className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all shadow-sm">
            <h3 className="font-medium text-blue-700">View All Candidates</h3>
            <p className="text-sm text-blue-500 mt-1">Manage candidate profiles</p>
          </Link>
          <Link href="/dashboard/HR_RECRUiTER/interview_sch"
                className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg hover:from-green-100 hover:to-green-200 transition-all shadow-sm">
            <h3 className="font-medium text-green-700">Interview Schedule</h3>
            <p className="text-sm text-green-500 mt-1">View and manage interviews</p>
          </Link>
          <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg hover:from-purple-100 hover:to-purple-200 transition-all shadow-sm">
            <h3 className="font-medium text-purple-700">Reports</h3>
            <p className="text-sm text-purple-500 mt-1">View hiring analytics</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRRecruiterDashboard;
