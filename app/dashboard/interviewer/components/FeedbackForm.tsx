"use client";
import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface FeedbackFormProps {
  interviewId: string;
  candidateName: string;
  onSubmit: () => void;
  onCancel: () => void;
}

interface FeedbackData {
  technicalSkills: number;
  communication: number;
  problemSolving: number;
  culturalFit: number;
  overallRating: number;
  strengths: string;
  weaknesses: string;
  comments: string;
  recommendation: 'Strong Hire' | 'Hire' | 'No Hire' | 'Strong No Hire';
}

type RatingCategory = 'technicalSkills' | 'communication' | 'problemSolving' | 'culturalFit' | 'overallRating';

export default function FeedbackForm({ interviewId, candidateName, onSubmit, onCancel }: FeedbackFormProps) {
  const [feedback, setFeedback] = useState<FeedbackData>({
    technicalSkills: 0,
    communication: 0,
    problemSolving: 0,
    culturalFit: 0,
    overallRating: 0,
    strengths: '',
    weaknesses: '',
    comments: '',
    recommendation: 'Hire'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRatingChange = (category: RatingCategory, value: number) => {
    setFeedback(prev => ({ ...prev, [category]: value }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFeedback(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/interviewer/interviews/${interviewId}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedback),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      onSubmit();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const RatingInput = ({ category, label }: { category: RatingCategory; label: string }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => handleRatingChange(category, rating)}
            className="focus:outline-none"
          >
            <Star
              className={`w-6 h-6 ${
                feedback[category] >= rating
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Feedback for {candidateName}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RatingInput category="technicalSkills" label="Technical Skills" />
          <RatingInput category="communication" label="Communication" />
          <RatingInput category="problemSolving" label="Problem Solving" />
          <RatingInput category="culturalFit" label="Cultural Fit" />
          <RatingInput category="overallRating" label="Overall Rating" />
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="strengths" className="block text-sm font-medium text-gray-700">
              Strengths
            </label>
            <textarea
              id="strengths"
              name="strengths"
              rows={3}
              value={feedback.strengths}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="weaknesses" className="block text-sm font-medium text-gray-700">
              Areas for Improvement
            </label>
            <textarea
              id="weaknesses"
              name="weaknesses"
              rows={3}
              value={feedback.weaknesses}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="comments" className="block text-sm font-medium text-gray-700">
              Additional Comments
            </label>
            <textarea
              id="comments"
              name="comments"
              rows={4}
              value={feedback.comments}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="recommendation" className="block text-sm font-medium text-gray-700">
              Recommendation
            </label>
            <select
              id="recommendation"
              name="recommendation"
              value={feedback.recommendation}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="Strong Hire">Strong Hire</option>
              <option value="Hire">Hire</option>
              <option value="No Hire">No Hire</option>
              <option value="Strong No Hire">Strong No Hire</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </div>
      </div>
    </form>
  );
} 