"use client";

import React, { useState, useEffect } from 'react';
import styles from '../InterviewerPage.module.css';

interface Feedback {
  id: string;
  candidateName: string;
  role: string;
  interviewDate: string;
  technicalSkills: number;
  problemSolving: number;
  communication: number;
  cultureFit: number;
  strengths: string;
  weaknesses: string;
  notes: string;
  recommendation: 'Strong Hire' | 'Hire' | 'Hold' | 'No Hire';
  submittedAt: string;
}

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/interviewer/feedback');
      if (!response.ok) {
        throw new Error('Failed to fetch feedback');
      }
      const data = await response.json();
      setFeedback(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading feedback...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-lg font-medium text-gray-900 mb-2">Error Loading Feedback</p>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchFeedback}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Interview Feedback</h1>
        <p className="text-sm text-gray-600 mt-1">View and manage your submitted interview feedback</p>
      </div>

      {feedback.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No feedback submitted yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {feedback.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{item.candidateName}</h3>
                    <p className="text-sm text-gray-500">{item.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Interview Date: {item.interviewDate}</p>
                    <p className="text-sm text-gray-500">Submitted: {item.submittedAt}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500">Technical Skills</h4>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">{item.technicalSkills}/5</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500">Problem Solving</h4>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">{item.problemSolving}/5</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500">Communication</h4>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">{item.communication}/5</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500">Culture Fit</h4>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">{item.cultureFit}/5</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Strengths</h4>
                    <p className="mt-1 text-sm text-gray-900">{item.strengths}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Areas for Improvement</h4>
                    <p className="mt-1 text-sm text-gray-900">{item.weaknesses}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Additional Notes</h4>
                    <p className="mt-1 text-sm text-gray-900">{item.notes}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Final Recommendation</h4>
                    <span className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.recommendation === 'Strong Hire' ? 'bg-green-100 text-green-800' :
                      item.recommendation === 'Hire' ? 'bg-blue-100 text-blue-800' :
                      item.recommendation === 'Hold' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {item.recommendation}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 