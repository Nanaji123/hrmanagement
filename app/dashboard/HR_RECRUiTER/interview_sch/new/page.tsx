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

export default function ScheduleNewInterview() {
  const router = useRouter();
  const [formData, setFormData] = useState<InterviewData>({
    id: '',
    candidateId: '',
    candidateName: '',
    interviewer: '',
    date: '',
    time: '',
    location: '',
    status: 'Scheduled',
  });
  const [candidates, setCandidates] = useState<CandidateForSelect[]>([]);
  const [loadingCandidates, setLoadingCandidates] = useState(true);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    // Load candidates from local storage to populate dropdown
    const storedCandidatesString = localStorage.getItem('candidates');
    const storedCandidates: any[] = storedCandidatesString ? JSON.parse(storedCandidatesString) : [];
    setCandidates(storedCandidates.map(c => ({ id: c.id, name: c.name })));
    setLoadingCandidates(false);
  }, []);

  const validateForm = (): boolean => {
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
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // If candidate changes, try to find and set candidateName
      ...(name === 'candidateId' && { candidateName: candidates.find(c => c.id === value)?.name || '' })
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      // Retrieve existing data from local storage
      const existingInterviewsString = localStorage.getItem('interviews');
      const existingInterviews: InterviewData[] = existingInterviewsString ? JSON.parse(existingInterviewsString) : [];

      const newInterview: InterviewData = {
        ...formData,
        id: Date.now().toString(), // Simple unique ID
         // Ensure candidateName is captured from selected candidate
        candidateName: candidates.find(c => c.id === formData.candidateId)?.name || '',
      };

      // Add new interview to the array
      existingInterviews.push(newInterview);

      // Save updated array back to local storage
      localStorage.setItem('interviews', JSON.stringify(existingInterviews));

      router.push('/dashboard/HR_RECRUiTER/interview_sch');
    } catch (error) {
      setSaveError('Failed to save interview to local storage.');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050d25] to-[#0d1021] px-6 py-10 text-white flex items-center justify-center">
      <div className="max-w-2xl w-full mx-auto bg-gradient-to-br from-cyan-400/40 via-blue-700/30 to-transparent rounded-3xl shadow-[0_0_40px_#00f7ff30] border border-[#2e314d] p-8 md:p-12">
        <h1 className="text-3xl font-bold text-cyan-200 drop-shadow-[0_0_10px_#00f7ff] mb-6">Schedule New Interview</h1>
        {saveError && (
          <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded">
            {saveError}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="candidateId" className="block text-sm font-medium text-cyan-100">Candidate</label>
              <select
                id="candidateId"
                name="candidateId"
                required
                className={`mt-1 block w-full rounded-xl border-cyan-400 bg-[#23264a] text-cyan-100 shadow-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 ${errors.candidateId ? 'border-rose-300' : ''}`}
                value={formData.candidateId}
                onChange={handleInputChange}
                disabled={loadingCandidates}
              >
                 <option value="">{loadingCandidates ? 'Loading Candidates...' : 'Select Candidate'}</option>
                 {candidates.map(candidate => (
                    <option key={candidate.id} value={candidate.id}>{candidate.name}</option>
                 ))}
              </select>
              {errors.candidateId && (
                 <p className="mt-1 text-sm text-rose-400">{errors.candidateId}</p>
              )}
               {candidates.length === 0 && !loadingCandidates && (
                <p className="mt-1 text-sm text-yellow-400">No candidates available. Add candidates first.</p>
              )}
            </div>
            <div>
              <label htmlFor="interviewer" className="block text-sm font-medium text-cyan-100">Interviewer(s)</label>
              <input
                type="text"
                id="interviewer"
                name="interviewer"
                required
                className={`mt-1 block w-full rounded-xl border-cyan-400 bg-[#23264a] text-cyan-100 shadow-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 ${errors.interviewer ? 'border-rose-300' : ''}`}
                value={formData.interviewer}
                onChange={handleInputChange}
              />
              {errors.interviewer && (
                <p className="mt-1 text-sm text-rose-400">{errors.interviewer}</p>
              )}
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-cyan-100">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                required
                className={`mt-1 block w-full rounded-xl border-cyan-400 bg-[#23264a] text-cyan-100 shadow-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 ${errors.date ? 'border-rose-300' : ''}`}
                value={formData.date}
                onChange={handleInputChange}
              />
               {errors.date && (
                <p className="mt-1 text-sm text-rose-400">{errors.date}</p>
              )}
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-cyan-100">Time</label>
              <input
                type="time"
                id="time"
                name="time"
                required
                className={`mt-1 block w-full rounded-xl border-cyan-400 bg-[#23264a] text-cyan-100 shadow-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 ${errors.time ? 'border-rose-300' : ''}`}
                value={formData.time}
                onChange={handleInputChange}
              />
               {errors.time && (
                <p className="mt-1 text-sm text-rose-400">{errors.time}</p>
              )}
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-cyan-100">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                required
                className={`mt-1 block w-full rounded-xl border-cyan-400 bg-[#23264a] text-cyan-100 shadow-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 ${errors.location ? 'border-rose-300' : ''}`}
                value={formData.location}
                onChange={handleInputChange}
              />
              {errors.location && (
                <p className="mt-1 text-sm text-rose-400">{errors.location}</p>
              )}
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-cyan-100">Status</label>
              <select
                id="status"
                name="status"
                required
                className={`mt-1 block w-full rounded-xl border-cyan-400 bg-[#23264a] text-cyan-100 shadow-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 ${errors.status ? 'border-rose-300' : ''}`}
                value={formData.status}
                onChange={handleInputChange}
              >
                 <option value="Scheduled">Scheduled</option>
                 <option value="Completed">Completed</option>
                 <option value="Canceled">Canceled</option>
              </select>
              {errors.status && (
                 <p className="mt-1 text-sm text-rose-400">{errors.status}</p>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-5 py-2 rounded-lg bg-gray-700 text-white font-semibold hover:bg-gray-600 transition"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-[0_0_10px_#00f7ff80] hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSaving}
            >
              {isSaving ? 'Scheduling...' : 'Schedule Interview'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}