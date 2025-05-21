'use client';

import { useState } from 'react';

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

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState<Interview[]>([
    {
      id: '1',
      candidateName: 'John Smith',
      position: 'Senior Software Engineer',
      interviewer: 'Sarah Wilson',
      date: '2024-03-20',
      time: '10:00 AM',
      type: 'Technical',
      status: 'Scheduled'
    },
    {
      id: '2',
      candidateName: 'Sarah Johnson',
      position: 'Product Manager',
      interviewer: 'Michael Brown',
      date: '2024-03-20',
      time: '2:00 PM',
      type: 'HR',
      status: 'Scheduled'
    },
    {
      id: '3',
      candidateName: 'Michael Brown',
      position: 'UX Designer',
      interviewer: 'Emily Davis',
      date: '2024-03-21',
      time: '11:00 AM',
      type: 'Final',
      status: 'Scheduled'
    }
  ]);

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

  const getStatusColor = (status: Interview['status']) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: Interview['type']) => {
    switch (type) {
      case 'Technical': return 'bg-purple-100 text-purple-800';
      case 'HR': return 'bg-yellow-100 text-yellow-800';
      case 'Final': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Interviews</h1>
        <button
          onClick={() => setShowNewInterviewForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Schedule Interview
        </button>
      </div>

      {showNewInterviewForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">Schedule New Interview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Candidate Name</label>
              <input
                type="text"
                value={newInterview.candidateName}
                onChange={(e) => setNewInterview({ ...newInterview, candidateName: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Position</label>
              <input
                type="text"
                value={newInterview.position}
                onChange={(e) => setNewInterview({ ...newInterview, position: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Interviewer</label>
              <input
                type="text"
                value={newInterview.interviewer}
                onChange={(e) => setNewInterview({ ...newInterview, interviewer: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Interview Type</label>
              <select
                value={newInterview.type}
                onChange={(e) => setNewInterview({ ...newInterview, type: e.target.value as 'Technical' | 'HR' | 'Final' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="Technical">Technical</option>
                <option value="HR">HR</option>
                <option value="Final">Final</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                value={newInterview.date}
                onChange={(e) => setNewInterview({ ...newInterview, date: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Time</label>
              <input
                type="time"
                value={newInterview.time}
                onChange={(e) => setNewInterview({ ...newInterview, time: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-3">
            <button
              onClick={() => setShowNewInterviewForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateInterview}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Schedule Interview
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interviewer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {interviews.map((interview) => (
              <tr key={interview.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{interview.candidateName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{interview.position}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{interview.interviewer}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{interview.date}</div>
                  <div className="text-sm text-gray-500">{interview.time}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(interview.type)}`}>
                    {interview.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(interview.status)}`}>
                    {interview.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                  <button className="text-blue-600 hover:text-blue-900 mr-3">Reschedule</button>
                  <button className="text-red-600 hover:text-red-900">Cancel</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 