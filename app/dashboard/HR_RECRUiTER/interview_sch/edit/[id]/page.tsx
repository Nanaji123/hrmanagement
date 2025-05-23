'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface FormErrors {
  [key: string]: string;
}

interface InterviewData {
  id: string;
  candidateId: string;
  candidateName?: string; // Optional, will try to get from local storage if available
  interviewer: string;
  date: string;
  time: string;
  location: string;
  status: 'Scheduled' | 'Completed' | 'Canceled';
}

interface CandidateForSelect {
    id: string;
    name: string;
}

export default function EditInterview({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [formData, setFormData] = useState<InterviewData | null>(null);
  const [candidates, setCandidates] = useState<CandidateForSelect[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingCandidates, setLoadingCandidates] = useState(true);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [interviewNotFound, setInterviewNotFound] = useState(false);

  useEffect(() => {
    // Read interview from local storage
    const storedInterviewsString = localStorage.getItem('interviews');
    const storedInterviews: InterviewData[] = storedInterviewsString ? JSON.parse(storedInterviewsString) : [];

    const foundInterview = storedInterviews.find(int => int.id === params.id);

    if (foundInterview) {
      setFormData(foundInterview);
    } else {
      setInterviewNotFound(true);
    }
    setLoading(false);

    // Load candidates for dropdown
    const storedCandidatesString = localStorage.getItem('candidates');
    const storedCandidates: any[] = storedCandidatesString ? JSON.parse(storedCandidatesString) : [];
    setCandidates(storedCandidates.map(c => ({ id: c.id, name: c.name })));
    setLoadingCandidates(false);

  }, [params.id]);

  const validateForm = (): boolean => {
     if (!formData) return false;

    const newErrors: FormErrors = {};

    if (!formData.candidateId.trim()) {
      newErrors.candidateId = 'Candidate is required';
    }

    if (!formData.interviewer.trim()) {
      newErrors.interviewer = 'Interviewer name is required';
    }

    if (!formData.date.trim()) {
      newErrors.date = 'Date is required';
    }

    if (!formData.time.trim()) {
      newErrors.time = 'Time is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.status.trim()) {
      newErrors.status = 'Status is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
     setFormData(prev => prev ? ({
      ...prev,
      [name]: value,
      // If candidate changes, try to find and set candidateName
      ...(name === 'candidateId' && { candidateName: candidates.find(c => c.id === value)?.name || '' })
    }) : null);
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);

    if (!validateForm() || !formData) {
      return;
    }

    setIsSaving(true);

    try {
      // Retrieve existing data from local storage
      const existingInterviewsString = localStorage.getItem('interviews');
      let existingInterviews: InterviewData[] = existingInterviewsString ? JSON.parse(existingInterviewsString) : [];

      // Find the index of the interview to update
      const interviewIndex = existingInterviews.findIndex(int => int.id === params.id);

      if (interviewIndex > -1) {
        // Update the interview data, ensure candidateName is correct
        existingInterviews[interviewIndex] = {
            ...formData,
            candidateName: candidates.find(c => c.id === formData.candidateId)?.name || '',
        };

        // Save updated array back to local storage
        localStorage.setItem('interviews', JSON.stringify(existingInterviews));

        router.push('/dashboard/HR_RECRUiTER/interview_sch');
      } else {
        setSaveError('Interview not found in local storage.');
      }

    } catch (error) {
      setSaveError('Failed to save interview to local storage.');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || loadingCandidates) {
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

  if (interviewNotFound) {
     return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">Interview not found</h2>
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

   if (!formData) {
       // Should not happen if loading is false and interviewNotFound is false
       return null;
   }

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Edit Interview</h1>
        
        {saveError && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {saveError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <label htmlFor="candidateId" className="block text-sm font-medium text-gray-700">Candidate</label>
              <select
                id="candidateId"
                name="candidateId"
                required
                className={`mt-1 block w-full rounded-md border border-gray-400 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 ${
                  errors.candidateId ? 'border-red-300' : ''
                }`}
                value={formData.candidateId}
                onChange={handleInputChange}
              >
                 <option value="">Select Candidate</option>
                 {candidates.map(candidate => (
                    <option key={candidate.id} value={candidate.id}>{candidate.name}</option>
                 ))}
              </select>
              {errors.candidateId && (
                 <p className="mt-1 text-sm text-red-600">{errors.candidateId}</p>
              )}
            </div>

            <div>
              <label htmlFor="interviewer" className="block text-sm font-medium text-gray-700">Interviewer(s)</label>
              <input
                type="text"
                id="interviewer"
                name="interviewer"
                required
                className={`mt-1 block w-full rounded-md border border-gray-400 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 ${
                  errors.interviewer ? 'border-red-300' : ''
                }`}
                value={formData.interviewer}
                onChange={handleInputChange}
              />
              {errors.interviewer && (
                <p className="mt-1 text-sm text-red-600">{errors.interviewer}</p>
              )}
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                required
                className={`mt-1 block w-full rounded-md border border-gray-400 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 ${
                  errors.date ? 'border-red-300' : ''
                }`}
                value={formData.date}
                onChange={handleInputChange}
              />
               {errors.date && (
                <p className="mt-1 text-sm text-red-600">{errors.date}</p>
              )}
            </div>

            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700">Time</label>
              <input
                type="time"
                id="time"
                name="time"
                required
                className={`mt-1 block w-full rounded-md border border-gray-400 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 ${
                  errors.time ? 'border-red-300' : ''
                }`}
                value={formData.time}
                onChange={handleInputChange}
              />
               {errors.time && (
                <p className="mt-1 text-sm text-red-600">{errors.time}</p>
              )}
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                required
                className={`mt-1 block w-full rounded-md border border-gray-400 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 ${
                  errors.location ? 'border-red-300' : ''
                }`}
                value={formData.location}
                onChange={handleInputChange}
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location}</p>
              )}
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
              <select
                id="status"
                name="status"
                required
                className={`mt-1 block w-full rounded-md border border-gray-400 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 ${
                  errors.status ? 'border-red-300' : ''
                }`}
                value={formData.status}
                onChange={handleInputChange}
              >
                 <option value="Scheduled">Scheduled</option>
                 <option value="Completed">Completed</option>
                 <option value="Canceled">Canceled</option>
              </select>
              {errors.status && (
                 <p className="mt-1 text-sm text-red-600">{errors.status}</p>
              )}
            </div>

          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 