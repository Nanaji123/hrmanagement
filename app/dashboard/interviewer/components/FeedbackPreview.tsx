"use client";

import { InterviewFeedbackData } from '../types'; // Use the new type
import styles from '../InterviewerPage.module.css';

interface FeedbackPreviewProps {
  feedback: InterviewFeedbackData; // Use the new type
  onConfirm: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const FeedbackPreview: React.FC<FeedbackPreviewProps> = ({
  feedback,
  onConfirm,
  onCancel,
  isSubmitting = false,
}) => {
  return (
    <div className={styles.previewContainer}>
      <h3 className={styles.previewTitle}>Preview Feedback</h3>
      
      <div className={styles.previewSection}>
        <h4 className={styles.previewSectionTitle}>Technical Rating</h4>
        <div className={styles.previewRating}>
          {feedback.technicalRating}/5
        </div>
      </div>

      <div className={styles.previewSection}>
        <h4 className={styles.previewSectionTitle}>Communication Rating</h4>
        <div className={styles.previewRating}>
          {feedback.communicationRating}/5
        </div>
      </div>

      <div className={styles.previewSection}>
        <h4 className={styles.previewSectionTitle}>Problem Solving Rating</h4>
        <div className={styles.previewRating}>
          {feedback.problemSolvingRating}/5
        </div>
      </div>

      <div className={styles.previewSection}>
        <h4 className={styles.previewSectionTitle}>Recommendation</h4>
        <div className={styles.previewRecommendation}>
          {feedback.recommendation}
        </div>
      </div>

      <div className={styles.previewSection}>
        <h4 className={styles.previewSectionTitle}>Comments</h4>
        <div className={styles.previewComments}>
          {feedback.comments}
        </div>
      </div>

      <div className={styles.previewActions}>
        <button 
          onClick={onCancel} 
          className={styles.previewButton}
          disabled={isSubmitting}
        >
          Edit Feedback
        </button>
        <button 
          onClick={onConfirm} 
          className={`${styles.previewButton} ${styles.previewButtonPrimary}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </div>
    </div>
  );
};

// Add a default export to ensure it's recognized as a module
export default FeedbackPreview; 