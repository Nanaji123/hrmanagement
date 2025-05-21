"use client";
import React from 'react';
import { Candidate } from '../types/index';
import styles from '../InterviewerPage.module.css';

interface CandidateCardProps {
  candidate: Candidate;
  onViewDetailsClick: (candidate: Candidate) => void;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  onViewDetailsClick,
}) => {
  return (
    <li className={styles.candidateCard}>
      <div className={styles.candidateHeader}>
        <div className={styles.candidateInfo}>
          <strong>{candidate.name}</strong> <br />
          Role: {candidate.role} <br />
          Interview: {candidate.interviewDate} at {candidate.interviewTime} <br />
          Type: {candidate.interviewType} <br />
          <a 
            href={candidate.meetingLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.meetingLink}
            aria-label={`Join meeting for ${candidate.name}`}
          >
            Join Meeting
          </a>
          <br />
          <a 
            href={`/${candidate.resumeLink}`}
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.resumeLink}
            aria-label={`View resume for ${candidate.name}`}
          >
            View Resume
          </a>
        </div>
        <button 
          onClick={() => onViewDetailsClick(candidate)}
          className={styles.detailsBtn}
        >
          View Details
        </button>
      </div>
    </li>
  );
}; 