'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Interview {
  id: string;
  candidateId: string;
  candidateName?: string;
  interviewer: string;
  date: string;
  time: string;
  location: string;
  status: 'Scheduled' | 'Completed' | 'Canceled';
}

export default function InterviewDetails({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(true);
  const [interviewNotFound, setInterviewNotFound] = useState(false);

  useEffect(() => {
    // Read from local storage
    const storedInterviewsString = localStorage.getItem('interviews');
    const storedInterviews: Interview[] = storedInterviewsString ? JSON.parse(storedInterviewsString) : [];

    // Find the interview with the matching ID
    const foundInterview = storedInterviews.find(int => int.id === params.id);

    if (foundInterview) {
      setInterview(foundInterview);
    } else {
      setInterviewNotFound(true);
    }
    setLoading(false);
  }, [params.id]);

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

  if (interviewNotFound) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">Interview not found</h2>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!interview) {
     // Should not happen if loading is false and interviewNotFound is false
     return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050d25] to-[#0d1021] px-6 py-10 text-white flex items-center justify-center">
      <div className="max-w-2xl w-full mx-auto bg-gradient-to-br from-cyan-400/40 via-blue-700/30 to-transparent rounded-3xl shadow-[0_0_40px_#00f7ff30] border border-[#2e314d] p-8 md:p-12">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-cyan-200 drop-shadow-[0_0_10px_#00f7ff]">Interview Details</h1>
          <button
            onClick={() => router.back()}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-[0_0_15px_#00f7ff80] hover:opacity-90 transition text-base"
          >
            Back to List
          </button>
        </div>
        <div className="bg-[#0e101c] rounded-2xl shadow-[0_0_30px_#00f7ff30] border border-[#2e314d] p-8 space-y-4 text-cyan-100">
          <div>
            <label className="block text-sm font-medium text-cyan-300">Candidate</label>
            <p className="mt-1">{interview.candidateName || interview.candidateId}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-cyan-300">Interviewer(s)</label>
            <p className="mt-1">{interview.interviewer}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-cyan-300">Date</label>
            <p className="mt-1">{new Date(interview.date).toLocaleDateString()}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-cyan-300">Time</label>
            <p className="mt-1">{interview.time}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-cyan-300">Location</label>
            <p className="mt-1">{interview.location}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-cyan-300">Status</label>
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
              ${interview.status === 'Scheduled' ? 'bg-emerald-900/30 text-emerald-300' :
                interview.status === 'Completed' ? 'bg-blue-900/30 text-cyan-300' :
                'bg-rose-900/30 text-rose-300'}`}>
              {interview.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}