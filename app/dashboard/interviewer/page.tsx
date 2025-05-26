"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Users, FileText, Clock } from 'lucide-react';
import { CandidateDetailModal } from '@/components/CandidateDetailModal';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { validateFeedback, type FeedbackFormData } from '@/lib/validations';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  change: string;
  isPositive: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, change, isPositive }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      <Icon className="h-5 w-5 text-emerald-600" />
    </div>
    <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
    <div className="mt-2 flex items-center">
      <span className={`text-sm font-medium ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
        {change}
      </span>
    </div>
  </div>
);

interface UpcomingInterview {
  candidate: string;
  position: string;
  time: string;
  type: string;
}

interface InterviewCardProps {
  id: string;
  candidateName: string;
  position: string;
  recommendation: string;
}

interface Candidate {
  id: string;
  name: string;
  position: string;
  role: string;
  status: string;
  feedbackSubmitted: boolean;
  history?: Array<{
    date: string;
    type: string;
    status: string;
  }>;
}

interface InterviewFeedbackData {
  technicalSkills: number;
  problemSolving: number;
  communication: number;
  cultureFit: number;
  strengths: string;
  weaknesses: string;
  notes: string;
  recommendation: string;
}

interface Interview {
  id: string;
  candidate: string;
  position: string;
  time: string;
  type: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  date: string;
}

interface Feedback {
  id: string;
  candidate: string;
  deadline: string;
  status: 'Pending' | 'Submitted';
}

interface Notification {
  id: string;
  message: string;
  time: string;
  read: boolean;
}

interface CandidateDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: Candidate;
  onSubmitFeedback: () => Promise<void>;
  isSubmitting?: boolean;
}

export default function InterviewerDashboard() {
  const router = useRouter();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stats, setStats] = useState({
    totalInterviews: 0,
    completedInterviews: 0,
    upcomingInterviews: 0,
    averageRating: 0
  });
  const [recentFeedback, setRecentFeedback] = useState<InterviewCardProps[]>([]);
  const [pendingFeedbacks, setPendingFeedbacks] = useState<Feedback[]>([]);
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

  const [upcomingInterviews] = useState<UpcomingInterview[]>([
    {
      candidate: 'Sarah Johnson',
      position: 'Senior Software Engineer',
      time: 'Today, 2:00 PM',
      type: 'Technical Round'
    },
    {
      candidate: 'Michael Brown',
      position: 'Product Manager',
      time: 'Tomorrow, 11:00 AM',
      type: 'Behavioral Round'
    },
    {
      candidate: 'Emily Davis',
      position: 'UX Designer',
      time: 'Tomorrow, 3:30 PM',
      type: 'Portfolio Review'
    }
  ]);

  const [interviews, setInterviews] = useState<Candidate[]>([]);
  const [filteredInterviews, setFilteredInterviews] = useState<Candidate[]>([]);
  const [selectedInterview, setSelectedInterview] = useState<Candidate | null>(null);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    const filtered = interviews.filter(interview => 
      interview.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interview.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredInterviews(filtered);
  }, [searchQuery, interviews]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [statsRes, candidatesRes, feedbackRes, pendingRes] = await Promise.all([
        fetch('/api/interviewer/stats'),
        fetch('/api/interviewer/candidates'),
        fetch('/api/interviewer/feedbacks'),
        fetch('/api/interviewer/feedbacks/pending')
      ]);

      if (!statsRes.ok || !candidatesRes.ok || !feedbackRes.ok || !pendingRes.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const [statsData, candidatesData, feedbackData, pendingData] = await Promise.all([
        statsRes.json(),
        candidatesRes.json(),
        feedbackRes.json(),
        pendingRes.json()
      ]);

      setStats(statsData);
      setCandidates(candidatesData);
      setRecentFeedback(feedbackData);
      setPendingFeedbacks(pendingData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCandidateClick = (candidate: Candidate) => {
    const candidateWithHistory = { ...candidate, history: candidate.history || [] };
    setSelectedCandidate(candidateWithHistory);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCandidate(null);
  };

  const handleFeedbackChange = (field: keyof InterviewFeedbackData, value: string | number) => {
    console.log(`Feedback field ${field} changed to ${value}`);
    setFeedbackData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitFeedback = async (feedback: FeedbackFormData) => {
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
          ...feedback
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      setCandidates(prev => 
        prev.map(c => 
          c.id === selectedCandidate.id 
            ? { ...c, feedbackSubmitted: true }
            : c
        )
      );

      await fetchDashboardData();
      handleCloseModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
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
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="text-rose-500 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-lg font-medium text-gray-900 mb-2">Error Loading Dashboard</p>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
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
        <h1 className="text-2xl font-bold text-gray-900">Interviewer Dashboard</h1>
        <p className="text-sm text-gray-600 mt-1">Welcome to your interviewer dashboard</p>
      </div>

      <ErrorBoundary>
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Interviews"
              value={stats.totalInterviews}
              icon={Calendar}
              change={`${stats.upcomingInterviews} upcoming`}
              isPositive={true}
            />
            <StatCard
              title="Completed Interviews"
              value={stats.completedInterviews}
              icon={Users}
              change={`${stats.completedInterviews} total`}
              isPositive={true}
            />
            <StatCard
              title="Feedback Pending"
              value={pendingFeedbacks.length}
              icon={FileText}
              change={`${pendingFeedbacks.length} remaining`}
              isPositive={pendingFeedbacks.length === 0}
            />
            <StatCard
              title="Average Rating"
              value={stats.averageRating.toFixed(1)}
              icon={Clock}
              change="out of 5.0"
              isPositive={stats.averageRating >= 3.5}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Feedback</h2>
              {recentFeedback.length === 0 ? (
                <p className="text-gray-500">No recent feedback submitted</p>
              ) : (
                <div className="space-y-4">
                  {recentFeedback.map((feedback) => (
                    <div key={feedback.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{feedback.candidateName}</h3>
                          <p className="text-sm text-gray-500">{feedback.position}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          feedback.recommendation === 'Strong Hire' ? 'bg-emerald-100 text-emerald-800' :
                          feedback.recommendation === 'Hire' ? 'bg-green-100 text-green-800' :
                          feedback.recommendation === 'No Hire' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {feedback.recommendation}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Pending Feedback</h2>
              {pendingFeedbacks.length === 0 ? (
                <p className="text-gray-500">No pending feedback</p>
              ) : (
                <div className="space-y-4">
                  {pendingFeedbacks.map(feedback => (
                    <div key={feedback.id} className="p-4 rounded-md bg-emerald-50 text-emerald-700 flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">{feedback.candidate}</p>
                        <p className="text-xs mt-1">Due: {feedback.deadline}</p>
                      </div>
                      <button
                        onClick={() => router.push(`/dashboard/interviewer/interviews/${feedback.id}/feedback`)}
                        className="text-emerald-700 hover:text-emerald-800 focus:outline-none text-sm"
                        aria-label={`Submit feedback for ${feedback.candidate}`}
                      >
                        Submit <span aria-hidden="true">&rarr;</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </ErrorBoundary>

      {selectedCandidate && (
        <CandidateDetailModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          candidate={selectedCandidate}
          onSubmitFeedback={handleSubmitFeedback}
        />
      )}
    </div>
  );
}