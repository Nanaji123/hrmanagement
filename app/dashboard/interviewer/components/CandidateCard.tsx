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
          <h3 className="text-lg font-semibold text-gray-900">{candidate.name}</h3>
          <p className="text-sm text-gray-600 mt-1">Role: {candidate.role}</p>
          <div className="mt-2 space-y-1">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Interview:</span> {candidate.interviewDate} at {candidate.interviewTime}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Type:</span> {candidate.interviewType}
            </p>
          </div>
          <div className="mt-4 space-y-2">
            <a 
              href={candidate.meetingLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.meetingLink}
              aria-label={`Join meeting for ${candidate.name}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Join Meeting
            </a>
            <a 
              href={`/${candidate.resumeLink}`}
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.resumeLink}
              aria-label={`View resume for ${candidate.name}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              View Resume
            </a>
          </div>
        </div>
        <button 
          onClick={() => onViewDetailsClick(candidate)}
          className={styles.detailsBtn}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          View Details
        </button>
      </div>
    </li>
  );
}; 