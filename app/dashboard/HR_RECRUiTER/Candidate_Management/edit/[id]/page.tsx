'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface FormErrors {
  [key: string]: string;
}

interface CandidateData {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  currentCompany: string;
  expectedSalary: string;
  noticePeriod: string;
  department: string;
  status: 'New' | 'Screening' | 'Interview' | 'Offered' | 'Hired' | 'Rejected';
  resumeFileName: string;
  appliedDate: string;
}

export default function EditCandidate({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [formData, setFormData] = useState<CandidateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [candidateNotFound, setCandidateNotFound] = useState(false);

  useEffect(() => {
    // Read from local storage
    const storedCandidatesString = localStorage.getItem('candidates');
    const storedCandidates: CandidateData[] = storedCandidatesString ? JSON.parse(storedCandidatesString) : [];

    // Find the candidate with the matching ID
    const foundCandidate = storedCandidates.find(c => c.id === params.id);

    if (foundCandidate) {
      setFormData(foundCandidate);
    } else {
      setCandidateNotFound(true);
    }
    setLoading(false);
  }, [params.id]);

  const validateForm = (): boolean => {
     if (!formData) return false; // Should not happen if candidateNotFound is false

    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.position.trim()) {
      newErrors.position = 'Position is required';
    }

    if (!formData.experience.trim()) {
      newErrors.experience = 'Experience is required';
    } else if (isNaN(Number(formData.experience)) || Number(formData.experience) < 0) {
      newErrors.experience = 'Experience must be a positive number';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }

     if (!formData.status) {
       newErrors.status = 'Status is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
     setFormData(prev => prev ? ({ // Ensure prev is not null
      ...prev,
      [name]: value
    }) : null);
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

   // File input will not be editable in this basic local storage version

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);

    if (!validateForm() || !formData) {
      return;
    }

    setIsSaving(true);

    try {
      // Retrieve existing data from local storage
      const existingCandidatesString = localStorage.getItem('candidates');
      let existingCandidates: CandidateData[] = existingCandidatesString ? JSON.parse(existingCandidatesString) : [];

      // Find the index of the candidate to update
      const candidateIndex = existingCandidates.findIndex(c => c.id === params.id);

      if (candidateIndex > -1) {
        // Update the candidate data
        existingCandidates[candidateIndex] = formData;

        // Save updated array back to local storage
        localStorage.setItem('candidates', JSON.stringify(existingCandidates));

        router.push('/dashboard/HR_RECRUiTER/Candidate_Management');
      } else {
        setSaveError('Candidate not found in local storage.');
      }

    } catch (error) {
      setSaveError('Failed to save candidate to local storage.');
      console.error(error);
    } finally {
      setIsSaving(false);
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

  if (candidateNotFound) {
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

  if (!formData) {
      // Should not happen if loading is false and candidateNotFound is false
      return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050d25] to-[#0d1021] px-6 py-10 text-white flex items-center justify-center">
      <div className="max-w-2xl w-full mx-auto bg-gradient-to-br from-cyan-400/40 via-blue-700/30 to-transparent rounded-3xl shadow-[0_0_40px_#00f7ff30] border border-[#2e314d] p-8 md:p-12">
        <h1 className="text-3xl font-bold text-cyan-200 drop-shadow-[0_0_10px_#00f7ff] mb-6">Edit Candidate</h1>
        {saveError && (
          <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded">
            {saveError}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-cyan-100">Full Name</label>
              <input
                type="text"
                name="name"
                required
                className={`mt-1 block w-full rounded-xl border-cyan-400 bg-[#23264a] text-cyan-100 shadow-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 ${errors.name ? 'border-rose-300' : ''}`}
                value={formData.name}
                onChange={handleInputChange}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-rose-400">{errors.name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-cyan-100">Email</label>
              <input
                type="email"
                name="email"
                required
                className={`mt-1 block w-full rounded-xl border-cyan-400 bg-[#23264a] text-cyan-100 shadow-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 ${errors.email ? 'border-rose-300' : ''}`}
                value={formData.email}
                onChange={handleInputChange}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-rose-400">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-cyan-100">Phone</label>
              <input
                type="tel"
                name="phone"
                required
                className={`mt-1 block w-full rounded-xl border-cyan-400 bg-[#23264a] text-cyan-100 shadow-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 ${errors.phone ? 'border-rose-300' : ''}`}
                value={formData.phone}
                onChange={handleInputChange}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-rose-400">{errors.phone}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-cyan-100">Position</label>
              <input
                type="text"
                name="position"
                required
                className={`mt-1 block w-full rounded-xl border-cyan-400 bg-[#23264a] text-cyan-100 shadow-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 ${errors.position ? 'border-rose-300' : ''}`}
                value={formData.position}
                onChange={handleInputChange}
              />
              {errors.position && (
                <p className="mt-1 text-sm text-rose-400">{errors.position}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-cyan-100">Years of Experience</label>
              <input
                type="number"
                name="experience"
                required
                className={`mt-1 block w-full rounded-xl border-cyan-400 bg-[#23264a] text-cyan-100 shadow-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 ${errors.experience ? 'border-rose-300' : ''}`}
                value={formData.experience}
                onChange={handleInputChange}
              />
              {errors.experience && (
                <p className="mt-1 text-sm text-rose-400">{errors.experience}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-cyan-100">Current Company</label>
              <input
                type="text"
                name="currentCompany"
                className="mt-1 block w-full rounded-xl border-cyan-400 bg-[#23264a] text-cyan-100 shadow-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                value={formData.currentCompany}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-cyan-100">Expected Salary</label>
              <input
                type="number"
                name="expectedSalary"
                className="mt-1 block w-full rounded-xl border-cyan-400 bg-[#23264a] text-cyan-100 shadow-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                value={formData.expectedSalary}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-cyan-100">Notice Period (in days)</label>
              <input
                type="number"
                name="noticePeriod"
                className="mt-1 block w-full rounded-xl border-cyan-400 bg-[#23264a] text-cyan-100 shadow-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                value={formData.noticePeriod}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-cyan-100">Department</label>
              <select
                id="department"
                name="department"
                required
                className={`mt-1 block w-full rounded-xl border-cyan-400 bg-[#23264a] text-cyan-100 shadow-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 ${errors.department ? 'border-rose-300' : ''}`}
                value={formData.department}
                onChange={handleInputChange}
              >
                <option value="">Select Department</option>
                <option value="engineering">Engineering</option>
                <option value="marketing">Marketing</option>
                <option value="sales">Sales</option>
                <option value="hr">Human Resources</option>
              </select>
              {errors.department && (
                <p className="mt-1 text-sm text-rose-400">{errors.department}</p>
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
                 <option value="">Select Status</option>
                 <option value="New">New</option>
                 <option value="Screening">Screening</option>
                 <option value="Interview">Interview</option>
                 <option value="Offered">Offered</option>
                 <option value="Hired">Hired</option>
                 <option value="Rejected">Rejected</option>
              </select>
              {errors.status && (
                 <p className="mt-1 text-sm text-rose-400">{errors.status}</p>
              )}
            </div>
          </div>
          {/* Resume field - Display only, not editable in this version */}
          <div>
            <label className="block text-sm font-medium text-cyan-100">Resume</label>
            {formData.resumeFileName ? (
              <p className="mt-1 text-cyan-100">{formData.resumeFileName} (Editing file not supported in this version)</p>
            ) : (
              <p className="mt-1 text-cyan-300">No resume uploaded</p>
            )}
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
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}