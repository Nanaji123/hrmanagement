"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
  Users, 
  FileText, 
  Clock, 
  CalendarIcon,
  Search,
  Bell
} from 'lucide-react';
import { StatCard } from '@/components/StatCard';
import { InterviewCard } from '@/components/InterviewCard';
import { InterviewCalendar } from '@/components/InterviewCalendar';
import { CandidateDetailModal } from '@/components/CandidateDetailModal';
import { useAuthFetch } from '@/hooks/useAuthFetch';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface Stats {
  totalInterviews: number;
  completedInterviews: number;
  upcomingInterviews: number;
  averageRating: number;
}

interface RecentFeedback {
  id: string;
  candidateName: string;
  position: string;
  recommendation: string;
}

interface Candidate {
  id: string;
  name: string;
  position: string;
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

export default function InterviewerDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const authFetch = useAuthFetch();
  const [user, setUser] = useState<{ name: string }>({ name: 'John Doe' });
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [filter, setFilter] = useState('All');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', message: 'You have 2 new interviews tomorrow', time: '2h ago', read: false },
    { id: '2', message: 'Feedback pending for Michael Brown', time: '4h ago', read: false },
  ]);

  const [stats, setStats] = useState<Stats>({
    totalInterviews: 25,
    completedInterviews: 18,
    upcomingInterviews: 7,
    averageRating: 4.5
  });
  const [recentFeedback, setRecentFeedback] = useState<RecentFeedback[]>([
    {
      id: '1',
      candidateName: 'Sarah Johnson',
      position: 'Senior Software Engineer',
      recommendation: 'Strong Hire'
    },
    {
      id: '2',
      candidateName: 'Michael Brown',
      position: 'Product Manager',
      recommendation: 'Hire'
    }
  ]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
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

  const [upcomingInterviews, setUpcomingInterviews] = useState<Interview[]>([
    {
      id: '1',
      candidate: 'Sarah Johnson',
      position: 'Senior Software Engineer',
      time: 'Today, 2:00 PM',
      type: 'Technical Round',
      status: 'Scheduled',
      date: new Date().toISOString()
    },
    {
      id: '2',
      candidate: 'Michael Brown',
      position: 'Product Manager',
      time: 'Tomorrow, 11:00 AM',
      type: 'Behavioral Round',
      status: 'Scheduled',
      date: new Date(Date.now() + 86400000).toISOString()
    },
    {
      id: '3',
      candidate: 'Emily Davis',
      position: 'UX Designer',
      time: 'Tomorrow, 3:30 PM',
      type: 'Portfolio Review',
      status: 'Scheduled',
      date: new Date(Date.now() + 86400000).toISOString()
    }
  ]);

  const [pendingFeedbacks, setPendingFeedbacks] = useState<Feedback[]>([
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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredInterviews = upcomingInterviews.filter(interview => 
    (filter === 'All' || interview.type === filter) &&
    interview.candidate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    } else if (status === 'authenticated' && session?.user?.role?.toLowerCase() !== 'interviewer') {
      router.push('/dashboard');
    }
  }, [status, session, router]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (status !== 'authenticated') return;

      try {
        setIsLoading(true);
        setError(null);

        // Fetch all data in parallel
        const [statsData, interviewsData, feedbackData, pendingData] = await Promise.all([
          authFetch('/api/interviewer/stats'),
          authFetch('/api/interviewer/interviews'),
          authFetch('/api/interviewer/feedback/recent'),
          authFetch('/api/interviewer/feedback/pending'),
        ]);

        setStats(statsData);
        setUpcomingInterviews(interviewsData);
        setRecentFeedback(feedbackData);
        setPendingFeedbacks(pendingData);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
        setIsInterviewsLoading(false);
      }
    };

    fetchDashboardData();
  }, [status, authFetch]);

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
      await authFetch('/api/interviewer/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          candidateId: selectedCandidate.id,
          ...feedbackData
        }),
      });

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

  if (status === 'loading') {
    return <LoadingSpinner size="lg" text="Loading dashboard..." fullScreen />;
  }

  if (status === 'unauthenticated') {
    return null; // Will redirect in useEffect
  }

  if (session?.user?.role?.toLowerCase() !== 'interviewer') {
    return null; // Will redirect in useEffect
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 text-rose-600">
        <div className="text-center">
          <div className="text-rose-500 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-lg font-medium text-gray-900 mb-2">Error Loading Dashboard</p>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchCandidates}
            className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name}</h1>
            <p className="text-gray-600">Here's what's happening with your interviews today.</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search interviews..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                value={searchTerm}
                onChange={handleSearch}
                aria-label="Search interviews"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <button
              className="relative p-2 text-gray-600 hover:text-gray-900"
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Toggle notifications"
            >
              <Bell className="h-6 w-6" />
              {notifications.some(n => !n.read) && (
                <span className="absolute top-0 right-0 h-2 w-2 bg-emerald-500 rounded-full" />
              )}
            </button>
          </div>
        </div>

        <ErrorBoundary>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              <>
                <LoadingSpinner size="md" text="Loading stats..." />
                <LoadingSpinner size="md" text="Loading stats..." />
                <LoadingSpinner size="md" text="Loading stats..." />
                <LoadingSpinner size="md" text="Loading stats..." />
              </>
            ) : (
              <>
                <StatCard
                  title="Total Interviews"
                  value={stats.totalInterviews}
                  icon={Users}
                  change="+12% from last month"
                  isPositive={true}
                />
                <StatCard
                  title="Completed"
                  value={stats.completedInterviews}
                  icon={FileText}
                  change="+8% from last month"
                  isPositive={true}
                />
                <StatCard
                  title="Upcoming"
                  value={stats.upcomingInterviews}
                  icon={Clock}
                  change="+3 new this week"
                  isPositive={true}
                />
                <StatCard
                  title="Average Rating"
                  value={stats.averageRating}
                  icon={CalendarIcon}
                  change="+0.2 from last month"
                  isPositive={true}
                />
              </>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Interview Calendar</h2>
                  <div className="flex items-center space-x-2">
                    <select
                      className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                    >
                      <option value="All">All Interviews</option>
                      <option value="Today">Today</option>
                      <option value="This Week">This Week</option>
                      <option value="This Month">This Month</option>
                    </select>
                  </div>
                </div>
                <InterviewCalendar
                  date={date}
                  onDateChange={setDate}
                  interviews={upcomingInterviews}
                />
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 mt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Interviews</h2>
                {isInterviewsLoading ? (
                  <div className="space-y-4">
                    <LoadingSpinner size="md" text="Loading interviews..." />
                    <LoadingSpinner size="md" text="Loading interviews..." />
                    <LoadingSpinner size="md" text="Loading interviews..." />
                  </div>
                ) : filteredInterviews.length === 0 ? (
                  <p className="text-gray-500">No interviews match your criteria.</p>
                ) : (
                  <div className="space-y-4">
                    {filteredInterviews.map((interview) => (
                      <InterviewCard
                        key={interview.id}
                        candidateName={interview.candidate}
                        role={interview.position}
                        interviewDate={new Date(interview.date).toLocaleDateString()}
                        interviewTime={interview.time}
                        interviewType={interview.type}
                        status={interview.status}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-1 space-y-8">
              {showNotifications && (
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Notifications</h2>
                  <div className="space-y-4">
                    {notifications.length === 0 ? (
                      <p className="text-gray-500">No new notifications.</p>
                    ) : (
                      notifications.map(notification => (
                        <div key={notification.id} className={`p-3 rounded-md ${notification.read ? 'bg-gray-100 text-gray-900' : 'bg-emerald-50 text-emerald-700'}`}>
                          <p className="text-sm font-medium">{notification.message}</p>
                          <p className="text-xs mt-1">{notification.time}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Feedback</h2>
                {isLoading ? (
                  <LoadingSpinner size="md" text="Loading feedback..." />
                ) : recentFeedback.length === 0 ? (
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
                {isLoading ? (
                  <LoadingSpinner size="md" text="Loading pending feedback..." />
                ) : pendingFeedbacks.length === 0 ? (
                  <p className="text-gray-500">No pending feedback.</p>
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
    </div>
  );
}