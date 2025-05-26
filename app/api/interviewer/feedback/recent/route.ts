import { NextResponse } from 'next/server';

// Example mock data for recent feedbacks
const recentFeedback = [
  { id: '1', candidate: 'Jane Doe', feedback: 'Great communicator', date: '2024-05-01' },
  { id: '2', candidate: 'John Smith', feedback: 'Strong technical skills', date: '2024-05-02' }
];

export async function GET() {
  try {
    return NextResponse.json(recentFeedback);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
} 