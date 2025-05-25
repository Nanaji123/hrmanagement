'use client';

import { useState, useEffect } from 'react';

interface Candidate {
  id: string;
  name: string;
  email: string;
  position: string;
  status: 'Applied' | 'Screening' | 'Interview' | 'Offered' | 'Hired' | 'Rejected';
  appliedDate: string;
  lastUpdated: string;
}

// Initial data for first-time users
const initialCandidates: Candidate[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    position: 'Senior Software Engineer',
    status: 'Interview',
    appliedDate: '2024-03-10',
    lastUpdated: '2024-03-15'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    position: 'Product Manager',
    status: 'Screening',
    appliedDate: '2024-03-12',
    lastUpdated: '2024-03-14'
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael.b@example.com',
    position: 'UX Designer',
    status: 'Offered',
    appliedDate: '2024-03-08',
    lastUpdated: '2024-03-15'
  }
];

export default function CandidatesPage() {
  // Load candidates from localStorage or use initial data
  const [candidates, setCandidates] = useState<Candidate[]>(() => {
    if (typeof window !== 'undefined') {
      const savedCandidates = localStorage.getItem('candidates');
      return savedCandidates ? JSON.parse(savedCandidates) : initialCandidates;
    }
    return initialCandidates;
  });

  // Save candidates to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('candidates', JSON.stringify(candidates));
    }
  }, [candidates]);

  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showRejected, setShowRejected] = useState(false);

  // Filter candidates based on search query
  const filteredCandidates = candidates.filter(candidate =>
    candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    candidate.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
    candidate.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: Candidate['status']) => {
    switch (status) {
      case 'Applied': return 'bg-blue-50 text-blue-700';
      case 'Screening': return 'bg-amber-50 text-amber-700';
      case 'Interview': return 'bg-purple-50 text-purple-700';
      case 'Offered': return 'bg-emerald-50 text-emerald-700';
      case 'Hired': return 'bg-teal-50 text-teal-700';
      case 'Rejected': return 'bg-rose-50 text-rose-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  const handleStatusUpdate = (newStatus: Candidate['status']) => {
    if (selectedCandidate) {
      setCandidates(candidates.map(candidate => 
        candidate.id === selectedCandidate.id 
          ? { ...candidate, status: newStatus, lastUpdated: new Date().toISOString().split('T')[0] }
          : candidate
      ));
      setShowStatusModal(false);
      setSelectedCandidate(null);
    }
  };

  const handleReject = () => {
    if (selectedCandidate) {
      setCandidates(candidates.map(candidate => 
        candidate.id === selectedCandidate.id 
          ? { ...candidate, status: 'Rejected', lastUpdated: new Date().toISOString().split('T')[0] }
          : candidate
      ));
      setShowRejectModal(false);
      setSelectedCandidate(null);
      setShowRejected(true); // Automatically show rejected candidates after rejection
    }
  };

  const handleAcceptBack = (candidate: Candidate) => {
    setCandidates(candidates.map(c => 
      c.id === candidate.id 
        ? { ...c, status: 'Applied', lastUpdated: new Date().toISOString().split('T')[0] }
        : c
    ));
    setShowRejected(false); // Switch back to active candidates view
  };

  const rejectedCount = candidates.filter(c => c.status === 'Rejected').length;

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Candidates</h1>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search candidates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-black"
          />
          <button
            onClick={() => setShowRejected(!showRejected)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium"
          >
            {showRejected ? 'Active Candidates' : 'Rejected Candidates'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Position</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Last Updated</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCandidates
              .filter(candidate => showRejected ? candidate.status === 'Rejected' : candidate.status !== 'Rejected')
              .map((candidate) => (
                <tr key={candidate.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center">
                          <span className="text-emerald-700 text-sm font-medium">
                            {candidate.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-gray-900">{candidate.name}</div>
                        <div className="text-sm text-gray-600">{candidate.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{candidate.position}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(candidate.status)}`}>
                      {candidate.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{candidate.appliedDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{candidate.lastUpdated}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {!showRejected && (
                      <>
                        <button 
                          onClick={() => {
                            setSelectedCandidate(candidate);
                            setShowStatusModal(true);
                          }}
                          className="text-emerald-600 hover:text-emerald-900 font-medium mr-3"
                        >
                          Update Status
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedCandidate(candidate);
                            setShowRejectModal(true);
                          }}
                          className="text-rose-600 hover:text-rose-900 font-medium"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {showRejected && (
                      <button 
                        onClick={() => handleAcceptBack(candidate)}
                        className="text-emerald-600 hover:text-emerald-900 font-medium"
                      >
                        Accept Back
                      </button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Status Update Modal */}
      {showStatusModal && selectedCandidate && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Status</h3>
            <p className="text-sm text-gray-600 mb-4">
              Update status for {selectedCandidate.name}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {(['Applied', 'Screening', 'Interview', 'Offered', 'Hired'] as Candidate['status'][]).map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusUpdate(status)}
                  className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                >
                  {status}
                </button>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setSelectedCandidate(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Confirmation Modal */}
      {showRejectModal && selectedCandidate && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reject Candidate</h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to reject {selectedCandidate.name}?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedCandidate(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors duration-200"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 