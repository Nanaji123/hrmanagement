import { NextResponse } from 'next/server';

// Mock data for demonstration
const mockInterviews = [
  {
    id: '1',
    name: 'John Smith',
    role: 'Senior Software Engineer',
    interviewDate: '2024-03-20',
    interviewTime: '10:00 AM',
    interviewType: 'Technical',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    resumeLink: '/resumes/john-smith.pdf',
    feedbackSubmitted: false,
    history: []
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    role: 'Product Manager',
    interviewDate: '2024-03-21',
    interviewTime: '2:00 PM',
    interviewType: 'HR',
    meetingLink: 'https://meet.google.com/klm-nopq-rst',
    resumeLink: '/resumes/sarah-johnson.pdf',
    feedbackSubmitted: true,
    history: [
      {
        date: '2024-03-21',
        feedback: 'Strong technical background and excellent communication skills.',
        rating: 4.5
      }
    ]
  },
  {
    id: '3',
    name: 'Michael Brown',
    role: 'UX Designer',
    interviewDate: '2024-03-22',
    interviewTime: '11:00 AM',
    interviewType: 'Technical',
    meetingLink: 'https://meet.google.com/uvw-xyz-123',
    resumeLink: '/resumes/michael-brown.pdf',
    feedbackSubmitted: false,
    history: []
  }
];

export async function GET() {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return NextResponse.json(mockInterviews);
  } catch (error) {
    console.error('Error fetching interviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch interviews' },
      { status: 500 }
    );
  }
} 