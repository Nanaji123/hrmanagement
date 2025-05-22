import { NextResponse } from 'next/server';

// Mock data for demonstration
const mockProfile = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@company.com',
  role: 'Senior Software Engineer',
  department: 'Engineering',
  expertise: [
    'System Design',
    'Backend Development',
    'Database Architecture',
    'API Design',
    'Performance Optimization'
  ],
  totalInterviews: 45,
  averageRating: 4.2,
  completedInterviews: 42,
  upcomingInterviews: 3,
  joinDate: 'January 2023',
  bio: 'Experienced software engineer with a passion for building scalable systems and mentoring junior developers. Specialized in backend development and system architecture.'
};

export async function GET() {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return NextResponse.json(mockProfile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
} 