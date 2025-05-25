import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { validateFeedback } from '@/lib/validations';
import { authOptions } from '@/lib/auth';

// Mock data for demonstration
const mockFeedback = [
  {
    id: '1',
    candidateName: 'John Smith',
    role: 'Senior Software Engineer',
    interviewDate: '2024-03-20',
    technicalSkills: 4.5,
    problemSolving: 4.0,
    communication: 4.2,
    cultureFit: 4.8,
    strengths: 'Strong technical background, excellent problem-solving skills, and great communication abilities.',
    weaknesses: 'Could improve on system design knowledge and team collaboration experience.',
    notes: 'Candidate showed great potential and would be a valuable addition to the team.',
    recommendation: 'Strong Hire',
    submittedAt: '2024-03-20 11:30 AM'
  },
  {
    id: '2',
    candidateName: 'Sarah Johnson',
    role: 'Product Manager',
    interviewDate: '2024-03-21',
    technicalSkills: 3.8,
    problemSolving: 4.5,
    communication: 4.7,
    cultureFit: 4.2,
    strengths: 'Excellent communication skills, strong product vision, and great stakeholder management.',
    weaknesses: 'Technical knowledge could be improved, especially in data analysis.',
    notes: 'Very strong in product strategy and team leadership.',
    recommendation: 'Hire',
    submittedAt: '2024-03-21 3:15 PM'
  },
  {
    id: '3',
    candidateName: 'Michael Brown',
    role: 'UX Designer',
    interviewDate: '2024-03-22',
    technicalSkills: 4.2,
    problemSolving: 3.9,
    communication: 4.0,
    cultureFit: 3.8,
    strengths: 'Strong design skills, good understanding of user psychology, and excellent portfolio.',
    weaknesses: 'Could improve on technical implementation knowledge and team collaboration.',
    notes: 'Good candidate but needs more experience in enterprise applications.',
    recommendation: 'Hold',
    submittedAt: '2024-03-22 12:45 PM'
  }
];

export async function GET() {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return NextResponse.json(mockFeedback);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feedback' },
      { status: 500 }
    );
  }
}

// Extend the session type to include our custom fields
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    }
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = validateFeedback(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid feedback data', details: validation.errors },
        { status: 400 }
      );
    }

    // At this point, validation.data is guaranteed to exist
    const feedback = await prisma.feedback.create({
      data: {
        ...validation.data,
        interviewerId: session.user.id,
      },
    });

    return NextResponse.json(feedback);
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json(
      { error: 'Failed to submit feedback' },
      { status: 500 }
    );
  }
} 