'use client';

import { useState } from 'react';

interface Feedback {
  id: string;
  candidateName: string;
  position: string;
  interviewer: string;
  interviewDate: string;
  interviewType: 'Technical' | 'HR' | 'Final';
  ratings: {
    technicalSkills: number;
    problemSolving: number;
    communication: number;
    cultureFit: number;
    overall: number;
  };
  strengths: string[];
  weaknesses: string[];
  notes: string;
  recommendation: 'Strong Hire' | 'Hire' | 'Hold' | 'No Hire';
  status: 'Pending' | 'Submitted' | 'Reviewed';
}

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([
    {
      id: '1',
      candidateName: 'John Smith',
      position: 'Senior Software Engineer',
      interviewer: 'Sarah Wilson',
      interviewDate: '2024-03-20',
      interviewType: 'Technical',
      ratings: {
        technicalSkills: 4.5,
        problemSolving: 4.0,
        communication: 4.2,
        cultureFit: 4.3,
        overall: 4.3
      },
      strengths: [
        'Strong problem-solving abilities',
        'Excellent technical knowledge',
        'Good communication skills'
      ],
      weaknesses: [
        'Could improve on system design',
        'Limited experience with cloud platforms'
      ],
      notes: 'Candidate demonstrated strong technical skills and problem-solving abilities. Good communication throughout the interview.',
      recommendation: 'Strong Hire',
      status: 'Submitted'
    },
    {
      id: '2',
      candidateName: 'Sarah Johnson',
      position: 'Product Manager',
      interviewer: 'Michael Brown',
      interviewDate: '2024-03-19',
      interviewType: 'HR',
      ratings: {
        technicalSkills: 3.8,
        problemSolving: 4.2,
        communication: 4.5,
        cultureFit: 4.7,
        overall: 4.3
      },
      strengths: [
        'Excellent communication skills',
        'Strong leadership qualities',
        'Great cultural fit'
      ],
      weaknesses: [
        'Limited technical background',
        'Could improve on technical discussions'
      ],
      notes: 'Candidate showed great potential for the role. Strong in communication and leadership aspects.',
      recommendation: 'Hire',
      status: 'Reviewed'
    }
  ]);

  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [showNewFeedbackForm, setShowNewFeedbackForm] = useState(false);
  const [newFeedback, setNewFeedback] = useState<Partial<Feedback>>({
    candidateName: '',
    position: '',
    interviewer: '',
    interviewDate: '',
    interviewType: 'Technical',
    ratings: {
      technicalSkills: 0,
      problemSolving: 0,
      communication: 0,
      cultureFit: 0,
      overall: 0
    },
    strengths: [],
    weaknesses: [],
    notes: '',
    recommendation: 'Hold',
    status: 'Pending'
  });

  const getRecommendationColor = (recommendation: Feedback['recommendation']) => {
    switch (recommendation) {
      case 'Strong Hire': return 'bg-green-100 text-green-800';
      case 'Hire': return 'bg-emerald-100 text-emerald-800';
      case 'Hold': return 'bg-yellow-100 text-yellow-800';
      case 'No Hire': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: Feedback['status']) => {
    switch (status) {
      case 'Submitted': return 'bg-blue-100 text-blue-800';
      case 'Reviewed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const RatingStars = ({ rating }: { rating: number }) => (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-xl ${
            star <= rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
        >
          ★
        </span>
      ))}
      <span className="ml-2 text-sm text-gray-600">({rating.toFixed(1)})</span>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Interview Feedback</h1>
        <button
          onClick={() => setShowNewFeedbackForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add New Feedback
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feedback List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Recent Feedback</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {feedbacks.map((feedback) => (
              <div
                key={feedback.id}
                className="p-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedFeedback(feedback)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{feedback.candidateName}</h3>
                    <p className="text-sm text-gray-500">{feedback.position}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${getRecommendationColor(feedback.recommendation)}`}>
                    {feedback.recommendation}
                  </span>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    Interviewer: {feedback.interviewer} • {feedback.interviewDate}
                  </p>
                  <div className="mt-2">
                    <RatingStars rating={feedback.ratings.overall} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feedback Details */}
        <div className="bg-white rounded-lg shadow">
          {selectedFeedback ? (
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedFeedback.candidateName}</h2>
                  <p className="text-sm text-gray-500">{selectedFeedback.position}</p>
                </div>
                <span className={`px-3 py-1 text-sm rounded-full ${getRecommendationColor(selectedFeedback.recommendation)}`}>
                  {selectedFeedback.recommendation}
                </span>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Ratings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-600">Technical Skills</label>
                      <RatingStars rating={selectedFeedback.ratings.technicalSkills} />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Problem Solving</label>
                      <RatingStars rating={selectedFeedback.ratings.problemSolving} />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Communication</label>
                      <RatingStars rating={selectedFeedback.ratings.communication} />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Culture Fit</label>
                      <RatingStars rating={selectedFeedback.ratings.cultureFit} />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Strengths</h3>
                  <ul className="list-disc list-inside space-y-2">
                    {selectedFeedback.strengths.map((strength, index) => (
                      <li key={index} className="text-gray-600">{strength}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Areas for Improvement</h3>
                  <ul className="list-disc list-inside space-y-2">
                    {selectedFeedback.weaknesses.map((weakness, index) => (
                      <li key={index} className="text-gray-600">{weakness}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Notes</h3>
                  <p className="text-gray-600">{selectedFeedback.notes}</p>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    Interviewer: {selectedFeedback.interviewer}
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(selectedFeedback.status)}`}>
                    {selectedFeedback.status}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              Select a feedback to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 