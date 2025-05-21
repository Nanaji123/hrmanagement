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
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Candidate Details</h1>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Back to List
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Full Name</label>
                    <p className="mt-1">{candidate.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Email</label>
                    <p className="mt-1">{candidate.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Phone</label>
                    <p className="mt-1">{candidate.phone || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-4">Professional Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Position</label>
                    <p className="mt-1">{candidate.position}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Experience</label>
                    <p className="mt-1">{candidate.experience ? `${candidate.experience} years` : 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Current Company</label>
                    <p className="mt-1">{candidate.currentCompany || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-4">Application Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Expected Salary</label>
                    <p className="mt-1">{candidate.expectedSalary ? `$${candidate.expectedSalary}` : 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Notice Period</label>
                    <p className="mt-1">{candidate.noticePeriod ? `${candidate.noticePeriod} days` : 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Applied Date</label>
                    <p className="mt-1">{new Date(candidate.appliedDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-4">Status & Actions</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Current Status</label>
                    <select
                      value={candidate.status}
                      onChange={(e) => handleStatusChange(e.target.value as Candidate['status'])}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                    <label className="block text-sm font-medium text-gray-500">Resume</label>
                    {candidate.resumeFileName ? (
                      <p className="mt-1 text-gray-900">{candidate.resumeFileName} (File upload not supported with local storage)</p>
                    ) : (
                      <p className="mt-1 text-gray-500">No resume uploaded</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 