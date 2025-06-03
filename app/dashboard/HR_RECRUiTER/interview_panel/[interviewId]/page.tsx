'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
// Import necessary icons if needed for the details page
import styles from './page.module.css';

interface Interview {
  id: string;
  candidateName: string;
  position: string;
  department: string;
  interviewDate: string;
  interviewTime: string;
  interviewType: 'Technical' | 'HR' | 'Final';
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  panelMembers: string[];
  location: string;
  duration: string;
  notes?: string;
}

// Simulated data (same as on the panel page for now)
const mockInterviews: Interview[] = [
  {
    id: '1',
    candidateName: 'John Doe',
    position: 'Senior Software Engineer',
    department: 'Engineering',
    interviewDate: '2024-03-20',
    interviewTime: '10:00 AM',
    interviewType: 'Technical',
    status: 'Scheduled',
    panelMembers: ['Sarah Smith', 'Mike Johnson', 'Alex Brown'],
    location: 'Conference Room A',
    duration: '1 hour',
    notes: 'Focus on system design and problem-solving skills'
  },
  {
    id: '2',
    candidateName: 'Jane Smith',
    position: 'Product Manager',
    department: 'Product',
    interviewDate: '2024-03-20',
    interviewTime: '2:00 PM',
    interviewType: 'HR',
    status: 'Scheduled',
    panelMembers: ['David Wilson', 'Lisa Chen'],
    location: 'Virtual Meeting',
    duration: '45 minutes',
    notes: 'Discuss leadership experience and team management'
  },
  {
    id: '3',
    candidateName: 'Mike Johnson',
    position: 'Frontend Developer',
    department: 'Engineering',
    interviewDate: '2024-03-21',
    interviewTime: '11:00 AM',
    interviewType: 'Technical',
    status: 'Scheduled',
    panelMembers: ['Alex Brown', 'Sarah Smith'],
    location: 'Conference Room B',
    duration: '1 hour',
    notes: 'Focus on React and TypeScript skills'
  }
];

export default function InterviewDetailsPage() {
  const params = useParams();
  const interviewId = params.interviewId as string;
  const [interview, setInterview] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterviewDetails = async () => {
      setLoading(true);
      // Simulate fetching data from an API
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network latency
      
      const foundInterview = mockInterviews.find(int => int.id === interviewId);
      setInterview(foundInterview || null);
      setLoading(false);
    };

    if (interviewId) {
      fetchInterviewDetails();
    }

  }, [interviewId]); // Re-run effect if interviewId changes

  if (loading) {
    return <div className="p-6">Loading interview details...</div>;
  }

  if (!interview) {
    return <div className="p-6 text-red-500">Interview not found.</div>;
  }

  // Basic styling for display
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050d25] to-[#0d1021] px-6 py-10 text-white flex items-center justify-center">
      <div className="max-w-3xl w-full mx-auto bg-gradient-to-br from-cyan-400/40 via-blue-700/30 to-transparent rounded-3xl shadow-[0_0_40px_#00f7ff30] border border-[#2e314d] p-8 md:p-12 relative">
        <button
          onClick={() => window.history.back()}
          className="absolute top-6 right-6 p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-cyan-200 transition"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <h1 className="text-3xl font-bold text-cyan-200 drop-shadow-[0_0_10px_#00f7ff] mb-8">Interview Details</h1>
        <div className="space-y-6 text-cyan-100">
          <p><span className="font-semibold text-cyan-300">Candidate:</span> {interview.candidateName}</p>
          <p><span className="font-semibold text-cyan-300">Position:</span> {interview.position}</p>
          <p><span className="font-semibold text-cyan-300">Department:</span> {interview.department}</p>
          <p><span className="font-semibold text-cyan-300">Date:</span> {interview.interviewDate}</p>
          <p><span className="font-semibold text-cyan-300">Time:</span> {interview.interviewTime}</p>
          <p><span className="font-semibold text-cyan-300">Type:</span> {interview.interviewType}</p>
          <p><span className="font-semibold text-cyan-300">Status:</span> <span className={`px-3 py-1 rounded-full text-xs font-semibold ${interview.status === 'Scheduled' ? 'bg-emerald-900/30 text-emerald-300' : interview.status === 'Completed' ? 'bg-blue-900/30 text-cyan-300' : 'bg-rose-900/30 text-rose-300'}`}>{interview.status}</span></p>
          <p><span className="font-semibold text-cyan-300">Panel Members:</span> {interview.panelMembers.join(', ')}</p>
          <p><span className="font-semibold text-cyan-300">Location:</span> {interview.location}</p>
          <p><span className="font-semibold text-cyan-300">Duration:</span> {interview.duration}</p>
          <p><span className="font-semibold text-cyan-300">Notes:</span> {interview.notes || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
}