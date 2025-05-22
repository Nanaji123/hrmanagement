"use client";

import React, { useState, useEffect } from 'react';
import styles from './InterviewerPage.module.css';
import { CandidateCard } from './components/CandidateCard';
import { CandidateDetailModal } from './components/CandidateDetailModal';
import { Candidate, InterviewFeedbackData, InterviewHistoryItem } from './types/index';
import { useRouter } from 'next/navigation';

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  isPositive: boolean;
}

const StatCard = ({ title, value, change, isPositive }: StatCardProps) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
    <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
    <div className="mt-2 flex items-center">
      <span className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {change}
      </span>
    </div>
  </div>
);

interface InterviewCardProps {
  candidateName: string;
  role: string;
  interviewDate: string;
  interviewTime: string;
  interviewType: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
}

const InterviewCard = ({ candidateName, role, interviewDate, interviewTime, interviewType, status }: InterviewCardProps) => (
  <div className="bg-white rounded-lg shadow p-4">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-lg font-medium text-gray-900">{candidateName}</h3>
        <p className="text-sm text-gray-500">{role}</p>
      </div>
      <span className={`px-2 py-1 text-xs rounded-full ${
        status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
        status === 'Completed' ? 'bg-green-100 text-green-800' :
        'bg-red-100 text-red-800'
      }`}>
        {status}
      </span>
    </div>
    <div className="mt-4 space-y-2">
      <p className="text-sm text-gray-600">Date: {interviewDate}</p>
      <p className="text-sm text-gray-600">Time: {interviewTime}</p>
      <p className="text-sm text-gray-600">Type: {interviewType}</p>
    </div>
  </div>
);

export default function InterviewerDashboard() {
  const router = useRouter();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackData, setFeedbackData] = useState<InterviewFeedbackData>({
    technicalSkills: 0,
    problemSolving: 0,
    communication: 0,
    cultureFit: 0,
    strengths: '',
    weaknesses: '',
    notes: '',
    recommendation: 'Hold'
  });

  const [stats] = useState({
    upcomingInterviews: 5,
    completedInterviews: 12,
    pendingFeedback: 3,
    averageRating: 4.2
  });

  const [upcomingInterviews] = useState<InterviewCardProps[]>([
    {
      candidateName: 'John Smith',
      role: 'Senior Software Engineer',
      interviewDate: '2024-03-20',
      interviewTime: '10:00 AM',
      interviewType: 'Technical',
      status: 'Scheduled'
    },
    {
      candidateName: 'Sarah Johnson',
      role: 'Product Manager',
      interviewDate: '2024-03-21',
      interviewTime: '2:00 PM',
      interviewType: 'HR',
      status: 'Scheduled'
    },
    {
      candidateName: 'Michael Brown',
      role: 'UX Designer',
      interviewDate: '2024-03-22',
      interviewTime: '11:00 AM',
      interviewType: 'Technical',
      status: 'Scheduled'
    }
  ]);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await fetch('/api/interviewer/candidates');
      if (!response.ok) {
        throw new Error('Failed to fetch candidates');
      }
      const data = await response.json();
      setCandidates(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCandidateClick = (candidate: Candidate) => {
    const candidateWithHistory = {
      ...candidate,
      history: candidate.history || []
    };
    setSelectedCandidate(candidateWithHistory);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCandidate(null);
  };

  const handleFeedbackChange = (field: keyof InterviewFeedbackData, value: string | number) => {
    setFeedbackData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitFeedback = async () => {
    if (!selectedCandidate) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/interviewer/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          candidateId: selectedCandidate.id,
          ...feedbackData
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      // Update the candidates list to reflect the feedback submission
      setCandidates(prev => 
        prev.map(c => 
          c.id === selectedCandidate.id 
            ? { ...c, feedbackSubmitted: true }
            : c
        )
      );

      handleCloseModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCandidates = candidates.filter(candidate =>
    candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    candidate.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <main className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading candidates...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.errorContainer}>
        <p className={styles.errorMessage}>{error}</p>
        <button 
          className={styles.retryButton}
          onClick={fetchCandidates}
        >
          Retry
        </button>
      </main>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Interviewer Dashboard</h1>
        <p className="text-sm text-gray-600 mt-1">Welcome to your interviewer dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Interviews</p>
              <h3 className="text-2xl font-bold text-gray-900">24</h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8A6 6 0 1016 8a6 6 0 000 12zM2.458 13.658A9.98 9.98 0 0112 20c5.523 0 10-4.477 10-10S17.523 2 12 2C6.477 2 2 6.477 2 12a9.98 9.98 0 013.542 7.542z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Upcoming Interviews</p>
              <h3 className="text-2xl font-bold text-gray-900">5</h3>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0l-3-3m3 3l3-3m-3-3v6m0 0l-3-3m3 3z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Feedback Pending</p>
              <h3 className="text-2xl font-bold text-gray-900">3</h3>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0l-3-3m3 3l3-3m-3-3v6m0 0l-3-3m3 3z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Average Rating</p>
              <h3 className="text-2xl font-bold text-gray-900">4.2</h3>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0l-3-3m3 3l3-3m-3-3v6m0 0l-3-3m3 3z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Interviews</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">John Smith</p>
                <p className="text-sm text-gray-500">Senior Software Engineer</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Today, 10:00 AM</p>
                <p className="text-sm text-gray-500">Technical Round</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Sarah Johnson</p>
                <p className="text-sm text-gray-500">Product Manager</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Tomorrow, 2:00 PM</p>
                <p className="text-sm text-gray-500">HR Round</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Feedback</h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium text-gray-900">Michael Brown</p>
                  <p className="text-sm text-gray-500">UX Designer</p>
                </div>
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  4.5/5
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Strong technical background and excellent communication skills.
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium text-gray-900">Emily Davis</p>
                  <p className="text-sm text-gray-500">Frontend Developer</p>
                </div>
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  4.2/5
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Good problem-solving skills and solid understanding of frontend technologies.
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className={styles.container}>
        <header className={styles.header}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Interviews</h1>
              <p className="text-sm text-gray-600 mt-1">Manage and provide feedback for your scheduled interviews</p>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search candidates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg
                className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </header>

        <section className={styles.candidatesGrid}>
          {filteredCandidates.length === 0 ? (
            <p className={styles.noResults}>No candidates found</p>
          ) : (
            filteredCandidates.map((candidate) => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                onViewDetailsClick={handleCandidateClick}
              />
            ))
          )}
        </section>

        {selectedCandidate && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Interview Feedback</h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  aria-label="Close modal"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{selectedCandidate.name}</h3>
                  <p className="text-sm text-gray-600">{selectedCandidate.role}</p>
                </div>
                
                <div className="space-y-6">
                  {['technicalSkills', 'problemSolving', 'communication', 'cultureFit'].map((skill) => (
                    <div key={skill} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 capitalize">
                        {skill.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                      <div className="flex items-center space-x-4">
                        <input
                          type="range"
                          min="0"
                          max="5"
                          step="0.5"
                          value={feedbackData[skill as keyof InterviewFeedbackData]}
                          onChange={(e) => handleFeedbackChange(skill as keyof InterviewFeedbackData, parseFloat(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <span className="text-sm font-medium text-gray-900 min-w-[3rem] text-center">
                          {feedbackData[skill as keyof InterviewFeedbackData]}/5
                        </span>
                      </div>
                    </div>
                  ))}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Strengths</label>
                      <textarea
                        value={feedbackData.strengths}
                        onChange={(e) => handleFeedbackChange('strengths', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        rows={3}
                        placeholder="List the candidate's key strengths..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Weaknesses</label>
                      <textarea
                        value={feedbackData.weaknesses}
                        onChange={(e) => handleFeedbackChange('weaknesses', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        rows={3}
                        placeholder="List areas for improvement..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Notes</label>
                      <textarea
                        value={feedbackData.notes}
                        onChange={(e) => handleFeedbackChange('notes', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        rows={3}
                        placeholder="Additional notes or observations..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Recommendation</label>
                      <select
                        value={feedbackData.recommendation}
                        onChange={(e) => handleFeedbackChange('recommendation', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        <option value="Strong Hire">Strong Hire</option>
                        <option value="Hire">Hire</option>
                        <option value="Hold">Hold</option>
                        <option value="No Hire">No Hire</option>
                      </select>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="rounded-md bg-red-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    onClick={handleCloseModal}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitFeedback}
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Submitting...
                      </span>
                    ) : (
                      'Submit Feedback'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 