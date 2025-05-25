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
const getInterviewById = async (interviewId: string) => {
  // In a real application, this would query your database
  const interviews = [
    {
      id: '1',
      candidateName: 'Jane Smith',
      position: 'Senior Software Engineer',
      date: '2024-03-20T10:00:00Z',
      status: 'Pending',
      interviewerId: '1'
    },
    {
      id: '2',
      candidateName: 'Mike Johnson',
      position: 'Frontend Developer',
      date: '2024-03-21T14:00:00Z',
      status: 'Completed',
      interviewerId: '1'
    }
  ];

  return interviews.find(interview => interview.id === interviewId);
};

export async function GET(
  request: Request,
  { params }: { params: { interviewId: string } }
) {
  try {
    const user = getLoggedInUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const interview = await getInterviewById(params.interviewId);
    if (!interview) {
      return NextResponse.json(
        { error: 'Interview not found' },
        { status: 404 }
      );
    }

    // Check if the interview belongs to the logged-in interviewer
    if (interview.interviewerId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    return NextResponse.json(interview);
  } catch (error) {
    console.error('Error fetching interview:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 