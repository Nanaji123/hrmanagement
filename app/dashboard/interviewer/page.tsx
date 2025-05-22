"use client";

import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Users, FileText, Clock, Bell, Search, Filter, CheckCircle, MessageSquare, Eye } from 'lucide-react';
import { InterviewCalendar } from './components/InterviewCalendar';
import styles from './InterviewerPage.module.css';
import { CandidateCard } from './components/CandidateCard';
import { CandidateDetailModal } from './components/CandidateDetailModal';
import { Candidate, InterviewFeedbackData, InterviewHistoryItem } from './types/index';
import { useRouter } from 'next/navigation';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  change: string;
  isPositive: boolean;
}

const StatCard = ({ title, value, icon: Icon, change, isPositive }: StatCardProps) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      <Icon className="h-5 w-5 text-primary" />
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
  <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
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

interface Interview {
  id: string;
  candidate: string;
  position: string;
  time: string;
  type: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
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

  const [date, setDate] = useState<Date>(new Date());
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', message: 'You have 2 new interviews tomorrow', time: '2h ago', read: false },
    { id: '2', message: 'Feedback pending for Michael Brown', time: '4h ago', read: false },
  ]);

  const [upcomingInterviews] = useState<Interview[]>([
    {
      id: '1',
      candidate: 'Sarah Johnson',
      position: 'Senior Software Engineer',
      time: 'Today, 2:00 PM',
      type: 'Technical Round',
      status: 'Scheduled'
    },
    {
      id: '2',
      candidate: 'Michael Brown',
      position: 'Product Manager',
      time: 'Tomorrow, 11:00 AM',
      type: 'Behavioral Round',
      status: 'Scheduled'
    },
    {
      id: '3',
      candidate: 'Emily Davis',
      position: 'UX Designer',
      time: 'Tomorrow, 3:30 PM',
      type: 'Portfolio Review',
      status: 'Scheduled'
    }
  ]);

  const [pendingFeedbacks] = useState<Feedback[]>([
    {
      id: '1',
      candidate: 'Sarah Johnson',
      deadline: 'Today',
      status: 'Pending'
    },
    {
      id: '2',
      candidate: 'Michael Brown',
      deadline: 'Tomorrow',
      status: 'Pending'
    }
  ]);

  const [isInterviewsLoading, setIsInterviewsLoading] = useState(true);

  const filteredInterviews = upcomingInterviews.filter(interview => 
    (filter === 'All' || interview.type === filter) &&
    interview.candidate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchCandidates();
    const timer = setTimeout(() => {
      setIsInterviewsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
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

  const handleDateChange = (newDate: Date) => {
    setDate(newDate);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
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
          <p className="text-lg font-medium text-gray-900 mb-2">Error Loading Dashboard</p>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchCandidates}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary"
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
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Interviewer Dashboard</h1>
        <p className="text-lg text-gray-700">Welcome back! Here's your interview overview</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <StatCard
              title="Upcoming Interviews"
              value={8}
              icon={CalendarIcon}
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

          {/* Calendar */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Interview Calendar</h2>
            <div className="calendar-wrapper">
              <InterviewCalendar
                value={date}
                onChange={handleDateChange}
              />
            </div>
            <style jsx global>{`
              .calendar-wrapper {
                .react-calendar {
                  width: 100%;
                  border: none;
                  font-family: inherit;
                  background: white;
                  padding: 0.75rem;
                }
                .react-calendar__navigation {
                  margin-bottom: 1rem;
                }
                .react-calendar__navigation button {
                  min-width: 36px;
                  background: none;
                  font-size: 0.875rem;
                  font-weight: 600;
                  color: #1f2937;
                  padding: 0.375rem;
                }
                .react-calendar__navigation button:enabled:hover,
                .react-calendar__navigation button:enabled:focus {
                  background-color: #f3f4f6;
                  border-radius: 0.375rem;
                }
                .react-calendar__month-view__weekdays {
                  text-align: center;
                  text-transform: uppercase;
                  font-weight: 600;
                  font-size: 0.75rem;
                  color: #4b5563;
                  margin-bottom: 0.25rem;
                }
                .react-calendar__month-view__weekdays__weekday {
                  padding: 0.5rem;
                }
                .react-calendar__month-view__weekdays__weekday abbr {
                  text-decoration: none;
                }
                .react-calendar__tile {
                  padding: 0.75rem 0.25rem;
                  background: none;
                  text-align: center;
                  line-height: 1.5;
                  font-size: 0.875rem;
                  color: #1f2937;
                  position: relative;
                  border-radius: 0.375rem;
                }
                .react-calendar__tile:enabled:hover,
                .react-calendar__tile:enabled:focus {
                  background-color: #f3f4f6;
                  border-radius: 0.375rem;
                }
                .react-calendar__tile--now {
                  background-color: #e5e7eb;
                  border-radius: 0.375rem;
                  font-weight: 600;
                }
                .react-calendar__tile--active {
                  background-color: #2563eb !important;
                  color: white !important;
                  border-radius: 0.375rem;
                  font-weight: 600;
                }
                .react-calendar__tile--hasActive {
                  background-color: #dbeafe;
                  border-radius: 0.375rem;
                }
              }
            `}</style>
          </div>

          {/* Upcoming Interviews */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
              <h2 className="text-2xl font-bold text-gray-900">Upcoming Interviews</h2>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-900 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                aria-label="Filter interviews by type"
              >
                <option value="All">All Types</option>
                <option value="Technical Round">Technical Round</option>
                <option value="Behavioral Round">Behavioral Round</option>
                <option value="Portfolio Review">Portfolio Review</option>
              </select>
            </div>
            {isInterviewsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-24 bg-gray-200 rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredInterviews.map((interview) => (
                  <div key={interview.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors duration-200">
                    <div>
                      <h3 className="font-semibold text-gray-900">{interview.candidate}</h3>
                      <p className="text-sm text-gray-600">{interview.position}</p>
                      <p className="text-sm text-gray-500 mt-1">{interview.type}</p>
                    </div>
                    <div className="mt-4 sm:mt-0 text-right">
                      <p className="text-sm font-medium text-gray-900">{interview.time}</p>
                      <div className="flex space-x-2 mt-2">
                        <button 
                          className="p-1 hover:bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-primary" 
                          title="Mark Complete"
                          aria-label="Mark interview as complete"
                        >
                          <CheckCircle className="h-5 w-5 text-green-600" aria-hidden="true" />
                        </button>
                        <button 
                          className="p-1 hover:bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-primary" 
                          title="Add Feedback"
                          aria-label="Add interview feedback"
                        >
                          <MessageSquare className="h-5 w-5 text-blue-600" aria-hidden="true" />
                        </button>
                        <button 
                          className="p-1 hover:bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-primary" 
                          title="View Details"
                          aria-label="View interview details"
                        >
                          <Eye className="h-5 w-5 text-gray-600" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Pending Feedback */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Pending Feedback</h2>
            <div className="space-y-4">
              {pendingFeedbacks.map((feedback) => (
                <div key={feedback.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors duration-200">
                  <div>
                    <h3 className="font-semibold text-gray-900">{feedback.candidate}</h3>
                    <p className="text-sm text-gray-500">Due: {feedback.deadline}</p>
                  </div>
                  <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                    {feedback.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Performance Overview</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg Feedback Time</span>
                <span className="font-semibold text-gray-900">12h</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Interview Satisfaction</span>
                <span className="font-semibold text-gray-900">4.7/5</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">On-Time Interviews</span>
                <span className="font-semibold text-gray-900">95%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">No-Shows</span>
                <span className="font-semibold text-gray-900">1</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 