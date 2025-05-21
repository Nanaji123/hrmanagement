"use client";

import React, { useState, useEffect } from 'react';
import styles from '../InterviewerPage.module.css';
import { Candidate, InterviewFeedbackData } from '../types/index';
import { FeedbackForm } from './FeedbackForm';
import FeedbackPreview from './FeedbackPreview';
// Import InterviewTimer if needed within the modal context
// import { InterviewTimer } from './InterviewTimer';

interface CandidateDetailModalProps {
  candidate: Candidate | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitFeedback: (candidateId: string, feedback: InterviewFeedbackData) => void;
  isSubmitting?: boolean;
}

export const CandidateDetailModal: React.FC<CandidateDetailModalProps> = ({
  candidate,
  isOpen,
  onClose,
  onSubmitFeedback,
  isSubmitting = false,
}) => {
  const [feedbackData, setFeedbackData] = useState<InterviewFeedbackData>({
    technicalRating: 0,
    communicationRating: 0,
    problemSolvingRating: 0,
    recommendation: 'Strongly Recommend',
    comments: '',
  });
  const [showPreview, setShowPreview] = useState(false);

  // Reset feedback state when modal opens for a new candidate
  useEffect(() => {
    if (isOpen && candidate) {
      setFeedbackData({
        technicalRating: 0,
        communicationRating: 0,
        problemSolvingRating: 0,
        recommendation: 'Strongly Recommend',
        comments: '',
      });
      setShowPreview(false);
    }
  }, [isOpen, candidate]);

  if (!isOpen || !candidate) {
    return null;
  }

  const handleFeedbackChange = (newFeedback: InterviewFeedbackData) => {
    setFeedbackData(newFeedback);
  };

  const handleShowPreview = () => {
    setShowPreview(true);
  };

  const handleEditFeedback = () => {
    setShowPreview(false);
  };

  const handleSubmitConfirm = () => {
    if (candidate) {
      onSubmitFeedback(candidate.id.toString(), feedbackData);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}> {/* Prevent closing modal when clicking inside */}
        <button className={styles.modalCloseButton} onClick={onClose}>×</button>
        <h2 className={styles.modalTitle}>{candidate.name}</h2>
        <p className={styles.modalSubtitle}>{candidate.role}</p>

        {/* Interview History Section */}
        <div className={styles.historyContainer}> {/* Add a class for history container if needed */}
          <h3 className={styles.historyTitle}>Interview History</h3>
          {
            candidate.history && candidate.history.length > 0 ? (
              <ul className={styles.historyList}>
                {candidate.history.map((item, index) => (
                  <li key={index} className={styles.historyItem}>
                    <span className={styles.historyDate}>{item.date}:</span>
                    <span className={styles.historyFeedback}>{item.feedback}</span>
                    {/* Display rating if available and appropriate */}
                    {item.rating !== undefined && (
                       <span className={styles.historyRating}>({item.rating}/5)</span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.textMuted}>No interview history available.</p> // Use text-muted for less prominent text
            )
          }
        </div>

        {/* Feedback Form or Preview */}
        {showPreview ? (
          <FeedbackPreview
            feedback={feedbackData}
            onConfirm={handleSubmitConfirm}
            onCancel={handleEditFeedback}
            isSubmitting={isSubmitting}
          />
        ) : (
          <FeedbackForm
            initialFeedback={feedbackData}
            onSubmit={handleShowPreview} // Submit button in form will trigger preview
            onFeedbackChange={handleFeedbackChange}
            isSubmitting={isSubmitting}
          />
        )}

        {/* Timer can be added here if interview is ongoing */}
        {/* <InterviewTimer /> */}

      </div>
    </div>
  );
}; 