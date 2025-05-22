"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import FeedbackForm from '../../components/FeedbackForm';

interface InterviewDetails {
  id: string;
  candidateName: string;
  position: string;
  date: string;
  status: string;
}

export default function FeedbackPage({ params }: { params: { interviewId: string } }) {
  const router = useRouter();
  const [interview, setInterview] = useState<InterviewDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInterviewDetails = async () => {
      try {
        const response = await fetch(`/api/interviewer/interviews/${params.interviewId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch interview details');
        }
        const data = await response.json();
        setInterview(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchInterviewDetails();
  }, [params.interviewId]);

  const handleSubmit = () => {
    router.push('/dashboard/interviewer/interviews');
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !interview) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h1 className="text-xl font-semibold text-gray-900 mb-4">Error</h1>
            <p className="text-red-600">{error || 'Interview not found'}</p>
            <button
              onClick={() => router.back()}
              className="mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Interview Feedback</h1>
          <div className="mt-2 text-sm text-gray-600">
            <p>Position: {interview.position}</p>
            <p>Date: {new Date(interview.date).toLocaleDateString()}</p>
          </div>
        </div>

        <FeedbackForm
          interviewId={interview.id}
          candidateName={interview.candidateName}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
} 