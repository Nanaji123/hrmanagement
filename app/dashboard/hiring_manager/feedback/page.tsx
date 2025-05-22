'use client';

import { useState, useEffect } from 'react';

interface Feedback {
  id: string;
  candidateName: string;
  position: string;
  interviewer: string;
  date: string;
  rating: number;
  strengths: string[];
  weaknesses: string[];
  notes: string;
  status: 'Pending' | 'Submitted';
}

interface Candidate {
  id: string;
  name: string;
  position: string;
  status: string;
}

// Initial data for first-time users
const initialCandidates: Candidate[] = [
  {
    id: '1',
    name: 'John Smith',
    position: 'Senior Software Engineer',
    status: 'Interview'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    position: 'Product Manager',
    status: 'Interview'
  },
  {
    id: '3',
    name: 'Michael Brown',
    position: 'UX Designer',
    status: 'Interview'
  }
];

const initialFeedback: Feedback[] = [
  {
    id: '1',
    candidateName: 'John Smith',
    position: 'Senior Software Engineer',
    interviewer: 'Sarah Wilson',
    date: '2024-03-20',
    rating: 4,
    strengths: ['Strong technical skills', 'Good communication'],
    weaknesses: ['Limited experience with cloud platforms'],
    notes: 'Overall a strong candidate with good potential.',
    status: 'Submitted'
  },
  {
    id: '2',
    candidateName: 'Sarah Johnson',
    position: 'Product Manager',
    interviewer: 'Michael Brown',
    date: '2024-03-21',
    rating: 3,
    strengths: ['Good leadership skills', 'Strong analytical thinking'],
    weaknesses: ['Limited product management experience'],
    notes: 'Would benefit from more hands-on PM experience.',
    status: 'Submitted'
  }
];

export default function FeedbackPage() {
  // Load candidates from localStorage or use initial data
  const [candidates, setCandidates] = useState<Candidate[]>(() => {
    if (typeof window !== 'undefined') {
      const savedCandidates = localStorage.getItem('feedbackCandidates');
      return savedCandidates ? JSON.parse(savedCandidates) : initialCandidates;
    }
    return initialCandidates;
  });

  // Load feedback from localStorage or use initial data
  const [feedback, setFeedback] = useState<Feedback[]>(() => {
    if (typeof window !== 'undefined') {
      const savedFeedback = localStorage.getItem('feedback');
      return savedFeedback ? JSON.parse(savedFeedback) : initialFeedback;
    }
    return initialFeedback;
  });

  // Save candidates to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('feedbackCandidates', JSON.stringify(candidates));
    }
  }, [candidates]);

  // Save feedback to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('feedback', JSON.stringify(feedback));
    }
  }, [feedback]);

  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [newFeedback, setNewFeedback] = useState<Partial<Feedback>>({
    candidateName: '',
    position: '',
    interviewer: '',
    date: '',
    rating: 0,
    strengths: [],
    weaknesses: [],
    notes: '',
    status: 'Pending'
  });

  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreateFeedback = () => {
    if (selectedCandidate && newFeedback.interviewer && newFeedback.date) {
      const feedbackItem: Feedback = {
        id: Date.now().toString(),
        candidateName: selectedCandidate.name,
        position: selectedCandidate.position,
        interviewer: newFeedback.interviewer,
        date: newFeedback.date,
        rating: newFeedback.rating || 0,
        strengths: newFeedback.strengths || [],
        weaknesses: newFeedback.weaknesses || [],
        notes: newFeedback.notes || '',
        status: 'Pending'
      };
      setFeedback([feedbackItem, ...feedback]);
      setShowFeedbackForm(false);
      setSelectedCandidate(null);
      setNewFeedback({
        candidateName: '',
        position: '',
        interviewer: '',
        date: '',
        rating: 0,
        strengths: [],
        weaknesses: [],
        notes: '',
        status: 'Pending'
      });
    }
  };

  const handleSubmitFeedback = (feedbackId: string) => {
    setFeedback(feedback.map(item => 
      item.id === feedbackId 
        ? { ...item, status: 'Submitted' }
        : item
    ));
  };

  const getRatingColor = (rating: number) => {
    switch (rating) {
      case 5: return 'bg-emerald-50 text-emerald-700';
      case 4: return 'bg-teal-50 text-teal-700';
      case 3: return 'bg-amber-50 text-amber-700';
      case 2: return 'bg-orange-50 text-orange-700';
      case 1: return 'bg-rose-50 text-rose-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  const getStatusColor = (status: Feedback['status']) => {
    switch (status) {
      case 'Submitted': return 'bg-emerald-50 text-emerald-700';
      case 'Pending': return 'bg-amber-50 text-amber-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  const RatingStars = ({ rating }: { rating: number }) => (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-xl ${
            star <= rating ? 'text-amber-400' : 'text-gray-200'
          }`}
        >
          ★
        </span>
      ))}
      <span className="ml-2 text-sm font-medium text-gray-600">({rating.toFixed(1)})</span>
    </div>
  );

  const filteredCandidates = candidates.filter(candidate =>
    candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    candidate.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCandidateFeedback = (candidateName: string) => {
    return feedback.find(f => f.candidateName === candidateName);
  };

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Interview Feedback</h1>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search candidates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Candidates List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">Candidates</h2>
          </div>
          <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
            {filteredCandidates.map((candidate) => {
              const candidateFeedback = getCandidateFeedback(candidate.name);
              return (
                <div
                  key={candidate.id}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                  onClick={() => {
                    setSelectedCandidate(candidate);
                    setShowFeedbackForm(true);
                    if (candidateFeedback) {
                      setNewFeedback(candidateFeedback);
                    } else {
                      setNewFeedback({
                        candidateName: candidate.name,
                        position: candidate.position,
                        interviewer: '',
                        date: '',
                        rating: 0,
                        strengths: [],
                        weaknesses: [],
                        notes: '',
                        status: 'Pending'
                      });
                    }
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{candidate.name}</h3>
                      <p className="text-sm text-gray-600">{candidate.position}</p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      candidateFeedback 
                        ? getStatusColor(candidateFeedback.status)
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                      {candidateFeedback ? candidateFeedback.status : 'Pending Feedback'}
                    </span>
                  </div>
                  {candidateFeedback && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">
                        Interviewer: {candidateFeedback.interviewer} • {candidateFeedback.date}
                      </p>
                      <div className="mt-2">
                        <RatingStars rating={candidateFeedback.rating} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Feedback Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
          {selectedCandidate ? (
            <>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {getCandidateFeedback(selectedCandidate.name) ? 'Edit Feedback' : 'Add Feedback'} for {selectedCandidate.name}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Interviewer</label>
                  <input
                    type="text"
                    value={newFeedback.interviewer}
                    onChange={(e) => setNewFeedback({ ...newFeedback, interviewer: e.target.value })}
                    className="block w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter interviewer name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={newFeedback.date}
                    onChange={(e) => setNewFeedback({ ...newFeedback, date: e.target.value })}
                    className="block w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setNewFeedback({ ...newFeedback, rating })}
                        className={`text-2xl ${
                          rating <= (newFeedback.rating || 0) ? 'text-amber-400' : 'text-gray-200'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Strengths</label>
                  <textarea
                    value={newFeedback.strengths?.join('\n')}
                    onChange={(e) => setNewFeedback({ ...newFeedback, strengths: e.target.value.split('\n') })}
                    className="block w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    rows={3}
                    placeholder="Enter strengths (one per line)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Areas for Improvement</label>
                  <textarea
                    value={newFeedback.weaknesses?.join('\n')}
                    onChange={(e) => setNewFeedback({ ...newFeedback, weaknesses: e.target.value.split('\n') })}
                    className="block w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    rows={3}
                    placeholder="Enter areas for improvement (one per line)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    value={newFeedback.notes}
                    onChange={(e) => setNewFeedback({ ...newFeedback, notes: e.target.value })}
                    className="block w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    rows={3}
                    placeholder="Enter additional notes"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowFeedbackForm(false);
                    setSelectedCandidate(null);
                  }}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateFeedback}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 font-medium"
                >
                  {getCandidateFeedback(selectedCandidate.name) ? 'Update Feedback' : 'Submit Feedback'}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-600 py-8">
              <p className="text-lg">Select a candidate to add or edit feedback</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 