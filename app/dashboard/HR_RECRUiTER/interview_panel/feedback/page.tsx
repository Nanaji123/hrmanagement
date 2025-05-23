'use client';

import { useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

interface FeedbackQuestion {
  id: number;
  question: string;
  category: 'Technical' | 'Communication' | 'Problem Solving' | 'Culture Fit';
}

interface Feedback {
  questionId: number;
  rating: number;
  comments: string;
}

const feedbackQuestions: FeedbackQuestion[] = [
  // Technical Skills (5 questions)
  {
    id: 1,
    question: "How would you rate the candidate's technical knowledge?",
    category: "Technical"
  },
  {
    id: 2,
    question: "How well did the candidate demonstrate coding skills?",
    category: "Technical"
  },
  {
    id: 3,
    question: "How would you rate the candidate's understanding of system design?",
    category: "Technical"
  },
  {
    id: 4,
    question: "How well did the candidate handle technical questions?",
    category: "Technical"
  },
  {
    id: 5,
    question: "How would you rate the candidate's technical problem-solving approach?",
    category: "Technical"
  },
  // Communication Skills (5 questions)
  {
    id: 6,
    question: "How clear and effective was the candidate's communication?",
    category: "Communication"
  },
  {
    id: 7,
    question: "How well did the candidate articulate their thoughts?",
    category: "Communication"
  },
  {
    id: 8,
    question: "How would you rate the candidate's listening skills?",
    category: "Communication"
  },
  {
    id: 9,
    question: "How well did the candidate respond to feedback?",
    category: "Communication"
  },
  {
    id: 10,
    question: "How would you rate the candidate's presentation skills?",
    category: "Communication"
  },
  // Problem Solving (5 questions)
  {
    id: 11,
    question: "How well did the candidate analyze problems?",
    category: "Problem Solving"
  },
  {
    id: 12,
    question: "How creative was the candidate's approach to solving problems?",
    category: "Problem Solving"
  },
  {
    id: 13,
    question: "How well did the candidate handle unexpected challenges?",
    category: "Problem Solving"
  },
  {
    id: 14,
    question: "How would you rate the candidate's decision-making process?",
    category: "Problem Solving"
  },
  {
    id: 15,
    question: "How well did the candidate prioritize tasks?",
    category: "Problem Solving"
  },
  // Culture Fit (5 questions)
  {
    id: 16,
    question: "How well would the candidate fit into our team culture?",
    category: "Culture Fit"
  },
  {
    id: 17,
    question: "How would you rate the candidate's enthusiasm for the role?",
    category: "Culture Fit"
  },
  {
    id: 18,
    question: "How well did the candidate demonstrate alignment with company values?",
    category: "Culture Fit"
  },
  {
    id: 19,
    question: "How would you rate the candidate's potential for growth?",
    category: "Culture Fit"
  },
  {
    id: 20,
    question: "How well did the candidate show interest in the company?",
    category: "Culture Fit"
  }
];

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [comments, setComments] = useState('');

  const currentQuestion = feedbackQuestions[currentQuestionIndex];

  const handleRating = (rating: number) => {
    const existingFeedbackIndex = feedbacks.findIndex(f => f.questionId === currentQuestion.id);
    
    if (existingFeedbackIndex >= 0) {
      const updatedFeedbacks = [...feedbacks];
      updatedFeedbacks[existingFeedbackIndex] = {
        ...updatedFeedbacks[existingFeedbackIndex],
        rating
      };
      setFeedbacks(updatedFeedbacks);
    } else {
      setFeedbacks([...feedbacks, {
        questionId: currentQuestion.id,
        rating,
        comments: ''
      }]);
    }
  };

  const handleCommentsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComments(e.target.value);
    const existingFeedbackIndex = feedbacks.findIndex(f => f.questionId === currentQuestion.id);
    
    if (existingFeedbackIndex >= 0) {
      const updatedFeedbacks = [...feedbacks];
      updatedFeedbacks[existingFeedbackIndex] = {
        ...updatedFeedbacks[existingFeedbackIndex],
        comments: e.target.value
      };
      setFeedbacks(updatedFeedbacks);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < feedbackQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setComments('');
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      const previousFeedback = feedbacks.find(f => f.questionId === feedbackQuestions[currentQuestionIndex - 1].id);
      setComments(previousFeedback?.comments || '');
    }
  };

  const handleSubmit = () => {
    // Here you would typically send the feedback to your backend
    console.log('Submitting feedbacks:', feedbacks);
    alert('Feedback submitted successfully!');
  };

  const getCurrentRating = () => {
    const feedback = feedbacks.find(f => f.questionId === currentQuestion.id);
    return feedback?.rating || 0;
  };

  const getProgress = () => {
    return ((currentQuestionIndex + 1) / feedbackQuestions.length) * 100;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Candidate Feedback</h1>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-emerald-600 h-2.5 rounded-full"
            style={{ width: `${getProgress()}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Question {currentQuestionIndex + 1} of {feedbackQuestions.length}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="mb-6">
          <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800 mb-4">
            {currentQuestion.category}
          </span>
          <h2 className="text-xl font-medium text-gray-900 mb-4">
            {currentQuestion.question}
          </h2>
        </div>

        <div className="flex justify-center space-x-2 mb-8">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              onClick={() => handleRating(rating)}
              className="focus:outline-none"
            >
              {rating <= getCurrentRating() ? (
                <StarIcon className="h-12 w-12 text-yellow-400" />
              ) : (
                <StarOutlineIcon className="h-12 w-12 text-gray-300" />
              )}
            </button>
          ))}
        </div>

        <div className="mb-6">
          <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-2">
            Additional Comments
          </label>
          <textarea
            id="comments"
            rows={4}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            placeholder="Add your comments here..."
            value={comments}
            onChange={handleCommentsChange}
          />
        </div>

        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className={`px-4 py-2 rounded-md ${
              currentQuestionIndex === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Previous
          </button>
          
          {currentQuestionIndex === feedbackQuestions.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
            >
              Submit Feedback
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 