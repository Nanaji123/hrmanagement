import { NextResponse } from 'next/server';
import { Candidate, InterviewFeedbackData } from '@/app/dashboard/interviewer/types';

// Mock candidates database - replace with actual database in production
const candidates: Candidate[] = [
  {
    id: '1',
    name: 'John Doe',
    role: 'Frontend Developer',
    interviewDate: '2024-06-10',
    interviewTime: '10:00 AM',
    interviewType: 'Technical',
    meetingLink: '#',
    resumeLink: '#',
    history: [
      {
        date: '2023-12-01',
        feedback: 'Strong technical skills.',
        rating: 4,
      },
      {
        date: '2024-01-15',
        feedback: 'Good communication.',
        rating: 5,
      },
    ],
  },
  {
    id: '2',
    name: 'Jane Smith',
    role: 'Backend Developer',
    interviewDate: '2024-06-12',
    interviewTime: '2:00 PM',
    interviewType: 'HR',
    meetingLink: '#',
    resumeLink: '#',
    history: [
      {
        date: '2024-01-20',
        feedback: 'Excellent problem solver.',
        rating: 5,
      },
    ],
  },
];

export async function POST(
  request: Request,
  { params }: { params: { candidateId: string } }
) {
  try {
    const body = await request.json();
    const feedback: InterviewFeedbackData = body;

    // Find the candidate
    const candidateIndex = candidates.findIndex(c => c.id === params.candidateId);
    if (candidateIndex === -1) {
      return NextResponse.json(
        { error: 'Candidate not found' },
        { status: 404 }
      );
    }

    // Add the feedback to the candidate's history
    candidates[candidateIndex].history.push({
      date: new Date().toISOString().split('T')[0],
      feedback: feedback.comments,
      rating: Math.round((feedback.technicalRating + feedback.communicationRating + feedback.problemSolvingRating) / 3),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json(
      { error: 'Failed to submit feedback' },
      { status: 500 }
    );
  }
} 