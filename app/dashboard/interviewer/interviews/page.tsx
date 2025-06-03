"use client";

import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Candidate } from '../types';
import FeedbackForm from '../components/FeedbackForm';
import { useRouter } from "next/navigation";

export default function InterviewsPage() {
  const router = useRouter();
  const [interviews, setInterviews] = useState<Candidate[]>([]);
  const [selectedInterview, setSelectedInterview] = useState<Candidate | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const role = localStorage.getItem("userRole");
      if (role !== "interviewer") {
        router.push("/auth/login");
      }
    }
  }, [router]);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/interviewer/interviews');
      if (!response.ok) throw new Error('Failed to fetch interviews');
      const data = await response.json();
      setInterviews(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching interviews');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (value: any) => {
    if (value instanceof Date) {
      setSelectedDate(value);
    } else if (Array.isArray(value) && value[0] instanceof Date) {
       // Handle range selection if necessary, or just take the first date
       setSelectedDate(value[0]);
    }
  };

  const handleFeedbackSubmit = async () => {
    if (!selectedInterview) return;

    try {
      // Assuming feedback submission logic is handled within FeedbackForm
      // No action needed here other than closing the modal and updating state if necessary
      setInterviews(interviews.map(interview =>
        interview.id === selectedInterview.id
          ? { ...interview, feedbackSubmitted: true } // Example: Mark as submitted locally
          : interview
      ));
      setShowFeedbackForm(false);
      setSelectedInterview(null);
    } catch (err) {
      console.error(err);
      // Handle error submitting feedback if needed
    }
  };

  const filteredInterviews = interviews.filter(interview => {
    const matchesSearch = interview.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interview.role.toLowerCase().includes(searchQuery.toLowerCase());

    const interviewDate = new Date(interview.interviewDate).toDateString();
    const selected = selectedDate?.toDateString();
    const matchesDate = selected ? interviewDate === selected : true; // Match all if no date selected

    const matchesType = filterType === '' || interview.interviewType === filterType;

    return matchesSearch && matchesDate && matchesType;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
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
        <div className="text-center max-w-sm p-4 bg-red-50 rounded-md">
          <p className="text-red-600 font-semibold mb-2">Error Loading Interviews</p>
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchInterviews}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (interviews.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 text-lg">No interviews found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050d25] to-[#0d1021] px-6 py-10 text-white flex items-center justify-center">
      <div className="max-w-7xl w-full mx-auto bg-[#0e101c] rounded-3xl shadow-[0_0_40px_#00f7ff30] border border-[#2e314d] p-8 md:p-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Interviews</h1>
          <p className="text-base text-gray-700">Manage interviews and submit feedback</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Date</h2>
            <div className="calendar-wrapper">
              <Calendar
                onChange={handleDateChange}
                value={selectedDate}
                className="w-full border-0 rounded-lg"
                tileClassName={({ date }) => {
                  const hasInterview = interviews.some(
                    interview => new Date(interview.interviewDate).toDateString() === date.toDateString()
                  );
                  return hasInterview ? 'bg-blue-50 text-blue-600 font-semibold' : '';
                }}
                tileContent={({ date }) => {
                  const interviewCount = interviews.filter(
                    interview => new Date(interview.interviewDate).toDateString() === date.toDateString()
                  ).length;
                  return interviewCount > 0 ? (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                      <span className="text-xs font-medium text-blue-600">{interviewCount}</span>
                    </div>
                  ) : null;
                }}
                minDetail="month"
                next2Label={null}
                prev2Label={null}
                formatShortWeekday={(locale, date) => {
                  return ['S', 'M', 'T', 'W', 'T', 'F', 'S'][date.getDay()];
                }}
              />
            </div>
            <style jsx global>{`
              .calendar-wrapper {
                .react-calendar {
                  width: 100%;
                  border: none;
                  font-family: inherit;
                }
                .react-calendar__navigation {
                  margin-bottom: 1rem;
                }
                .react-calendar__navigation button {
                  min-width: 44px;
                  background: none;
                  font-size: 1rem;
                  font-weight: 600;
                  color: #1f2937;
                }
                .react-calendar__navigation button:enabled:hover,
                .react-calendar__navigation button:enabled:focus {
                  background-color: #f3f4f6;
                  border-radius: 0.5rem;
                }
                .react-calendar__month-view__weekdays {
                  text-align: center;
                  text-transform: uppercase;
                  font-weight: 600;
                  font-size: 0.875rem;
                  color: #4b5563;
                }
                .react-calendar__month-view__weekdays__weekday {
                  padding: 0.5rem;
                }
                .react-calendar__month-view__weekdays__weekday abbr {
                  text-decoration: none;
                }
                .react-calendar__tile {
                  padding: 1rem 0.5rem;
                  background: none;
                  text-align: center;
                  line-height: 1.5;
                  font-size: 0.875rem;
                  color: #1f2937;
                  position: relative;
                }
                .react-calendar__tile:enabled:hover,
                .react-calendar__tile:enabled:focus {
                  background-color: #f3f4f6;
                  border-radius: 0.5rem;
                }
                .react-calendar__tile--now {
                  background-color: #e5e7eb;
                  border-radius: 0.5rem;
                  font-weight: 600;
                }
                .react-calendar__tile--active {
                  background-color: #2563eb !important;
                  color: white !important;
                  border-radius: 0.5rem;
                  font-weight: 600;
                }
                .react-calendar__tile--hasActive {
                  background-color: #dbeafe;
                  border-radius: 0.5rem;
                }
              }
            `}</style>
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="interviewType" className="block text-sm font-medium text-gray-700 mb-2">
                Interview Type
              </label>
              <select
                id="interviewType"
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                onChange={(e) => setFilterType(e.target.value)}
                value={filterType}
              >
                <option value="">All Types</option>
                <option value="Technical">Technical</option>
                <option value="HR">HR</option>
                <option value="Managerial">Managerial</option>
              </select>
            </div>
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Candidates
              </label>
              <input
                id="search"
                type="text"
                placeholder="Search by name or role"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
        </div>

        {filteredInterviews.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-lg text-gray-700">No interviews found for selected criteria.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredInterviews.map(interview => (
              <div key={interview.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">{interview.name}</h2>
                    <p className="text-base text-gray-700 mb-1">Role: {interview.role}</p>
                    <p className="text-base text-gray-700">Type: {interview.interviewType}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-medium text-gray-900">{interview.interviewDate}</p>
                    <p className="text-base text-gray-700">{interview.interviewTime}</p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href={interview.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-primary text-white text-base font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    Join Meeting
                  </a>
                  <a
                    href={interview.resumeLink}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 border border-gray-300 text-base font-medium text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    View Resume
                  </a>
                  <button
                    onClick={() => {
                      setSelectedInterview(interview);
                      setShowFeedbackForm(true);
                    }}
                    className="px-4 py-2 border border-gray-300 text-base font-medium text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showFeedbackForm && selectedInterview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
            <div className="bg-white p-8 rounded-lg w-full max-w-xl max-h-[90vh] overflow-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Feedback for {selectedInterview.name}</h2>
                <button 
                  onClick={() => setShowFeedbackForm(false)} 
                  className="text-gray-500 hover:text-gray-700 text-xl font-medium"
                >
                  ✕
                </button>
              </div>
              <FeedbackForm
                interviewId={selectedInterview.id}
                candidateName={selectedInterview.name}
                onSubmit={handleFeedbackSubmit}
                onCancel={() => setShowFeedbackForm(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}