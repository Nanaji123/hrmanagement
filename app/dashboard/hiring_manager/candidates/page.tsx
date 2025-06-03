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
    <div className="min-h-screen bg-gradient-to-b from-[#050d25] to-[#0d1021] px-6 py-10 text-white flex items-center justify-center">
      <div className="w-full p-8 md:p-12">
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-cyan-200 drop-shadow-[0_0_10px_#00f7ff]">Candidates</h1>
            <div className="flex space-x-4">
              <input
                type="text"
                placeholder="Search candidates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 rounded-xl border border-cyan-400 bg-[#181b2e] text-cyan-100 placeholder-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 shadow-[0_0_10px_#00f7ff30]"
              />
              <button
                onClick={() => setShowRejected(!showRejected)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-[0_0_10px_#00f7ff80] hover:opacity-90 transition-colors duration-200 font-medium"
              >
                {showRejected ? 'Active Candidates' : 'Rejected Candidates'}
              </button>
            </div>
          </div>

          <div className="rounded-2xl bg-[#0e101c] shadow-[0_0_30px_#00f7ff30] border border-[#2e314d] overflow-hidden">
            <table className="min-w-full divide-y divide-[#23264a]">
              <thead className="bg-[#181b2e] text-cyan-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Position</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Applied</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Last Updated</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-[#101325] divide-y divide-[#23264a] text-cyan-100">
                {filteredCandidates
                  .filter(candidate => showRejected ? candidate.status === 'Rejected' : candidate.status !== 'Rejected')
                  .map((candidate) => (
                    <tr key={candidate.id} className="hover:bg-[#181b2e] transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                              <span className="text-white text-sm font-bold">
                                {candidate.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-cyan-100">{candidate.name}</div>
                            <div className="text-xs text-cyan-300">{candidate.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-cyan-200">{candidate.position}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(candidate.status)}`}>
                          {candidate.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-xs text-cyan-300">{candidate.appliedDate}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-xs text-cyan-300">{candidate.lastUpdated}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-xs text-cyan-300">{candidate.lastUpdated}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-cyan-200">
                        {!showRejected && (
                          <>
                            <button 
                              onClick={() => {
                                setSelectedCandidate(candidate);
                                setShowStatusModal(true);
                              }}
                              className="text-cyan-400 hover:text-cyan-200 font-medium mr-3 underline"
                            >
                              Update Status
                            </button>
                            <button 
                              onClick={() => {
                                setSelectedCandidate(candidate);
                                setShowRejectModal(true);
                              }}
                              className="text-rose-400 hover:text-rose-300 font-medium underline"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {showRejected && (
                          <button 
                            onClick={() => handleAcceptBack(candidate)}
                            className="text-cyan-400 hover:text-cyan-200 font-medium underline"
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
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
              <div className="bg-[#181b2e] rounded-2xl p-8 w-full max-w-md shadow-[0_0_40px_#00f7ff80] border border-cyan-400">
                <h3 className="text-2xl font-bold text-cyan-200 mb-6">Update Candidate</h3>
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const newStatus = formData.get('status') as Candidate['status'];
                    handleStatusUpdate(newStatus);
                  }}
                >
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-cyan-100 mb-1">Name</label>
                    <input
                      type="text"
                      value={selectedCandidate.name}
                      disabled
                      className="w-full px-3 py-2 border rounded-lg bg-[#23264a] text-cyan-100 border-cyan-400"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-cyan-100 mb-1">Email</label>
                    <input
                      type="email"
                      value={selectedCandidate.email}
                      disabled
                      className="w-full px-3 py-2 border rounded-lg bg-[#23264a] text-cyan-100 border-cyan-400"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-cyan-100 mb-1">Status</label>
                    <select
                      name="status"
                      defaultValue={selectedCandidate.status}
                      className="w-full px-3 py-2 border rounded-lg bg-[#23264a] text-cyan-100 border-cyan-400"
                    >
                      {(['Applied', 'Screening', 'Interview', 'Offered', 'Hired'] as Candidate['status'][]).map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mt-8 flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowStatusModal(false);
                        setSelectedCandidate(null);
                      }}
                      className="px-5 py-2 rounded-lg bg-gray-700 text-white font-semibold hover:bg-gray-600 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-[0_0_10px_#00f7ff80] hover:opacity-90 transition"
                    >
                      Update
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Reject Confirmation Modal */}
          {showRejectModal && selectedCandidate && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
              <div className="bg-[#181b2e] rounded-2xl p-8 w-full max-w-md shadow-[0_0_40px_#00f7ff80] border border-rose-400">
                <h3 className="text-2xl font-bold text-rose-200 mb-6">Reject Candidate</h3>
                <p className="text-cyan-100 mb-6">
                  Are you sure you want to reject <span className="font-semibold text-rose-300">{selectedCandidate.name}</span>?
                </p>
                <div className="flex justify-end gap-4 mt-8">
                  <button
                    onClick={() => {
                      setShowRejectModal(false);
                      setSelectedCandidate(null);
                    }}
                    className="px-5 py-2 rounded-lg bg-gray-700 text-white font-semibold hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReject}
                    className="px-5 py-2 rounded-lg bg-gradient-to-r from-rose-500 to-rose-700 text-white font-semibold shadow-[0_0_10px_#ff005580] hover:opacity-90 transition"
                  >
                    Reject
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