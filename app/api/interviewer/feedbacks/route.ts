import { NextResponse } from 'next/server';

// Mock function to get logged in user
const getLoggedInUser = () => {
  return {
    id: '1',
    name: 'John Doe',
    role: 'interviewer'
  };
};

// Mock database query
const getFeedbacks = () => {
  return [
    {
      id: '1',
      interviewId: '1',
      candidateName: 'Jane Smith',
      position: 'Senior Software Engineer',
      date: '2024-03-15',
      technicalSkills: 4,
      communication: 5,
      problemSolving: 4,
      culturalFit: 5,
      overallRating: 4.5,
      recommendation: 'Strong Hire',
      strengths: 'Excellent technical knowledge and communication skills. Strong problem-solving abilities.',
      weaknesses: 'Could improve on system design knowledge.',
      comments: 'Great candidate overall. Would be a strong addition to the team.'
    },
    {
      id: '2',
      interviewId: '2',
      candidateName: 'Mike Johnson',
      position: 'Frontend Developer',
      date: '2024-03-14',
      technicalSkills: 3,
      communication: 4,
      problemSolving: 3,
      culturalFit: 4,
      overallRating: 3.5,
      recommendation: 'Hire',
      strengths: 'Good frontend skills and team player.',
      weaknesses: 'Needs improvement in advanced JavaScript concepts.',
      comments: 'Solid candidate with good potential for growth.'
    }
  ];
};

export async function GET() {
  try {
    const user = getLoggedInUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const feedbacks = getFeedbacks();
    return NextResponse.json(feedbacks);
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 