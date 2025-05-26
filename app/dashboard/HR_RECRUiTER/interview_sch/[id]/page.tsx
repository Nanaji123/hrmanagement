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
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Interview Details</h1>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Back to List
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">Candidate</label>
              <p className="mt-1 text-gray-900">{interview.candidateName || interview.candidateId}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Interviewer(s)</label>
              <p className="mt-1 text-gray-900">{interview.interviewer}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Date</label>
              <p className="mt-1 text-gray-900">{new Date(interview.date).toLocaleDateString()}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Time</label>
              <p className="mt-1 text-gray-900">{interview.time}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Location</label>
              <p className="mt-1 text-gray-900">{interview.location}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Status</label>
              <p className="mt-1 text-gray-900">{interview.status}</p>
            </div>
             {/* You can add more details here if needed */}
          </div>
        </div>
      </div>
    </div>
  );
} 