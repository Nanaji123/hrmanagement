"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Feedback {
  id: string;
  interviewId: string;
  candidateName: string;
  position: string;
  date: string;
  technicalSkills: number;
  communication: number;
  problemSolving: number;
  culturalFit: number;
  overallRating: number;
  recommendation: string;
  strengths: string;
  weaknesses: string;
  comments: string;
}

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${
            i < rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-2 text-sm text-gray-600">({rating}/5)</span>
    </div>
  );
};

export default function FeedbackPage() {
  const router = useRouter();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRecommendation, setFilterRecommendation] = useState('');

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/interviewer/feedbacks');
      if (!response.ok) throw new Error('Failed to fetch feedbacks');
      const data = await response.json();
      setFeedbacks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching feedbacks');
    } finally {
      setLoading(false);
    }
  };

  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesSearch = feedback.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feedback.position.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRecommendation = filterRecommendation === '' || feedback.recommendation === filterRecommendation;
    return matchesSearch && matchesRecommendation;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h1 className="text-xl font-semibold text-gray-900 mb-4">Error</h1>
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchFeedbacks}
              className="mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Interview Feedback</h1>
          <p className="mt-2 text-base text-gray-700">View and manage all interview feedback submissions</p>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <input
              type="text"
              id="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="w-full sm:w-64">
            <label htmlFor="recommendation" className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Recommendation
            </label>
            <select
              id="recommendation"
              value={filterRecommendation}
              onChange={(e) => setFilterRecommendation(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 font-medium"
            >
              <option value="" className="text-gray-900">All</option>
              <option value="Strong Hire" className="text-gray-900">Strong Hire</option>
              <option value="Hire" className="text-gray-900">Hire</option>
              <option value="No Hire" className="text-gray-900">No Hire</option>
              <option value="Strong No Hire" className="text-gray-900">Strong No Hire</option>
            </select>
          </div>
        </div>

        {filteredFeedbacks.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <p className="text-gray-500">No feedback submissions found</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredFeedbacks.map((feedback) => (
              <div key={feedback.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{feedback.candidateName}</h2>
                    <p className="text-base text-gray-700">{feedback.position}</p>
                    <p className="text-sm text-gray-500">Interview Date: {new Date(feedback.date).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    feedback.recommendation === 'Strong Hire' ? 'bg-green-100 text-green-800' :
                    feedback.recommendation === 'Hire' ? 'bg-blue-100 text-blue-800' :
                    feedback.recommendation === 'No Hire' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {feedback.recommendation}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Technical Skills</p>
                    <div className="mt-1">
                      <StarRating rating={feedback.technicalSkills} />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Communication</p>
                    <div className="mt-1">
                      <StarRating rating={feedback.communication} />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Problem Solving</p>
                    <div className="mt-1">
                      <StarRating rating={feedback.problemSolving} />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Cultural Fit</p>
                    <div className="mt-1">
                      <StarRating rating={feedback.culturalFit} />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Strengths</h3>
                    <p className="mt-1 text-base text-gray-900">{feedback.strengths}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Areas for Improvement</h3>
                    <p className="mt-1 text-base text-gray-900">{feedback.weaknesses}</p>
                  </div>
                  {feedback.comments && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">Additional Comments</h3>
                      <p className="mt-1 text-base text-gray-900">{feedback.comments}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 