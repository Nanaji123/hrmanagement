"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Clock } from 'lucide-react';

interface PendingFeedback {
  interviewId: string;
  candidateName: string;
  deadline: string;
  status: 'Pending' | 'Submitted';
}

export default function SidebarPendingFeedback() {
  const [pendingFeedbacks, setPendingFeedbacks] = useState<PendingFeedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/interviewer/feedbacks/pending')
      .then((res) => res.json())
      .then((data) => {
        setPendingFeedbacks(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching pending feedbacks:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    );
  }

  if (pendingFeedbacks.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500">No pending feedbacks</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Pending Feedback</h2>
      <div className="space-y-3 max-h-[300px] overflow-y-auto">
        {pendingFeedbacks.map(({ interviewId, candidateName, deadline }) => {
          const isOverdue = new Date(deadline) < new Date();
          return (
            <Link
              key={interviewId}
              href={`/dashboard/interviewer/feedback/${interviewId}`}
              className="block p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition-colors duration-200"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{candidateName}</h3>
                  <div className="flex items-center mt-1 text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    <span className={isOverdue ? 'text-red-500' : ''}>
                      Due: {new Date(deadline).toLocaleDateString()}
                      {isOverdue && ' (Overdue)'}
                    </span>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  isOverdue ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {isOverdue ? 'Overdue' : 'Pending'}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
} 