'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Interview {
  id: string;
  candidateId: string; // Link to candidate
  candidateName?: string; // Store name for easy display (optional based on data structure)
  interviewer: string; // Interviewer(s) name(s)
  date: string;
  time: string;
  location: string;
  status: 'Scheduled' | 'Completed' | 'Canceled';
}

export default function InterviewSchedulingPage() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Read from local storage
    const storedInterviewsString = localStorage.getItem('interviews');
    const storedInterviews: Interview[] = storedInterviewsString ? JSON.parse(storedInterviewsString) : [];
    setInterviews(storedInterviews);
    setLoading(false);
  }, []);

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this interview?')) return;

    try {
      // Filter out the interview to be deleted
      const updatedInterviews = interviews.filter(interview => interview.id !== id);
      
      // Save updated array back to local storage
      localStorage.setItem('interviews', JSON.stringify(updatedInterviews));

      // Update state
      setInterviews(updatedInterviews);

    } catch (err) {
      setError('Failed to delete interview from local storage.');
      console.error(err);
    }
  };

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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-900">Interview Scheduling</h1>
        <Link
          href="/dashboard/HR_RECRUiTER/interview_sch/new"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Schedule New Interview
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interviewer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {interviews.map((interview) => (
              <tr key={interview.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {/* Display candidate name if available, otherwise just ID */}
                  {interview.candidateName || interview.candidateId}
                  </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{interview.interviewer}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(interview.date).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{interview.time}</td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{interview.location}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                   <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${interview.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                      interview.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'}`}>
                    {interview.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link
                    href={`/dashboard/HR_RECRUiTER/interview_sch/${interview.id}`}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    View
                  </Link>
                   <Link
                    href={`/dashboard/HR_RECRUiTER/interview_sch/edit/${interview.id}`}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Edit
                  </Link>
                  <button
                    className="text-red-600 hover:text-red-900"
                    onClick={() => handleDelete(interview.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {interviews.length === 0 && !loading && !error && (
          <div className="text-center py-8 text-gray-500">
            No interviews scheduled.
          </div>
        )}
      </div>
    </div>
  );
};
