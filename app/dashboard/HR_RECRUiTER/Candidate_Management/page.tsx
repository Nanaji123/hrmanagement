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
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-600">Candidate Management</h1>
        <Link
          href="/dashboard/HR_RECRUiTER/Candidate_Management/new"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add New Candidate
        </Link>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-black">Search Candidates</label>
          <input
            type="text"
            id="search"
            placeholder="Search candidates..."
            className="mt-1 px-4 py-2 border rounded w-full text-black"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="statusFilter" className="block text-sm font-medium text-black">Filter by Status</label>
          <select
            id="statusFilter"
            className="mt-1 px-4 py-2 border rounded w-full text-blue-300"
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

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCandidates.map((candidate) => (
              <tr key={candidate.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
                  <div className="text-sm text-gray-500">{candidate.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {candidate.position}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${candidate.status === 'Hired' ? 'bg-green-100 text-green-800' :
                      candidate.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                      candidate.status === 'Offered' ? 'bg-blue-100 text-blue-800' :
                      candidate.status === 'Interview' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'}`}>
                    {candidate.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(candidate.appliedDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link
                    href={`/dashboard/HR_RECRUiTER/Candidate_Management/${candidate.id}`}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    View
                  </Link>
                   <Link
                    href={`/dashboard/HR_RECRUiTER/Candidate_Management/edit/${candidate.id}`}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Edit
                  </Link>
                  <button
                    className="text-red-600 hover:text-red-900"
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
          <div className="text-center py-8 text-gray-500">
            No candidates found.
          </div>
        )}
      </div>
    </div>
  );
}
