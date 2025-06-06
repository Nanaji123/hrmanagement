'use client';

import { useState, useEffect } from 'react';
import { CalendarIcon, UserGroupIcon, BuildingOfficeIcon, ClockIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { SearchIcon } from 'lucide-react';

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
  cvUrl?: string;
}

export default function InterviewPanelPage() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated data - replace with actual API call
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
        notes: 'Focus on system design and problem-solving skills',
        cvUrl: 'https://drive.google.com/file/d/EXAMPLE_FILE_ID_1/view?usp=sharing'
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
        notes: 'Discuss leadership experience and team management',
        cvUrl: 'https://drive.google.com/file/d/EXAMPLE_FILE_ID_2/view?usp=sharing'
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
        notes: 'Focus on React and TypeScript skills',
        cvUrl: 'https://drive.google.com/file/d/EXAMPLE_FILE_ID_3/view?usp=sharing'
      },
      {
        id: '4',
        candidateName: 'Peter Jones',
        position: 'HR Specialist',
        department: 'Human Resources',
        interviewDate: '2024-03-22',
        interviewTime: '9:30 AM',
        interviewType: 'HR',
        status: 'Scheduled',
        panelMembers: ['Lisa Chen', 'David Wilson'],
        location: 'Virtual Meeting',
        duration: '30 minutes',
        notes: 'Review experience with recruitment software',
        cvUrl: 'https://drive.google.com/file/d/EXAMPLE_FILE_ID_4/view?usp=sharing'
      },
      {
        id: '5',
        candidateName: 'Mary Brown',
        position: 'Data Scientist',
        department: 'Analytics',
        interviewDate: '2024-03-22',
        interviewTime: '3:00 PM',
        interviewType: 'Technical',
        status: 'Scheduled',
        panelMembers: ['Alex Brown', 'Sarah Smith', 'Mike Johnson'],
        location: 'Conference Room A',
        duration: '1 hour',
        notes: 'Discuss machine learning projects and skills',
        cvUrl: 'https://drive.google.com/file/d/EXAMPLE_FILE_ID_5/view?usp=sharing'
      },
      {
        id: '6',
        candidateName: 'Robert Davis',
        position: 'UX Designer',
        department: 'Design',
        interviewDate: '2024-03-23',
        interviewTime: '10:00 AM',
        interviewType: 'Final',
        status: 'Scheduled',
        panelMembers: ['Sarah Smith', 'David Wilson'],
        location: 'Conference Room B',
        duration: '45 minutes',
        notes: 'Portfolio review and team fit discussion',
        cvUrl: 'https://drive.google.com/file/d/EXAMPLE_FILE_ID_6/view?usp=sharing'
      },
      {
        id: '7',
        candidateName: 'Laura Gomez',
        position: 'QA Engineer',
        department: 'Engineering',
        interviewDate: '2024-03-23',
        interviewTime: '1:30 PM',
        interviewType: 'Technical',
        status: 'Scheduled',
        panelMembers: ['Mike Johnson', 'Alex Brown'],
        location: 'Virtual Meeting',
        duration: '1 hour',
        notes: 'Focus on testing methodologies and tools',
        cvUrl: 'https://drive.google.com/file/d/EXAMPLE_FILE_ID_7/view?usp=sharing'
      },
      {
        id: '8',
        candidateName: 'James Lee',
        position: 'DevOps Engineer',
        department: 'IT',
        interviewDate: '2024-03-24',
        interviewTime: '11:00 AM',
        interviewType: 'Technical',
        status: 'Scheduled',
        panelMembers: ['Alex Brown'],
        location: 'Conference Room A',
        duration: '1 hour',
        notes: 'Discuss cloud infrastructure and CI/CD pipelines',
        cvUrl: 'https://drive.google.com/file/d/EXAMPLE_FILE_ID_8/view?usp=sharing'
      }
    ];

    setInterviews(mockInterviews);
    setLoading(false);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getInterviewsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const interviewsForDate = interviews.filter(interview => interview.interviewDate === dateStr);
    
    if (selectedStatus === 'All Status') {
      return interviewsForDate;
    } else {
      return interviewsForDate.filter(interview => interview.status === selectedStatus);
    }
  };

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  if (loading) {
    return (
      <div className="p-3">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  const todaysInterviews = getInterviewsForDate(selectedDate);

  return (
    <div className="maz-h-screen bg-gradient-to-b from-[#050d25] to-[#0d1021] px-6 py-30 text-white flex items-center justify-center">
      <div className="max-w-7xl w-full mx-auto bg-gradient-to-br from-cyan-400/40 via-blue-700/30 to-transparent rounded-3xl shadow-[0_0_40px_#00f7ff30] border border-[#2e314d] p-6 md:p-12">
        <div className="mb-4 p-6 rounded-2xl bg-[#0e101c] shadow-[0_0_20px_#00f7ff30] border border-[#2e314d] flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-cyan-200 drop-shadow-[0_0_10px_#00f7ff]">Interview Panel</h1>
            <p className="text-cyan-300">View and manage scheduled interviews</p>
          </div>
          <button onClick={() => window.history.back()} className="ml-4 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-[0_0_10px_#00f7ff80] hover:opacity-90 transition flex items-center">
            <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 mr-2' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' /></svg>
            Back
          </button>
        </div>
        <div className="mb-6 flex space-x-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-cyan-400" />
            </div>
            <input
              type="text"
              placeholder="Search by candidate name or position..."
              className="w-full pl-10 pr-3 py-2 rounded-xl bg-[#23264a] border border-cyan-400 text-cyan-100 placeholder-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
          <select 
            className="rounded-xl bg-[#23264a] border border-cyan-400 text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option>All Status</option>
            <option>Scheduled</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#181b2e] p-6 rounded-2xl shadow-[0_0_10px_#00f7ff30] border border-[#23264a] flex items-center space-x-4">
            <div className="flex-shrink-0">
              <CalendarIcon className="h-10 w-10 text-cyan-400" />
            </div>
            <div>
              <p className="text-cyan-300">Total Interviews</p>
              <p className="text-2xl font-semibold text-cyan-100">{interviews.length}</p>
            </div>
          </div>
          <div className="bg-[#181b2e] p-6 rounded-2xl shadow-[0_0_10px_#00f7ff30] border border-[#23264a] flex items-center space-x-4">
            <div className="flex-shrink-0">
              <ClockIcon className="h-10 w-10 text-emerald-400" />
            </div>
            <div>
              <p className="text-cyan-300">Scheduled</p>
              <p className="text-2xl font-semibold text-cyan-100">
                {interviews.filter(i => i.status === 'Scheduled').length}
              </p>
            </div>
          </div>
          <div className="bg-[#181b2e] p-6 rounded-2xl shadow-[0_0_10px_#00f7ff30] border border-[#23264a] flex items-center space-x-4">
            <div className="flex-shrink-0">
              <ClockIcon className="h-10 w-10 text-rose-400" />
            </div>
            <div>
              <p className="text-cyan-300">Cancelled</p>
              <p className="text-2xl font-semibold text-cyan-100">
                {interviews.filter(i => i.status === 'Cancelled').length}
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          {interviews.map((interview) => (
            <div key={interview.id} className="bg-[#181b2e] rounded-2xl shadow-[0_0_10px_#00f7ff30] border border-[#23264a] p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-cyan-100">{interview.candidateName}</h2>
                  <p className="text-cyan-300 text-sm">{interview.position}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${interview.status === 'Scheduled' ? 'bg-emerald-900/30 text-emerald-300' : interview.status === 'Completed' ? 'bg-blue-900/30 text-cyan-300' : 'bg-rose-900/30 text-rose-300'}`}>
                  {interview.status}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-cyan-100 text-sm mb-6">
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-4 w-4 text-cyan-400" />
                  <span>{interview.interviewDate}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ClockIcon className="h-4 w-4 text-cyan-400" />
                  <span>{interview.interviewTime}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BuildingOfficeIcon className="h-4 w-4 text-cyan-400" />
                  <span>{interview.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <UserGroupIcon className="h-4 w-4 text-cyan-400" />
                  <span>{interview.panelMembers.join(', ')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-cyan-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                  <span>john.doe@example.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-cyan-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.318l-3.97-1.985A1.659 1.659 0 0 0 15.75 14.12l-2.354 1.177c-.945.472-2.056-.42-2.056-1.47V9.568a3.916 3.916 0 0 1 1.059-2.708l1.175-1.175a1.659 1.659 0 0 0-.42-2.36l-1.985-3.97a2.25 2.25 0 0 0-1.318-1.318H6.75c-8.284 0-15 6.716-15 15v2.25z" />
                  </svg>
                  <span>+1 234-567-8900</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link href={`/dashboard/HR_RECRUiTER/interview_panel/${interview.id}`}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-[0_0_10px_#00f7ff80] hover:opacity-90 transition"
                >
                  View Details
                </Link>
                <button 
                  className="px-4 py-2 rounded-lg bg-gray-700 text-white font-semibold hover:bg-gray-600 transition"
                  onClick={() => alert(`Reschedule button clicked for interview ID: ${interview.id}`)}
                >
                  Reschedule
                </button>
                <button 
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-rose-500 to-rose-700 text-white font-semibold shadow-[0_0_10px_#ff005580] hover:opacity-90 transition"
                  onClick={() => alert(`Cancel button clicked for interview ID: ${interview.id}`)}
                >
                  Cancel
                </button>
                {interview.cvUrl && (
                  <a
                    href={interview.cvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-700 text-white font-semibold shadow-[0_0_10px_#a855f780] hover:opacity-90 transition"
                  >
                    View CV
                  </a>
                )}
                <Link
                  href={`/dashboard/HR_RECRUiTER/interview_panel/feedback?interviewId=${interview.id}`}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-600 text-white font-semibold shadow-[0_0_10px_#00f7ff80] hover:opacity-90 transition"
                >
                  Provide Feedback
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}