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
    <div className="min-h-screen bg-gradient-to-b from-[#050d25] to-[#0d1021] px-10 py-10 text-white flex items-center justify-center">
      <div className="max-w-7xl w-full mx-auto bg-gradient-to-br from-cyan-400/40 via-blue-700/30 to-transparent rounded-3xl shadow-[0_0_40px_#00f7ff30] border border-[#2e314d] p-8 md:p-23">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-cyan-200 drop-shadow-[0_0_10px_#00f7ff]">Interview Scheduling</h1>
          <Link
            href="/dashboard/HR_RECRUiTER/interview_sch/new"
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-[0_0_15px_#00f7ff80] hover:opacity-90 transition text-base"
          >
            Schedule New Interview
          </Link>
        </div>
        <div className="bg-[#0e101c] rounded-2xl shadow-[0_0_30px_#00f7ff30] border border-[#2e314d] overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-[#181b2e] text-cyan-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Candidate</th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Interviewer</th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-[#101325] divide-y divide-[#23264a] text-cyan-100">
              {interviews.map((interview) => (
                <tr key={interview.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-cyan-100">
                    {interview.candidateName || interview.candidateId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-cyan-300">{interview.interviewer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-cyan-300">{new Date(interview.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-cyan-300">{interview.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-cyan-300">{interview.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${interview.status === 'Scheduled' ? 'bg-emerald-900/30 text-emerald-300' :
                        interview.status === 'Completed' ? 'bg-blue-900/30 text-cyan-300' :
                        'bg-rose-900/30 text-rose-300'}`}>
                      {interview.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      href={`/dashboard/HR_RECRUiTER/interview_sch/${interview.id}`}
                      className="text-cyan-400 hover:text-cyan-200 font-medium mr-4 underline"
                    >
                      View
                    </Link>
                    <Link
                      href={`/dashboard/HR_RECRUiTER/interview_sch/edit/${interview.id}`}
                      className="text-blue-400 hover:text-blue-200 font-medium mr-4 underline"
                    >
                      Edit
                    </Link>
                    <button
                      className="text-rose-400 hover:text-rose-300 font-medium underline"
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
            <div className="text-center py-8 text-cyan-300">
              No interviews scheduled.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
