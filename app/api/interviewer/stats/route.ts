import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const stats = {
      totalInterviews: 12,
      feedbackSubmitted: 9,
      pendingFeedback: 3,
      averageRating: 4.3,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
} 