import { NextRequest, NextResponse } from 'next/server';

// Mock DB update for feedback submission
function getLoggedInUser() {
  // Implement your auth logic here, e.g., via JWT or session
  return { id: 'int1', name: 'Interviewer One' };
}

export async function POST(
  request: NextRequest,
  { params }: { params: { interviewId: string } }
) {
  const user = getLoggedInUser();
  const { interviewId } = params;

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { technicalRating, communicationRating, problemSolvingRating, recommendation, comments } = body;

    if (!technicalRating || !communicationRating || !problemSolvingRating || !recommendation) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // TODO: Save feedback to DB, update status to 'Submitted'
    // Here just mock success
    console.log(`Saving feedback for interview ${interviewId} by user ${user.id}:`, body);

    return NextResponse.json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
} 