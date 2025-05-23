'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
// Import necessary icons if needed for the details page
import styles from './page.module.css';

interface Interview {
  id: string;
  candidateName: string;
  position: string;
  department: string;
  interviewDate: string;
  interviewTime: string;
  interviewType: 'Technical' | 'HR' | 'Final';
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  panelMembers: string[];
  location: string;
  duration: string;
  notes?: string;
}

// Simulated data (same as on the panel page for now)
const mockInterviews: Interview[] = [
  {
    id: '1',
    candidateName: 'John Doe',
    position: 'Senior Software Engineer',
    department: 'Engineering',
    interviewDate: '2024-03-20',
    interviewTime: '10:00 AM',
    interviewType: 'Technical',
    status: 'Scheduled',
    panelMembers: ['Sarah Smith', 'Mike Johnson', 'Alex Brown'],
    location: 'Conference Room A',
    duration: '1 hour',
    notes: 'Focus on system design and problem-solving skills'
  },
  {
    id: '2',
    candidateName: 'Jane Smith',
    position: 'Product Manager',
    department: 'Product',
    interviewDate: '2024-03-20',
    interviewTime: '2:00 PM',
    interviewType: 'HR',
    status: 'Scheduled',
    panelMembers: ['David Wilson', 'Lisa Chen'],
    location: 'Virtual Meeting',
    duration: '45 minutes',
    notes: 'Discuss leadership experience and team management'
  },
  {
    id: '3',
    candidateName: 'Mike Johnson',
    position: 'Frontend Developer',
    department: 'Engineering',
    interviewDate: '2024-03-21',
    interviewTime: '11:00 AM',
    interviewType: 'Technical',
    status: 'Scheduled',
    panelMembers: ['Alex Brown', 'Sarah Smith'],
    location: 'Conference Room B',
    duration: '1 hour',
    notes: 'Focus on React and TypeScript skills'
  }
];

export default function InterviewDetailsPage() {
  const params = useParams();
  const interviewId = params.interviewId as string;
  const [interview, setInterview] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterviewDetails = async () => {
      setLoading(true);
      // Simulate fetching data from an API
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network latency
      
      const foundInterview = mockInterviews.find(int => int.id === interviewId);
      setInterview(foundInterview || null);
      setLoading(false);
    };

    if (interviewId) {
      fetchInterviewDetails();
    }

  }, [interviewId]); // Re-run effect if interviewId changes

  if (loading) {
    return <div className="p-6">Loading interview details...</div>;
  }

  if (!interview) {
    return <div className="p-6 text-red-500">Interview not found.</div>;
  }

  // Basic styling for display
  return (
    <div className={styles.detailsContainer}>
      <h1 className={styles.detailsTitle}>Interview Details</h1>
      <div className="space-y-3">
        <p className={styles.detailItem}><strong className={styles.detailLabel}>Candidate:</strong> {interview.candidateName}</p>
        <p className={styles.detailItem}><strong className={styles.detailLabel}>Position:</strong> {interview.position}</p>
        <p className={styles.detailItem}><strong className={styles.detailLabel}>Department:</strong> {interview.department}</p>
        <p className={styles.detailItem}><strong className={styles.detailLabel}>Date:</strong> {interview.interviewDate}</p>
        <p className={styles.detailItem}><strong className={styles.detailLabel}>Time:</strong> {interview.interviewTime}</p>
        <p className={styles.detailItem}><strong className={styles.detailLabel}>Type:</strong> {interview.interviewType}</p>
        <p className={styles.detailItem}><strong className={styles.detailLabel}>Status:</strong> <span className={`${styles.statusBadge} ${interview.status === 'Scheduled' ? styles.statusScheduled : interview.status === 'Completed' ? styles.statusCompleted : styles.statusCancelled}`}>{interview.status}</span></p>
        <p className={styles.detailItem}><strong className={styles.detailLabel}>Panel Members:</strong> {interview.panelMembers.join(', ')}</p>
        <p className={styles.detailItem}><strong className={styles.detailLabel}>Location:</strong> {interview.location}</p>
        <p className={styles.detailItem}><strong className={styles.detailLabel}>Duration:</strong> {interview.duration}</p>
        <p className={styles.detailItem}><strong className={styles.detailLabel}>Notes:</strong> {interview.notes || 'N/A'}</p>
      </div>
      {/* Add more details or actions here */}
    </div>
  );
} 