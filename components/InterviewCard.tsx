import React from 'react';
import { CalendarIcon } from 'lucide-react';

interface InterviewCardProps {
  candidateName: string;
  role: string;
  interviewDate: string;
  interviewTime: string;
  interviewType: string;
  status: string;
}

export const InterviewCard = ({ 
  candidateName, 
  role, 
  interviewDate, 
  interviewTime, 
  interviewType, 
  status 
}: InterviewCardProps) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{candidateName}</h3>
        <p className="text-sm text-gray-600 mt-1">{role}</p>
      </div>
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
        status === 'Completed' 
          ? 'bg-green-50 text-green-700'
          : status === 'Scheduled'
          ? 'bg-blue-50 text-blue-700'
          : 'bg-yellow-50 text-yellow-700'
      }`}>
        {status}
      </span>
    </div>
    <div className="mt-4 space-y-2">
      <div className="flex items-center text-sm text-gray-500">
        <CalendarIcon className="h-4 w-4 mr-1" />
        {interviewDate}
      </div>
      <div className="flex items-center text-sm text-gray-500">
        <span className="mr-2">Time:</span>
        {interviewTime}
      </div>
      <div className="flex items-center text-sm text-gray-500">
        <span className="mr-2">Type:</span>
        {interviewType}
      </div>
    </div>
  </div>
); 