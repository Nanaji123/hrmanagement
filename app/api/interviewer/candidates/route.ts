import { NextResponse } from 'next/server';
import { Candidate } from '@/app/dashboard/interviewer/types';

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

export async function GET() {
  try {
    return NextResponse.json(candidates);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch candidates' },
      { status: 500 }
    );
  }
} 