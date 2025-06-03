'use client';

import { useState, useEffect } from 'react';

interface Interview {
  id: string;
  candidateName: string;
  position: string;
  interviewer: string;
  date: string;
  time: string;
  type: 'Technical' | 'HR' | 'Final';
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  notes?: string;
}

// Initial data for first-time users
const initialInterviews: Interview[] = [
  {
    id: '1',
    candidateName: 'John Smith',
    position: 'Senior Software Engineer',
    interviewer: 'Sarah Wilson',
    date: '2024-03-20',
    time: '10:00 AM',
    type: 'Technical',
    status: 'Scheduled',
    notes: 'Focus on system design and problem-solving skills'
  },
  {
    id: '2',
    candidateName: 'Sarah Johnson',
    position: 'Product Manager',
    interviewer: 'Michael Brown',
    date: '2024-03-20',
    time: '2:00 PM',
    type: 'HR',
    status: 'Scheduled',
    notes: 'Discuss leadership experience and team management'
  },
  {
    id: '3',
    candidateName: 'Michael Brown',
    position: 'UX Designer',
    interviewer: 'Emily Davis',
    date: '2024-03-21',
    time: '11:00 AM',
    type: 'Final',
    status: 'Scheduled',
    notes: 'Final round with design team lead'
  }
];

export default function InterviewsPage() {
  // Load interviews from localStorage or use initial data
  const [interviews, setInterviews] = useState<Interview[]>(() => {
    if (typeof window !== 'undefined') {
      const savedInterviews = localStorage.getItem('interviews');
      return savedInterviews ? JSON.parse(savedInterviews) : initialInterviews;
    }
    return initialInterviews;
  });

  // Save interviews to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('interviews', JSON.stringify(interviews));
    }
  }, [interviews]);

  const [showNewInterviewForm, setShowNewInterviewForm] = useState(false);
  const [newInterview, setNewInterview] = useState<Partial<Interview>>({
    candidateName: '',
    position: '',
    interviewer: '',
    date: '',
    time: '',
    type: 'Technical',
    status: 'Scheduled'
  });

  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [rescheduleData, setRescheduleData] = useState({
    date: '',
    time: ''
  });

  const handleCreateInterview = () => {
    if (newInterview.candidateName && newInterview.position && newInterview.interviewer && newInterview.date && newInterview.time) {
      const interview: Interview = {
        id: Date.now().toString(),
        candidateName: newInterview.candidateName,
        position: newInterview.position,
        interviewer: newInterview.interviewer,
        date: newInterview.date,
        time: newInterview.time,
        type: newInterview.type as 'Technical' | 'HR' | 'Final',
        status: 'Scheduled'
      };
      setInterviews([interview, ...interviews]);
      setShowNewInterviewForm(false);
      setNewInterview({
        candidateName: '',
        position: '',
        interviewer: '',
        date: '',
        time: '',
        type: 'Technical',
        status: 'Scheduled'
      });
    }
  };

  const handleReschedule = () => {
    if (selectedInterview && rescheduleData.date && rescheduleData.time) {
      setInterviews(interviews.map(interview => 
        interview.id === selectedInterview.id 
          ? { 
              ...interview, 
              date: rescheduleData.date, 
              time: rescheduleData.time,
              status: 'Scheduled'
            }
          : interview
      ));
      setShowRescheduleModal(false);
      setSelectedInterview(null);
      setRescheduleData({ date: '', time: '' });
    }
  };

  const handleCancel = () => {
    if (selectedInterview) {
      setInterviews(interviews.map(interview => 
        interview.id === selectedInterview.id 
          ? { ...interview, status: 'Cancelled' }
          : interview
      ));
      setShowCancelModal(false);
      setSelectedInterview(null);
    }
  };

  const getStatusColor = (status: Interview['status']) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-50 text-blue-700';
      case 'Completed': return 'bg-emerald-50 text-emerald-700';
      case 'Cancelled': return 'bg-rose-50 text-rose-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  const getTypeColor = (type: Interview['type']) => {
    switch (type) {
      case 'Technical': return 'bg-purple-50 text-purple-700';
      case 'HR': return 'bg-amber-50 text-amber-700';
      case 'Final': return 'bg-teal-50 text-teal-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050d25] to-[#0d1021] px-6 py-10 text-white flex items-center justify-center">
      <div className="w-full p-8 md:p-12">
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-cyan-200 drop-shadow-[0_0_10px_#00f7ff]">Interviews</h1>
            <button
              onClick={() => setShowNewInterviewForm(true)}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-[0_0_15px_#00f7ff80] hover:opacity-90 transition text-base"
            >
              Schedule Interview
            </button>
          </div>

          {showNewInterviewForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
              <div className="bg-[#181b2e] rounded-2xl p-8 w-full max-w-lg shadow-[0_0_40px_#00f7ff80] border border-cyan-400">
                <h2 className="text-2xl font-bold text-cyan-200 mb-6">Schedule New Interview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-cyan-100 mb-2">Candidate Name</label>
                    <input
                      type="text"
                      value={newInterview.candidateName}
                      onChange={(e) => setNewInterview({ ...newInterview, candidateName: e.target.value })}
                      className="block w-full rounded-lg border border-cyan-400 bg-[#23264a] px-4 py-2 text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-cyan-100 mb-2">Position</label>
                    <input
                      type="text"
                      value={newInterview.position}
                      onChange={(e) => setNewInterview({ ...newInterview, position: e.target.value })}
                      className="block w-full rounded-lg border border-cyan-400 bg-[#23264a] px-4 py-2 text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-cyan-100 mb-2">Interviewer</label>
                    <input
                      type="text"
                      value={newInterview.interviewer}
                      onChange={(e) => setNewInterview({ ...newInterview, interviewer: e.target.value })}
                      className="block w-full rounded-lg border border-cyan-400 bg-[#23264a] px-4 py-2 text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-cyan-100 mb-2">Interview Type</label>
                    <select
                      value={newInterview.type}
                      onChange={(e) => setNewInterview({ ...newInterview, type: e.target.value as 'Technical' | 'HR' | 'Final' })}
                      className="block w-full rounded-lg border border-cyan-400 bg-[#23264a] px-4 py-2 text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    >
                      <option value="Technical">Technical</option>
                      <option value="HR">HR</option>
                      <option value="Final">Final</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-cyan-100 mb-2">Date</label>
                    <input
                      type="date"
                      value={newInterview.date}
                      onChange={(e) => setNewInterview({ ...newInterview, date: e.target.value })}
                      className="block w-full rounded-lg border border-cyan-400 bg-[#23264a] px-4 py-2 text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-cyan-100 mb-2">Time</label>
                    <input
                      type="time"
                      value={newInterview.time}
                      onChange={(e) => setNewInterview({ ...newInterview, time: e.target.value })}
                      className="block w-full rounded-lg border border-cyan-400 bg-[#23264a] px-4 py-2 text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    />
                  </div>
                </div>
                <div className="mt-8 flex justify-end gap-4">
                  <button
                    onClick={() => setShowNewInterviewForm(false)}
                    className="px-5 py-2 rounded-lg bg-gray-700 text-white font-semibold hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateInterview}
                    className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-[0_0_10px_#00f7ff80] hover:opacity-90 transition"
                  >
                    Schedule Interview
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-2xl bg-[#0e101c] shadow-[0_0_30px_#00f7ff30] border border-[#2e314d] overflow-hidden">
            <table className="min-w-full divide-y divide-[#23264a]">
              <thead className="bg-[#181b2e] text-cyan-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Candidate</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Position</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Interviewer</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-[#101325] divide-y divide-[#23264a] text-cyan-100">
                {interviews.map((interview) => (
                  <tr key={interview.id} className="hover:bg-[#181b2e] transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-cyan-100">{interview.candidateName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-cyan-200">{interview.position}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-cyan-200">{interview.interviewer}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-cyan-100">{interview.date}</div>
                      <div className="text-sm text-cyan-200">{interview.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getTypeColor(interview.type)}`}>{interview.type}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(interview.status)}`}>{interview.status}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-cyan-200">
                      {interview.status === 'Scheduled' && (
                        <>
                          <button 
                            onClick={() => {
                              setSelectedInterview(interview);
                              setShowViewModal(true);
                            }}
                            className="text-cyan-400 hover:text-cyan-200 font-medium mr-3 underline"
                          >
                            View
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedInterview(interview);
                              setRescheduleData({ date: interview.date, time: interview.time });
                              setShowRescheduleModal(true);
                            }}
                            className="text-cyan-400 hover:text-cyan-200 font-medium mr-3 underline"
                          >
                            Reschedule
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedInterview(interview);
                              setShowCancelModal(true);
                            }}
                            className="text-rose-400 hover:text-rose-300 font-medium underline"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {interview.status === 'Cancelled' && (
                        <>
                          <button 
                            onClick={() => {
                              setSelectedInterview(interview);
                              setShowViewModal(true);
                            }}
                            className="text-cyan-400 hover:text-cyan-200 font-medium mr-3 underline"
                          >
                            View
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedInterview(interview);
                              setRescheduleData({ date: interview.date, time: interview.time });
                              setShowRescheduleModal(true);
                            }}
                            className="text-cyan-400 hover:text-cyan-200 font-medium underline"
                          >
                            Reschedule Interview
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* View Interview Modal */}
          {showViewModal && selectedInterview && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
              <div className="bg-[#181b2e] rounded-2xl p-8 w-full max-w-md shadow-[0_0_40px_#00f7ff80] border border-cyan-400">
                <h3 className="text-2xl font-bold text-cyan-200 mb-6">Interview Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-cyan-100">Candidate</label>
                    <p className="text-sm text-cyan-100">{selectedInterview.candidateName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-cyan-100">Position</label>
                    <p className="text-sm text-cyan-100">{selectedInterview.position}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-cyan-100">Interviewer</label>
                    <p className="text-sm text-cyan-100">{selectedInterview.interviewer}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-cyan-100">Date & Time</label>
                    <p className="text-sm text-cyan-100">{selectedInterview.date} at {selectedInterview.time}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-cyan-100">Type</label>
                    <p className="text-sm text-cyan-100">{selectedInterview.type}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-cyan-100">Notes</label>
                    <p className="text-sm text-cyan-100">{selectedInterview.notes || 'No notes available'}</p>
                  </div>
                </div>
                <div className="mt-8 flex justify-end gap-4">
                  <button
                    onClick={() => {
                      setShowViewModal(false);
                      setSelectedInterview(null);
                    }}
                    className="px-5 py-2 rounded-lg bg-gray-700 text-white font-semibold hover:bg-gray-600 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Reschedule Interview Modal */}
          {showRescheduleModal && selectedInterview && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
              <div className="bg-[#181b2e] rounded-2xl p-8 w-full max-w-md shadow-[0_0_40px_#00f7ff80] border border-cyan-400">
                <h3 className="text-2xl font-bold text-cyan-200 mb-6">
                  {selectedInterview.status === 'Cancelled' ? 'Reschedule Cancelled Interview' : 'Reschedule Interview'}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-cyan-100 mb-2">New Date</label>
                    <input
                      type="date"
                      value={rescheduleData.date}
                      onChange={(e) => setRescheduleData({ ...rescheduleData, date: e.target.value })}
                      className="block w-full rounded-lg border border-cyan-400 bg-[#23264a] px-4 py-2 text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-cyan-100 mb-2">New Time</label>
                    <input
                      type="time"
                      value={rescheduleData.time}
                      onChange={(e) => setRescheduleData({ ...rescheduleData, time: e.target.value })}
                      className="block w-full rounded-lg border border-cyan-400 bg-[#23264a] px-4 py-2 text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    />
                  </div>
                </div>
                <div className="mt-8 flex justify-end gap-4">
                  <button
                    onClick={() => {
                      setShowRescheduleModal(false);
                      setSelectedInterview(null);
                      setRescheduleData({ date: '', time: '' });
                    }}
                    className="px-5 py-2 rounded-lg bg-gray-700 text-white font-semibold hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReschedule}
                    className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-[0_0_10px_#00f7ff80] hover:opacity-90 transition"
                  >
                    {selectedInterview.status === 'Cancelled' ? 'Reschedule Interview' : 'Reschedule'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Cancel Interview Modal */}
          {showCancelModal && selectedInterview && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
              <div className="bg-[#181b2e] rounded-2xl p-8 w-full max-w-md shadow-[0_0_40px_#00f7ff80] border border-rose-400">
                <h3 className="text-2xl font-bold text-rose-200 mb-6">Cancel Interview</h3>
                <p className="text-cyan-100 mb-6">
                  Are you sure you want to cancel the interview with <span className="font-semibold text-rose-300">{selectedInterview.candidateName}</span>?
                </p>
                <div className="flex justify-end gap-4 mt-8">
                  <button
                    onClick={() => {
                      setShowCancelModal(false);
                      setSelectedInterview(null);
                    }}
                    className="px-5 py-2 rounded-lg bg-gray-700 text-white font-semibold hover:bg-gray-600 transition"
                  >
                    No, Keep Scheduled
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-5 py-2 rounded-lg bg-gradient-to-r from-rose-500 to-rose-700 text-white font-semibold shadow-[0_0_10px_#ff005580] hover:opacity-90 transition"
                  >
                    Yes, Cancel Interview
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}