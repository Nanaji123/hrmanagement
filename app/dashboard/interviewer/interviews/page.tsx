"use client";

import React, { useState, useEffect } from 'react';
import { Candidate } from '../types';
import { FeedbackForm } from '../components/FeedbackForm';

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState<Candidate[]>([]);
  const [filteredInterviews, setFilteredInterviews] = useState<Candidate[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedInterview, setSelectedInterview] = useState<Candidate | null>(null);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  useEffect(() => {
    fetchInterviews();
  }, []);

  useEffect(() => {
    const filtered = interviews.filter(interview => 
      interview.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interview.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredInterviews(filtered);
  }, [searchQuery, interviews]);

  const fetchInterviews = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/interviewer/interviews');
      if (!response.ok) {
        throw new Error('Failed to fetch interviews');
      }
      const data = await response.json();
      setInterviews(data);
      setFilteredInterviews(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedbackSubmit = async (feedback: any) => {
    try {
      const response = await fetch(`/api/interviewer/interviews/${selectedInterview?.id}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedback),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      setInterviews(interviews.map(interview => 
        interview.id === selectedInterview?.id 
          ? { ...interview, feedbackSubmitted: true }
          : interview
      ));

      setShowFeedbackForm(false);
      setSelectedInterview(null);
    } catch (err) {
      console.error('Error submitting feedback:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading interviews...</p>
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
          <p className="text-lg font-medium text-gray-900 mb-2">Error Loading Interviews</p>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchInterviews}
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
        <h1 className="text-2xl font-bold text-gray-900">My Interviews</h1>
        <p className="text-sm text-gray-600 mt-1">Manage and provide feedback for your scheduled interviews</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search candidates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {filteredInterviews.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-600">No interviews found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredInterviews.map((interview) => (
            <div key={interview.id} className="bg-white rounded-lg shadow">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{interview.name}</h3>
                    <p className="text-sm text-gray-500">Role: {interview.role}</p>
                    {interview.feedbackSubmitted && interview.history.length > 0 && (
                      <p className="text-sm text-gray-500 mt-1">
                        Rating: {interview.history[0].rating}/5
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      Interview: {interview.interviewDate} at {interview.interviewTime}
                    </p>
                    <p className="text-sm text-gray-500">Type: {interview.interviewType}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <a
                    href={interview.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Join Meeting
                  </a>
                  <a
                    href={interview.resumeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    View Resume
                  </a>
                  <button
                    onClick={() => {
                      setSelectedInterview(interview);
                      setShowFeedbackForm(true);
                    }}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Feedback Form Modal */}
      {showFeedbackForm && selectedInterview && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Interview Details - {selectedInterview.name}
                </h2>
                <button
                  onClick={() => {
                    setShowFeedbackForm(false);
                    setSelectedInterview(null);
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Candidate Information</h3>
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="text-sm font-medium text-gray-900">{selectedInterview.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Role</p>
                      <p className="text-sm font-medium text-gray-900">{selectedInterview.role}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Interview Date</p>
                      <p className="text-sm font-medium text-gray-900">{selectedInterview.interviewDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Interview Time</p>
                      <p className="text-sm font-medium text-gray-900">{selectedInterview.interviewTime}</p>
                    </div>
                  </div>
                </div>

                {!selectedInterview.feedbackSubmitted && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Provide Feedback</h3>
                    <FeedbackForm
                      initialFeedback={{
                        technicalRating: 0,
                        communicationRating: 0,
                        problemSolvingRating: 0,
                        recommendation: 'Consider',
                        comments: ''
                      }}
                      onSubmit={() => handleFeedbackSubmit}
                      onFeedbackChange={() => {}}
                    />
                  </div>
                )}

                {selectedInterview.history.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Previous Feedback</h3>
                    <div className="space-y-4">
                      {selectedInterview.history.map((item, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-500">{item.date}</p>
                          <p className="mt-1 text-sm text-gray-900">{item.feedback}</p>
                          {item.rating && (
                            <p className="mt-1 text-sm text-gray-500">Rating: {item.rating}/5</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}