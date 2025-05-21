"use client";
import React, { useState, useEffect } from 'react';
import { InterviewFeedbackData } from '../types';

interface FeedbackFormProps {
  initialFeedback: InterviewFeedbackData;
  onSubmit: () => void;
  onFeedbackChange: (feedback: InterviewFeedbackData) => void;
  isSubmitting?: boolean;
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({
  initialFeedback,
  onSubmit,
  onFeedbackChange,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState<InterviewFeedbackData>(initialFeedback);

  useEffect(() => {
    setFormData(initialFeedback);
  }, [initialFeedback]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    let newValue: string | number = value;

    if (id === 'technicalRating' || id === 'communicationRating' || id === 'problemSolvingRating') {
      newValue = parseInt(value, 10) || 0;
    }

    const updatedFormData = { ...formData, [id]: newValue };
    setFormData(updatedFormData);
    onFeedbackChange(updatedFormData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold text-gray-900">Submit Feedback</h3>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="technicalRating" className="block text-sm font-medium text-gray-700">
            Technical Skills
          </label>
          <div className="mt-2 flex space-x-2">
            {[1, 2, 3, 4, 5].map(rating => (
              <button
                key={rating}
                type="button"
                onClick={() => handleInputChange({ target: { id: 'technicalRating', value: rating.toString() } } as React.ChangeEvent<HTMLInputElement>)}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  formData.technicalRating === rating
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                aria-label={`Rate technical skills ${rating} out of 5`}
              >
                {rating}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="communicationRating" className="block text-sm font-medium text-gray-700">
            Communication
          </label>
          <div className="mt-2 flex space-x-2">
            {[1, 2, 3, 4, 5].map(rating => (
              <button
                key={rating}
                type="button"
                onClick={() => handleInputChange({ target: { id: 'communicationRating', value: rating.toString() } } as React.ChangeEvent<HTMLInputElement>)}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  formData.communicationRating === rating
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                aria-label={`Rate communication ${rating} out of 5`}
              >
                {rating}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="problemSolvingRating" className="block text-sm font-medium text-gray-700">
            Problem Solving
          </label>
          <div className="mt-2 flex space-x-2">
            {[1, 2, 3, 4, 5].map(rating => (
              <button
                key={rating}
                type="button"
                onClick={() => handleInputChange({ target: { id: 'problemSolvingRating', value: rating.toString() } } as React.ChangeEvent<HTMLInputElement>)}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  formData.problemSolvingRating === rating
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                aria-label={`Rate problem solving ${rating} out of 5`}
              >
                {rating}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="recommendation" className="block text-sm font-medium text-gray-700">
            Recommendation
          </label>
          <select
            id="recommendation"
            value={formData.recommendation}
            onChange={handleInputChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="Strongly Recommend">Strongly Recommend</option>
            <option value="Recommend">Recommend</option>
            <option value="Consider">Consider</option>
            <option value="Not Recommended">Not Recommended</option>
          </select>
        </div>

        <div>
          <label htmlFor="comments" className="block text-sm font-medium text-gray-700">
            Detailed Feedback
          </label>
          <textarea
            id="comments"
            value={formData.comments}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter your detailed feedback here..."
            rows={4}
            required
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting || !formData.comments.trim()}
          className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
            isSubmitting || !formData.comments.trim()
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          }`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </div>
    </form>
  );
}; 