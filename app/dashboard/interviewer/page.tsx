"use client";

import React, { useState, useEffect } from 'react';
import styles from './InterviewerPage.module.css';
import { CandidateCard } from './components/CandidateCard';
import { CandidateDetailModal } from './components/CandidateDetailModal';
import { Candidate, InterviewFeedbackData, InterviewHistoryItem } from './types/index';
import { useRouter } from 'next/navigation';
import { Calendar, Users, FileText, Clock } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  change: string;
  isPositive: boolean;
}

const StatCard = ({ title, value, icon: Icon, change, isPositive }: StatCardProps) => (
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

interface UpcomingInterview {
  candidate: string;
  position: string;
  time: string;
  type: string;
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
    fetchCandidates();
    fetchInterviews();
  }, []);

  useEffect(() => {
    const filtered = interviews.filter(interview => 
      interview.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interview.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredInterviews(filtered);
  }, [searchQuery, interviews]);

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

  const handleFeedbackChange = (field: keyof InterviewFeedbackData, value: string | number | string) => {
    console.log(`Feedback field ${field} changed to ${value}`);
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
        <h1 className="text-2xl font-bold text-gray-900">Interviewer Dashboard</h1>
        <p className="text-sm text-gray-600 mt-1">Welcome to your interviewer dashboard</p>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Upcoming Interviews"
            value={8}
            icon={Calendar}
            change="+2 from yesterday"
            isPositive={true}
          />
          <StatCard
            title="Candidates Reviewed"
            value={24}
            icon={Users}
            change="+5 this week"
            isPositive={true}
          />
          <StatCard
            title="Feedback Pending"
            value={3}
            icon={FileText}
            change="-2 from yesterday"
            isPositive={false}
          />
          <StatCard
            title="Average Interview Time"
            value="45m"
            icon={Clock}
            change="+5m from last week"
            isPositive={true}
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Upcoming Interviews</h2>
          <div className="space-y-4">
            {upcomingInterviews.map((interview, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div>
                  <h3 className="font-semibold text-gray-900">{interview.candidate}</h3>
                  <p className="text-sm text-gray-600">{interview.position}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{interview.time}</p>
                  <p className="text-xs text-gray-600">{interview.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 