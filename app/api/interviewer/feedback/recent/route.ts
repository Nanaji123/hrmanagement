import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Fetch recent feedbacks from ms2 backend (update endpoint if needed)
    const res = await fetch(`${process.env.NEXT_PUBLIC_MS2_API}/feedback/recent`);
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch recent feedbacks from ms2 backend' }, { status: res.status });
    }
    const recentFeedback = await res.json();
    return NextResponse.json(recentFeedback);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}