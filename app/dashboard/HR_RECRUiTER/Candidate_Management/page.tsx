'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Candidate {
  id: string;
  name: string;
  email: string;
  position: string;
  status: 'New' | 'Screening' | 'Interview' | 'Offered' | 'Hired' | 'Rejected';
  appliedDate: string;
  resumeFileName?: string;
}

export default function CandidateManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedCandidatesString = localStorage.getItem('candidates');
    const storedCandidates: Candidate[] = storedCandidatesString ? JSON.parse(storedCandidatesString) : [];
    setCandidates(storedCandidates);
    setLoading(false);
  }, []);

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this candidate?')) return;

    try {
      const updatedCandidates = candidates.filter(c => c.id !== id);
      
      localStorage.setItem('candidates', JSON.stringify(updatedCandidates));

      setCandidates(updatedCandidates);

    } catch (err) {
      setError('Failed to delete candidate from local storage.');
      console.error(err);
    }
  };

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || candidate.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return null;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050d25] to-[#0d1021] px-6 py-10 text-white flex items-center justify-center">
      <div className="max-w-7xl w-full mx-auto bg-gradient-to-br from-cyan-400/40 via-blue-700/30 to-transparent rounded-3xl shadow-[0_0_40px_#00f7ff30] border border-[#2e314d] p-8 md:p-12">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-cyan-200 drop-shadow-[0_0_10px_#00f7ff]">Candidate Management</h1>
          <Link
            href="/dashboard/HR_RECRUiTER/Candidate_Management/new"
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-[0_0_15px_#00f7ff80] hover:opacity-90 transition text-base"
          >
            Add New Candidate
          </Link>
        </div>
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="search" className="mb-2 block text-sm font-medium text-cyan-100">Search Candidates</label>
            <input
              type="text"
              id="search"
              placeholder="Search candidates..."
              className="mt-1 px-4 py-2 border border-cyan-400 rounded-xl w-full bg-[#23264a] text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="statusFilter" className="mb-2 block text-sm font-medium text-cyan-100">Filter by Status</label>
            <select
              id="statusFilter"
              className="mt-1 px-4 py-2 border border-cyan-400 rounded-xl w-full bg-[#23264a] text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="New">New</option>
              <option value="Screening">Screening</option>
              <option value="Interview">Interview</option>
              <option value="Offered">Offered</option>
              <option value="Hired">Hired</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
        <div className="bg-[#0e101c] rounded-2xl shadow-[0_0_30px_#00f7ff30] border border-[#2e314d] overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-[#181b2e] text-cyan-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Position</th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Applied Date</th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-[#101325] divide-y divide-[#23264a] text-cyan-100">
              {filteredCandidates.map((candidate) => (
                <tr key={candidate.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-cyan-100">{candidate.name}</div>
                    <div className="text-sm text-cyan-300">{candidate.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-cyan-300">
                    {candidate.position}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${candidate.status === 'Hired' ? 'bg-emerald-900/30 text-emerald-300' :
                        candidate.status === 'Rejected' ? 'bg-rose-900/30 text-rose-300' :
                        candidate.status === 'Offered' ? 'bg-blue-900/30 text-cyan-300' :
                        candidate.status === 'Interview' ? 'bg-yellow-900/30 text-yellow-200' :
                        'bg-gray-900/30 text-cyan-100'}`}>
                      {candidate.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-cyan-300">
                    {new Date(candidate.appliedDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      href={`/dashboard/HR_RECRUiTER/Candidate_Management/${candidate.id}`}
                      className="text-cyan-400 hover:text-cyan-200 font-medium mr-4 underline"
                    >
                      View
                    </Link>
                    <Link
                      href={`/dashboard/HR_RECRUiTER/Candidate_Management/edit/${candidate.id}`}
                      className="text-blue-400 hover:text-blue-200 font-medium mr-4 underline"
                    >
                      Edit
                    </Link>
                    <button
                      className="text-rose-400 hover:text-rose-300 font-medium underline"
                      onClick={() => handleDelete(candidate.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredCandidates.length === 0 && !loading && !error && (
            <div className="text-center py-8 text-cyan-300">
              No candidates found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
