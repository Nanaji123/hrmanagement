import { NextResponse } from 'next/server';

// Mock database query (replace with your real DB queries)
const feedbacks = [
  { interviewId: '1', candidateName: 'Alice Johnson', deadline: '2025-06-01', status: 'Pending', interviewerId: 'int1' },
  { interviewId: '2', candidateName: 'Bob Smith', deadline: '2025-06-05', status: 'Submitted', interviewerId: 'int1' },
  { interviewId: '3', candidateName: 'Carol Davis', deadline: '2025-05-28', status: 'Pending', interviewerId: 'int2' },
];

// Middleware to get logged-in user (simplified)
function getLoggedInUser() {
  // Implement your auth logic here, e.g., via JWT or session
  return { id: 'int1', name: 'Interviewer One' };
}

export async function GET() {
  const user = getLoggedInUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Filter feedbacks for this interviewer and pending status only
  const pendingFeedbacks = feedbacks.filter(
    (fb) => fb.interviewerId === user.id && fb.status === 'Pending'
  );

  return NextResponse.json(pendingFeedbacks);
} 