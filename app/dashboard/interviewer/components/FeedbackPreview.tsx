"use client";

import { InterviewFeedbackData } from '../types/index';
import styles from '../InterviewerPage.module.css';

interface FeedbackPreviewProps {
  feedback: InterviewFeedbackData;
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
        <h4 className={styles.previewSectionTitle}>Technical Skills</h4>
        <div className={styles.previewRating}>
          {feedback.technicalSkills}/5
        </div>
      </div>

      <div className={styles.previewSection}>
        <h4 className={styles.previewSectionTitle}>Communication</h4>
        <div className={styles.previewRating}>
          {feedback.communication}/5
        </div>
      </div>

      <div className={styles.previewSection}>
        <h4 className={styles.previewSectionTitle}>Problem Solving</h4>
        <div className={styles.previewRating}>
          {feedback.problemSolving}/5
        </div>
      </div>

      <div className={styles.previewSection}>
        <h4 className={styles.previewSectionTitle}>Cultural Fit</h4>
        <div className={styles.previewRating}>
          {feedback.cultureFit}/5
        </div>
      </div>

      <div className={styles.previewSection}>
        <h4 className={styles.previewSectionTitle}>Strengths</h4>
        <div className={styles.previewComments}>
          {feedback.strengths}
        </div>
      </div>

      <div className={styles.previewSection}>
        <h4 className={styles.previewSectionTitle}>Areas for Improvement</h4>
        <div className={styles.previewComments}>
          {feedback.weaknesses}
        </div>
      </div>

      <div className={styles.previewSection}>
        <h4 className={styles.previewSectionTitle}>Additional Notes</h4>
        <div className={styles.previewComments}>
          {feedback.notes}
        </div>
      </div>

      <div className={styles.previewSection}>
        <h4 className={styles.previewSectionTitle}>Recommendation</h4>
        <div className={styles.previewRecommendation}>
          {feedback.recommendation}
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

export default FeedbackPreview; 