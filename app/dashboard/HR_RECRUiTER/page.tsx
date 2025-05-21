'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

interface Candidate {
  id: string;
  name: string;
  email: string;
  position: string;
  status: 'New' | 'Screening' | 'Interview' | 'Offered' | 'Hired' | 'Rejected';
  appliedDate: string;
  department?: string; // Department field
}

const HRRecruiterDashboard = () => {
  const [allCandidates, setAllCandidates] = useState<Candidate[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Placeholders for other metrics (will need more data/logic to calculate accurately)
  const openPositions = 15; // Static placeholder
  const timeToFill = 26; // Static placeholder
  const offerAcceptanceRatio = '72.73%'; // Static placeholder
  const offerAccepted = 8; // Static placeholder
  const offerProvided = 11; // Static placeholder
  const costPerHire = '$17K'; // Static placeholder
  const timeToHire = 15; // Static placeholder


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
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="text-sm text-gray-600 mb-2">
          <Link href="/" className="hover:underline">Home</Link> &gt; Hr &gt; HR Recruitment Dashboard
        </div>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">HR Recruitment Dashboard</h1>
        </div>
      </div>

      {/* Filters and Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        {/* Department Filter */}
        <div className="bg-white p-4 rounded-lg shadow flex items-center">
           <label htmlFor="department" className="mr-2 text-gray-700">Department:</label>
           <select
              id="department"
              className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
           >
              <option value="all">All</option>
              <option value="engineering">Engineering</option>
              <option value="marketing">Marketing</option>
              <option value="sales">Sales</option>
              <option value="hr">Human Resources</option>
           </select>
        </div>

        {/* Metrics - Row 1 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700">Time to Fill (Days)</h2>
          <p className="text-4xl font-bold text-blue-600 mt-2">{timeToFill}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow col-span-1 md:col-span-2">
          <h2 className="text-lg font-semibold text-gray-700">Offer Acceptance Ratio</h2>
          <p className="text-4xl font-bold text-green-600 mt-2">{offerAcceptanceRatio}</p>
          <div className="flex justify-around mt-4">
            <div className="text-center">
              <p className="text-xl font-bold">{offerAccepted}</p>
              <p className="text-sm text-gray-500">Offer Accepted</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold">{offerProvided}</p>
              <p className="text-sm text-gray-500">Offer Provided</p>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics - Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
         <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-700">Shortlisted Candidates</h2>
            <p className="text-4xl font-bold text-purple-600 mt-2">{/* Calculate based on status if available */ totalCandidates}</p>
         </div>
         <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-700">Total Applicants</h2>
            <p className="text-4xl font-bold text-blue-600 mt-2">{totalCandidates}</p>
         </div>
         <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-700">Rejected Candidates</h2>
            <p className="text-4xl font-bold text-red-600 mt-2">{rejectedCandidates}</p>
         </div>
         <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-700">Cost per Hire</h2>
            <p className="text-4xl font-bold text-green-600 mt-2">{costPerHire}</p>
         </div>
      </div>

       {/* Metrics - Row 3 */}
       <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
         <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-700">Hired Candidates</h2>
            <p className="text-4xl font-bold text-green-600 mt-2">{hiredCandidates}</p>
         </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-700">Time to Hire (Days)</h2>
            <p className="text-4xl font-bold text-orange-600 mt-2">{timeToHire}</p>
         </div>
       </div>

      {/* Charts/Visualizations Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow h-80 flex items-center justify-center text-gray-500">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Recruitment Funnel</h2>
          Placeholder for Recruitment Funnel Chart
        </div>
        <div className="bg-white p-6 rounded-lg shadow h-80 flex items-center justify-center text-gray-500">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Applications Received by Source</h2>
          Placeholder for Applications Received by Source Chart
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow h-80 flex items-center justify-center text-gray-500">
           <h2 className="text-lg font-semibold text-gray-700 mb-4">Open Positions by Department</h2>
          Placeholder for Open Positions by Department Chart
        </div>
         <div className="bg-white p-6 rounded-lg shadow h-80 flex items-center justify-center text-gray-500">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Client Decline vs. Candidate Decline</h2>
          Placeholder for Client Decline vs. Candidate Decline Chart
        </div>
      </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow h-80 flex items-center justify-center text-gray-500">
           <h2 className="text-lg font-semibold text-gray-700 mb-4">Reasons for Client Decline</h2>
          Placeholder for Reasons for Client Decline Chart
        </div>
         <div className="bg-white p-6 rounded-lg shadow h-80 flex items-center justify-center text-gray-500">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Reason for Candidate Decline</h2>
          Placeholder for Reason for Candidate Decline Chart
        </div>
      </div>

      {/* Quick Links Section */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link href="/dashboard/HR_RECRUiTER/Candidate_Management"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Manage Candidates
          </Link>
          {/* Add other quick action links as needed */}
        </div>
      </div>

    </div>
  );
};

export default HRRecruiterDashboard;
