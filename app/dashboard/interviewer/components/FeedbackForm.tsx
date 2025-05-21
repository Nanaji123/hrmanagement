"use client";
import React, { useState, useEffect } from 'react';
import { InterviewFeedbackData } from '../types';
import styles from '../InterviewerPage.module.css';

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
    setFormData(updatedFormData as InterviewFeedbackData);
    onFeedbackChange(updatedFormData as InterviewFeedbackData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.feedbackForm}>
      <h3>Submit Feedback</h3>
      
      <div className={styles.ratingField}>
        <label htmlFor="technicalRating">Technical Skills:</label>
        <div className={styles.ratingButtons}>
          {[1, 2, 3, 4, 5].map(rating => (
            <button
              key={rating}
              type="button"
              onClick={() => handleInputChange({ target: { id: 'technicalRating', value: rating.toString() } } as React.ChangeEvent<HTMLInputElement>)}
              className={`${styles.ratingButton} ${formData.technicalRating === rating ? styles.selected : ''}`}
              aria-label={`Rate technical skills ${rating} out of 5`}
            >
              {rating}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.ratingField}>
        <label htmlFor="communicationRating">Communication:</label>
        <div className={styles.ratingButtons}>
          {[1, 2, 3, 4, 5].map(rating => (
            <button
              key={rating}
              type="button"
              onClick={() => handleInputChange({ target: { id: 'communicationRating', value: rating.toString() } } as React.ChangeEvent<HTMLInputElement>)}
              className={`${styles.ratingButton} ${formData.communicationRating === rating ? styles.selected : ''}`}
              aria-label={`Rate communication ${rating} out of 5`}
            >
              {rating}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.ratingField}>
        <label htmlFor="problemSolvingRating">Problem Solving:</label>
        <div className={styles.ratingButtons}>
          {[1, 2, 3, 4, 5].map(rating => (
            <button
              key={rating}
              type="button"
              onClick={() => handleInputChange({ target: { id: 'problemSolvingRating', value: rating.toString() } } as React.ChangeEvent<HTMLInputElement>)}
              className={`${styles.ratingButton} ${formData.problemSolvingRating === rating ? styles.selected : ''}`}
              aria-label={`Rate problem solving ${rating} out of 5`}
            >
              {rating}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.recommendationField}>
        <label htmlFor="recommendation">Recommendation:</label>
        <select
          id="recommendation"
          value={formData.recommendation}
          onChange={handleInputChange}
          className={styles.recommendationSelect}
        >
          <option value="Strongly Recommend">Strongly Recommend</option>
          <option value="Recommend">Recommend</option>
          <option value="Consider">Consider</option>
          <option value="Not Recommended">Not Recommended</option>
        </select>
      </div>

      <div className={styles.commentsField}>
        <label htmlFor="comments">Comments:</label>
        <textarea
          id="comments"
          value={formData.comments}
          onChange={handleInputChange}
          className={styles.feedbackTextarea}
          placeholder="Enter your detailed feedback here..."
          rows={4}
          required
        />
      </div>

      <button
        type="submit"
        className={styles.submitBtn}
        disabled={isSubmitting || !formData.comments.trim()}
      >
        {isSubmitting ? 'Submitting...' : 'Preview Feedback'}
      </button>
    </form>
  );
}; 