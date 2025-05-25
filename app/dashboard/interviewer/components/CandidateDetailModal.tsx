"use client";

import React, { useState } from 'react';
import styles from '../InterviewerPage.module.css';
import { Candidate, InterviewFeedbackData } from '../types/index';
import FeedbackForm from './FeedbackForm';
import FeedbackPreview from './FeedbackPreview';
// Import InterviewTimer if needed within the modal context
// import { InterviewTimer } from './InterviewTimer';
import { X } from 'lucide-react';

interface CandidateDetailModalProps {
  candidate: {
    id: string;
    name: string;
    email: string;
    phone: string;
    position: string;
    experience: string;
    skills: string[];
    status: string;
    interviewDate: string;
    interviewType: string;
    interviewer: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onSubmitFeedback: (feedback: InterviewFeedbackData) => void;
}

export default function CandidateDetailModal({
  candidate,
  isOpen,
  onClose,
  onSubmitFeedback,
}: CandidateDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [feedbackData, setFeedbackData] = useState<InterviewFeedbackData>({
    technicalSkills: 0,
    communication: 0,
    problemSolving: 0,
    cultureFit: 0,
    strengths: '',
    weaknesses: '',
    notes: '',
    recommendation: 'Hold'
  });

  if (!isOpen) return null;

  const handleSubmitFeedback = (feedback: InterviewFeedbackData) => {
    setFeedbackData(feedback);
    setIsEditing(false);
    onSubmitFeedback(feedback);
  };

  const handleFeedbackChange = (feedback: InterviewFeedbackData) => {
    setFeedbackData(feedback);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Candidate Details
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{candidate.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">{candidate.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="mt-1 text-sm text-gray-900">{candidate.phone}</dd>
                </div>
              </dl>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Interview Details</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Position</dt>
                  <dd className="mt-1 text-sm text-gray-900">{candidate.position}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Experience</dt>
                  <dd className="mt-1 text-sm text-gray-900">{candidate.experience}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Interview Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">{candidate.interviewDate}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Interview Type</dt>
                  <dd className="mt-1 text-sm text-gray-900">{candidate.interviewType}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Interviewer</dt>
                  <dd className="mt-1 text-sm text-gray-900">{candidate.interviewer}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {candidate.skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8">
            {isEditing ? (
              <FeedbackForm
                interviewId={candidate.id}
                candidateName={candidate.name}
                onSubmit={() => handleSubmitFeedback(feedbackData)}
                onCancel={() => setIsEditing(false)}
              />
            ) : (
              <FeedbackPreview
                feedback={feedbackData}
                onConfirm={() => handleSubmitFeedback(feedbackData)}
                onCancel={() => setIsEditing(true)}
                isSubmitting={false}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 