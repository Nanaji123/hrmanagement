'use client';

import { useState, useEffect, useRef } from 'react';

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract';
  status: 'Open' | 'Closed';
  postedDate: string;
  applicants: number;
}

// Initial data for first-time users
const initialJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    department: 'Engineering',
    location: 'New York, NY',
    type: 'Full-time',
    status: 'Open',
    postedDate: '2024-03-01',
    applicants: 12
  },
  {
    id: '2',
    title: 'Product Manager',
    department: 'Product',
    location: 'Remote',
    type: 'Full-time',
    status: 'Open',
    postedDate: '2024-03-05',
    applicants: 8
  },
  {
    id: '3',
    title: 'UX Designer',
    department: 'Design',
    location: 'San Francisco, CA',
    type: 'Contract',
    status: 'Open',
    postedDate: '2024-03-10',
    applicants: 15
  }
];

export default function JobsPage() {
  // Load jobs from localStorage or use initial data
  const [jobs, setJobs] = useState<Job[]>(() => {
    if (typeof window !== 'undefined') {
      const savedJobs = localStorage.getItem('jobs');
      return savedJobs ? JSON.parse(savedJobs) : initialJobs;
    }
    return initialJobs;
  });

  // Save jobs to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('jobs', JSON.stringify(jobs));
    }
  }, [jobs]);

  const [showNewJobForm, setShowNewJobForm] = useState(false);
  const [newJob, setNewJob] = useState<Partial<Job>>({
    title: '',
    department: '',
    location: '',
    type: 'Full-time',
    status: 'Open'
  });

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [lastDeletedJob, setLastDeletedJob] = useState<Job | null>(null);
  const undoTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [showUndo, setShowUndo] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');

  // Filter jobs based on search query
  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateJob = () => {
    if (newJob.title && newJob.department && newJob.location) {
      const job: Job = {
        id: Date.now().toString(),
        title: newJob.title,
        department: newJob.department,
        location: newJob.location,
        type: newJob.type as 'Full-time' | 'Part-time' | 'Contract',
        status: 'Open',
        postedDate: new Date().toISOString().split('T')[0],
        applicants: 0
      };
      setJobs([job, ...jobs]);
      setShowNewJobForm(false);
      setNewJob({
        title: '',
        department: '',
        location: '',
        type: 'Full-time',
        status: 'Open'
      });
    }
  };

  const handleDeleteJob = () => {
    if (selectedJob) {
      setJobs(jobs.filter(job => job.id !== selectedJob.id));
      setLastDeletedJob(selectedJob);
      setShowDeleteModal(false);
      setSelectedJob(null);
      setShowUndo(true);
      if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
      undoTimeoutRef.current = setTimeout(() => {
        setLastDeletedJob(null);
        setShowUndo(false);
      }, 5000);
    }
  };

  const handleUndoDelete = () => {
    if (lastDeletedJob) {
      setJobs([lastDeletedJob, ...jobs]);
      setLastDeletedJob(null);
      setShowUndo(false);
      if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
    }
  };

  const getStatusColor = (status: Job['status']) => {
    switch (status) {
      case 'Open': return 'bg-emerald-50 text-emerald-700';
      case 'Closed': return 'bg-rose-50 text-rose-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  const getTypeColor = (type: Job['type']) => {
    switch (type) {
      case 'Full-time': return 'bg-blue-50 text-blue-700';
      case 'Part-time': return 'bg-purple-50 text-purple-700';
      case 'Contract': return 'bg-amber-50 text-amber-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050d25] to-[#0d1021] px-4 py-10 flex items-center justify-center">
      <div className="w-full p-8 md:p-12">
        <div className="rounded-3xl bg-[#0e101c] p-8 md:p-12 flex flex-col gap-8 shadow-[0_0_40px_#00f7ff30] border border-[#2e314d]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <h1 className="text-3xl font-bold text-cyan-200 drop-shadow-[0_0_10px_#00f7ff]">Job Postings</h1>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="px-4 py-2 rounded-xl border border-cyan-400 bg-[#181b2e] text-cyan-100 placeholder-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 shadow-[0_0_10px_#00f7ff30]"
              />
              <button
                onClick={() => setShowNewJobForm(true)}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-[0_0_15px_#00f7ff80] hover:opacity-90 transition text-base"
              >
                Create New Job
              </button>
            </div>
          </div>
          <div>
            <table className="min-w-full rounded-xl overflow-hidden shadow-[0_0_20px_#00f7ff20]">
              <thead className="bg-[#181b2e] text-cyan-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Job Title</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Applicants</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Posted Date</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-[#101325] divide-y divide-[#23264a] text-cyan-100">
                {filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-[#181b2e] transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-cyan-100">{job.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-cyan-200">{job.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-cyan-200">{job.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-cyan-200">{job.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(job.status)}`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-cyan-200">{job.applicants}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-cyan-200">{job.postedDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-rose-400">
                      <button 
                        onClick={() => {
                          setSelectedJob(job);
                          setShowDeleteModal(true);
                        }}
                        className="hover:underline hover:text-rose-300 font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* New Job Modal */}
      {showNewJobForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-[#181b2e] rounded-2xl p-8 w-full max-w-md shadow-[0_0_40px_#00f7ff80] border border-cyan-400">
            <h2 className="text-2xl font-bold text-cyan-200 mb-6">Create New Job</h2>
            <div className="space-y-4">
              <input
                className="w-full px-4 py-2 rounded-lg bg-[#23264a] text-cyan-100 border border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Job Title"
                value={newJob.title}
                onChange={e => setNewJob({ ...newJob, title: e.target.value })}
              />
              <input
                className="w-full px-4 py-2 rounded-lg bg-[#23264a] text-cyan-100 border border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Department"
                value={newJob.department}
                onChange={e => setNewJob({ ...newJob, department: e.target.value })}
              />
              <input
                className="w-full px-4 py-2 rounded-lg bg-[#23264a] text-cyan-100 border border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Location"
                value={newJob.location}
                onChange={e => setNewJob({ ...newJob, location: e.target.value })}
              />
              <select
                className="w-full px-4 py-2 rounded-lg bg-[#23264a] text-cyan-100 border border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                value={newJob.type}
                onChange={e => setNewJob({ ...newJob, type: e.target.value as Job['type'] })}
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={() => setShowNewJobForm(false)}
                className="px-5 py-2 rounded-lg bg-gray-700 text-white font-semibold hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateJob}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-[0_0_10px_#00f7ff80] hover:opacity-90 transition"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-[#181b2e] rounded-2xl p-8 w-full max-w-md shadow-[0_0_40px_#00f7ff80] border border-rose-400">
            <h2 className="text-2xl font-bold text-rose-200 mb-6">Delete Job</h2>
            <p className="text-cyan-100 mb-6">Are you sure you want to delete the job <span className="font-semibold text-rose-300">{selectedJob.title}</span>?</p>
            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-5 py-2 rounded-lg bg-gray-700 text-white font-semibold hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteJob}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-rose-500 to-rose-700 text-white font-semibold shadow-[0_0_10px_#ff005580] hover:opacity-90 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}