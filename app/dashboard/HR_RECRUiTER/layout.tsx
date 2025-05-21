import Link from 'next/link';
import React from 'react';

export default function HRRecruiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-gray-800 text-white p-6 space-y-6">
        <div className="text-2xl font-bold">HR Recruiter</div>
        <nav className="space-y-2">
          <Link href="/dashboard/HR_RECRUiTER"
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white"
          >
            Dashboard
          </Link>
          <Link href="/dashboard/HR_RECRUiTER/Candidate_Management"
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white"
          >
            Candidate Management
          </Link>
          <Link href="/dashboard/HR_RECRUiTER/interview_sch"
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white"
          >
            Interview Scheduling
          </Link>
          {/* Add more navigation links here */}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
         {children}
      </main>
    </div>
  );
} 