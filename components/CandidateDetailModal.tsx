import React, { useState } from 'react';
import { validateFeedback, type FeedbackFormData } from '@/lib/validations';

interface Candidate {
  id: string;
  name: string;
  position: string;
  status: string;
  feedbackSubmitted: boolean;
  history?: Array<{
    date: string;
    type: string;
    status: string;
  }>;
}

interface CandidateDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: Candidate;
  onSubmitFeedback: (feedback: FeedbackFormData) => Promise<void>;
}

export function CandidateDetailModal({
  isOpen,
  onClose,
  candidate,
  onSubmitFeedback,
}: CandidateDetailModalProps) {
  const [feedback, setFeedback] = useState<FeedbackFormData>({
    technicalSkills: 0,
    problemSolving: 0,
    communication: 0,
    cultureFit: 0,
    strengths: '',
    weaknesses: '',
    notes: '',
    recommendation: 'Hold',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    field: keyof FeedbackFormData,
    value: string | number
  ) => {
    setFeedback((prev: FeedbackFormData) => ({
      ...prev,
      [field]: value
    }));
    // Clear error when field is modified
    if (errors[field as string]) {
      setErrors((prev: Record<string, string>) => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const validation = validateFeedback(feedback);
    if (!validation.success && validation.errors) {
      const newErrors: Record<string, string> = {};
      validation.errors.forEach((error: { field: string; message: string }) => {
        newErrors[error.field] = error.message;
      });
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    if (!validation.success || !validation.data) {
      setErrors({
        submit: 'Invalid feedback data'
      });
      setIsSubmitting(false);
      return;
    }

    try {
      await onSubmitFeedback(validation.data);
      onClose();
    } catch (error: unknown) {
      setErrors({
        submit: error instanceof Error ? error.message : 'Failed to submit feedback'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">{candidate.name}</h2>
              <p className="text-gray-600">{candidate.position}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
              aria-label="Close modal"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Technical Skills
                </label>
                <select
                  value={feedback.technicalSkills}
                  onChange={(e) => handleChange('technicalSkills', Number(e.target.value))}
                  className={`w-full rounded-md border ${
                    errors.technicalSkills ? 'border-red-500' : 'border-gray-300'
                  } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                >
                  <option value={0}>Select rating</option>
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <option key={rating} value={rating}>
                      {rating}
                    </option>
                  ))}
                </select>
                {errors.technicalSkills && (
                  <p className="mt-1 text-sm text-red-600">{errors.technicalSkills}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Problem Solving
                </label>
                <select
                  value={feedback.problemSolving}
                  onChange={(e) => handleChange('problemSolving', Number(e.target.value))}
                  className={`w-full rounded-md border ${
                    errors.problemSolving ? 'border-red-500' : 'border-gray-300'
                  } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                >
                  <option value={0}>Select rating</option>
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <option key={rating} value={rating}>
                      {rating}
                    </option>
                  ))}
                </select>
                {errors.problemSolving && (
                  <p className="mt-1 text-sm text-red-600">{errors.problemSolving}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Communication
                </label>
                <select
                  value={feedback.communication}
                  onChange={(e) => handleChange('communication', Number(e.target.value))}
                  className={`w-full rounded-md border ${
                    errors.communication ? 'border-red-500' : 'border-gray-300'
                  } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                >
                  <option value={0}>Select rating</option>
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <option key={rating} value={rating}>
                      {rating}
                    </option>
                  ))}
                </select>
                {errors.communication && (
                  <p className="mt-1 text-sm text-red-600">{errors.communication}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Culture Fit
                </label>
                <select
                  value={feedback.cultureFit}
                  onChange={(e) => handleChange('cultureFit', Number(e.target.value))}
                  className={`w-full rounded-md border ${
                    errors.cultureFit ? 'border-red-500' : 'border-gray-300'
                  } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                >
                  <option value={0}>Select rating</option>
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <option key={rating} value={rating}>
                      {rating}
                    </option>
                  ))}
                </select>
                {errors.cultureFit && (
                  <p className="mt-1 text-sm text-red-600">{errors.cultureFit}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Strengths
              </label>
              <textarea
                value={feedback.strengths}
                onChange={(e) => handleChange('strengths', e.target.value)}
                className={`w-full rounded-md border ${
                  errors.strengths ? 'border-red-500' : 'border-gray-300'
                } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                rows={3}
              />
              {errors.strengths && (
                <p className="mt-1 text-sm text-red-600">{errors.strengths}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weaknesses
              </label>
              <textarea
                value={feedback.weaknesses}
                onChange={(e) => handleChange('weaknesses', e.target.value)}
                className={`w-full rounded-md border ${
                  errors.weaknesses ? 'border-red-500' : 'border-gray-300'
                } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                rows={3}
              />
              {errors.weaknesses && (
                <p className="mt-1 text-sm text-red-600">{errors.weaknesses}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={feedback.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                className={`w-full rounded-md border ${
                  errors.notes ? 'border-red-500' : 'border-gray-300'
                } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                rows={3}
              />
              {errors.notes && (
                <p className="mt-1 text-sm text-red-600">{errors.notes}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recommendation
              </label>
              <select
                value={feedback.recommendation}
                onChange={(e) => handleChange('recommendation', e.target.value)}
                className={`w-full rounded-md border ${
                  errors.recommendation ? 'border-red-500' : 'border-gray-300'
                } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500`}
              >
                <option value="Strong Hire">Strong Hire</option>
                <option value="Hire">Hire</option>
                <option value="Hold">Hold</option>
                <option value="No Hire">No Hire</option>
                <option value="Strong No Hire">Strong No Hire</option>
              </select>
              {errors.recommendation && (
                <p className="mt-1 text-sm text-red-600">{errors.recommendation}</p>
              )}
            </div>

            {errors.submit && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}