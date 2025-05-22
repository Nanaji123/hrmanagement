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
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Interviews</h1>
        <button
          onClick={() => setShowNewInterviewForm(true)}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 font-medium"
        >
          Schedule Interview
        </button>
      </div>

      {showNewInterviewForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Schedule New Interview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Candidate Name</label>
              <input
                type="text"
                value={newInterview.candidateName}
                onChange={(e) => setNewInterview({ ...newInterview, candidateName: e.target.value })}
                className="block w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
              <input
                type="text"
                value={newInterview.position}
                onChange={(e) => setNewInterview({ ...newInterview, position: e.target.value })}
                className="block w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Interviewer</label>
              <input
                type="text"
                value={newInterview.interviewer}
                onChange={(e) => setNewInterview({ ...newInterview, interviewer: e.target.value })}
                className="block w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Interview Type</label>
              <select
                value={newInterview.type}
                onChange={(e) => setNewInterview({ ...newInterview, type: e.target.value as 'Technical' | 'HR' | 'Final' })}
                className="block w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="Technical">Technical</option>
                <option value="HR">HR</option>
                <option value="Final">Final</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={newInterview.date}
                onChange={(e) => setNewInterview({ ...newInterview, date: e.target.value })}
                className="block w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
              <input
                type="time"
                value={newInterview.time}
                onChange={(e) => setNewInterview({ ...newInterview, time: e.target.value })}
                className="block w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => setShowNewInterviewForm(false)}
              className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateInterview}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 font-medium"
            >
              Schedule Interview
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Candidate</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Position</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Interviewer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Date & Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {interviews.map((interview) => (
              <tr key={interview.id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">{interview.candidateName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">{interview.position}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">{interview.interviewer}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{interview.date}</div>
                  <div className="text-sm text-gray-600">{interview.time}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getTypeColor(interview.type)}`}>
                    {interview.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(interview.status)}`}>
                    {interview.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {interview.status === 'Scheduled' && (
                    <>
                      <button 
                        onClick={() => {
                          setSelectedInterview(interview);
                          setShowViewModal(true);
                        }}
                        className="text-emerald-600 hover:text-emerald-900 font-medium mr-3"
                      >
                        View
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedInterview(interview);
                          setRescheduleData({ date: interview.date, time: interview.time });
                          setShowRescheduleModal(true);
                        }}
                        className="text-emerald-600 hover:text-emerald-900 font-medium mr-3"
                      >
                        Reschedule
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedInterview(interview);
                          setShowCancelModal(true);
                        }}
                        className="text-rose-600 hover:text-rose-900 font-medium"
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
                        className="text-emerald-600 hover:text-emerald-900 font-medium mr-3"
                      >
                        View
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedInterview(interview);
                          setRescheduleData({ date: interview.date, time: interview.time });
                          setShowRescheduleModal(true);
                        }}
                        className="text-emerald-600 hover:text-emerald-900 font-medium"
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
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Interview Details</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Candidate</label>
                <p className="text-sm text-gray-900">{selectedInterview.candidateName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Position</label>
                <p className="text-sm text-gray-900">{selectedInterview.position}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Interviewer</label>
                <p className="text-sm text-gray-900">{selectedInterview.interviewer}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Date & Time</label>
                <p className="text-sm text-gray-900">{selectedInterview.date} at {selectedInterview.time}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Type</label>
                <p className="text-sm text-gray-900">{selectedInterview.type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Notes</label>
                <p className="text-sm text-gray-900">{selectedInterview.notes || 'No notes available'}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedInterview(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Interview Modal */}
      {showRescheduleModal && selectedInterview && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {selectedInterview.status === 'Cancelled' ? 'Reschedule Cancelled Interview' : 'Reschedule Interview'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Date</label>
                <input
                  type="date"
                  value={rescheduleData.date}
                  onChange={(e) => setRescheduleData({ ...rescheduleData, date: e.target.value })}
                  className="block w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Time</label>
                <input
                  type="time"
                  value={rescheduleData.time}
                  onChange={(e) => setRescheduleData({ ...rescheduleData, time: e.target.value })}
                  className="block w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowRescheduleModal(false);
                  setSelectedInterview(null);
                  setRescheduleData({ date: '', time: '' });
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleReschedule}
                className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors duration-200"
              >
                {selectedInterview.status === 'Cancelled' ? 'Reschedule Interview' : 'Reschedule'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Interview Modal */}
      {showCancelModal && selectedInterview && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cancel Interview</h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to cancel the interview with {selectedInterview.candidateName}?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedInterview(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                No, Keep Scheduled
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors duration-200"
              >
                Yes, Cancel Interview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 