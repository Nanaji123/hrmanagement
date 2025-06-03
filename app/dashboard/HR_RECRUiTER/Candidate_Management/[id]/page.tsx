'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  position: string;
  experience?: string;
  currentCompany?: string;
  expectedSalary?: string;
  noticePeriod?: string;
  status: 'New' | 'Screening' | 'Interview' | 'Offered' | 'Hired' | 'Rejected';
  appliedDate: string;
  resumeFileName?: string;
}

export default function CandidateDetails({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Read from local storage
    const storedCandidatesString = localStorage.getItem('candidates');
    const storedCandidates: Candidate[] = storedCandidatesString ? JSON.parse(storedCandidatesString) : [];

    // Find the candidate with the matching ID
    const foundCandidate = storedCandidates.find(c => c.id === params.id);

    setCandidate(foundCandidate || null);
    setLoading(false);
  }, [params.id]);

  const handleStatusChange = (newStatus: Candidate['status']) => {
    // TODO: Implement update status in local storage
    console.log(`Update status for ${candidate?.name} to ${newStatus}`);
    // You would typically update the local storage here and then update the state
    // For now, we just update the state temporarily
    if (candidate) {
      // Retrieve existing data from local storage
      const existingCandidatesString = localStorage.getItem('candidates');
      const existingCandidates: Candidate[] = existingCandidatesString ? JSON.parse(existingCandidatesString) : [];

      // Find and update the candidate
      const updatedCandidates = existingCandidates.map(c => 
        c.id === candidate.id ? { ...c, status: newStatus } : c
      );

      // Save updated array back to local storage
      localStorage.setItem('candidates', JSON.stringify(updatedCandidates));

      // Update state
      setCandidate({ ...candidate, status: newStatus });
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">Candidate not found</h2>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050d25] to-[#0d1021] px-6 py-10 text-white flex items-center justify-center">
      <div className="max-w-4xl w-full mx-auto bg-gradient-to-br from-cyan-400/40 via-blue-700/30 to-transparent rounded-3xl shadow-[0_0_40px_#00f7ff30] border border-[#2e314d] p-8 md:p-12">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-cyan-200 drop-shadow-[0_0_10px_#00f7ff]">Candidate Details</h1>
          <button
            onClick={() => router.back()}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-[0_0_15px_#00f7ff80] hover:opacity-90 transition text-base"
          >
            Back to List
          </button>
        </div>
        <div className="bg-[#0e101c] rounded-2xl shadow-[0_0_30px_#00f7ff30] border border-[#2e314d] overflow-hidden">
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-cyan-100">
            <div>
              <h2 className="text-lg font-semibold mb-4 text-cyan-200">Personal Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-cyan-300">Full Name</label>
                  <p className="mt-1">{candidate.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-cyan-300">Email</label>
                  <p className="mt-1">{candidate.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-cyan-300">Phone</label>
                  <p className="mt-1">{candidate.phone || 'N/A'}</p>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-4 text-cyan-200">Professional Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-cyan-300">Position</label>
                  <p className="mt-1">{candidate.position}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-cyan-300">Experience</label>
                  <p className="mt-1">{candidate.experience ? `${candidate.experience} years` : 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-cyan-300">Current Company</label>
                  <p className="mt-1">{candidate.currentCompany || 'N/A'}</p>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-4 text-cyan-200">Application Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-cyan-300">Expected Salary</label>
                  <p className="mt-1">{candidate.expectedSalary ? `$${candidate.expectedSalary}` : 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-cyan-300">Notice Period</label>
                  <p className="mt-1">{candidate.noticePeriod ? `${candidate.noticePeriod} days` : 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-cyan-300">Applied Date</label>
                  <p className="mt-1">{new Date(candidate.appliedDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-4 text-cyan-200">Status & Actions</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-cyan-300">Current Status</label>
                  <select
                    value={candidate.status}
                    onChange={(e) => handleStatusChange(e.target.value as Candidate['status'])}
                    className="mt-1 block w-full rounded-xl border-cyan-400 bg-[#23264a] text-cyan-100 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="New">New</option>
                    <option value="Screening">Screening</option>
                    <option value="Interview">Interview</option>
                    <option value="Offered">Offered</option>
                    <option value="Hired">Hired</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-cyan-300">Resume</label>
                  {candidate.resumeFileName ? (
                    <p className="mt-1 text-cyan-100">{candidate.resumeFileName} (File upload not supported with local storage)</p>
                  ) : (
                    <p className="mt-1 text-cyan-300">No resume uploaded</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}