'use client';

import { useState } from 'react';

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract';
  status: 'Open' | 'Closed' | 'Draft';
  applicants: number;
  postedDate: string;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: '1',
      title: 'Senior Software Engineer',
      department: 'Engineering',
      location: 'New York, NY',
      type: 'Full-time',
      status: 'Open',
      applicants: 45,
      postedDate: '2024-03-15'
    },
    {
      id: '2',
      title: 'Product Manager',
      department: 'Product',
      location: 'Remote',
      type: 'Full-time',
      status: 'Open',
      applicants: 32,
      postedDate: '2024-03-14'
    },
    {
      id: '3',
      title: 'UX Designer',
      department: 'Design',
      location: 'San Francisco, CA',
      type: 'Full-time',
      status: 'Closed',
      applicants: 28,
      postedDate: '2024-03-10'
    }
  ]);

  const [showNewJobForm, setShowNewJobForm] = useState(false);
  const [newJob, setNewJob] = useState<Partial<Job>>({
    title: '',
    department: '',
    location: '',
    type: 'Full-time',
    status: 'Draft'
  });

  const handleCreateJob = () => {
    if (newJob.title && newJob.department && newJob.location) {
      const job: Job = {
        id: Date.now().toString(),
        title: newJob.title,
        department: newJob.department,
        location: newJob.location,
        type: newJob.type as 'Full-time' | 'Part-time' | 'Contract',
        status: newJob.status as 'Open' | 'Closed' | 'Draft',
        applicants: 0,
        postedDate: new Date().toISOString().split('T')[0]
      };
      setJobs([job, ...jobs]);
      setShowNewJobForm(false);
      setNewJob({
        title: '',
        department: '',
        location: '',
        type: 'Full-time',
        status: 'Draft'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Job Postings</h1>
        <button
          onClick={() => setShowNewJobForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Create New Job
        </button>
      </div>

      {showNewJobForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">Create New Job</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Job Title</label>
              <input
                type="text"
                value={newJob.title}
                onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Department</label>
              <input
                type="text"
                value={newJob.department}
                onChange={(e) => setNewJob({ ...newJob, department: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                value={newJob.location}
                onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Job Type</label>
              <select
                value={newJob.type}
                onChange={(e) => setNewJob({ ...newJob, type: e.target.value as 'Full-time' | 'Part-time' | 'Contract' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-3">
            <button
              onClick={() => setShowNewJobForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateJob}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Job
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicants</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posted Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {jobs.map((job) => (
              <tr key={job.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{job.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{job.department}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{job.location}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{job.type}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    job.status === 'Open' ? 'bg-green-100 text-green-800' :
                    job.status === 'Closed' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {job.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{job.applicants}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{job.postedDate}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                  <button className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 