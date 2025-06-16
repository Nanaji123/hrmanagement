import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as any;
    if (!user?.jwt) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = user.id;
    const jwt = user.jwt;

    // Fetch stats from ms2 backend
    const ms2Url = `http://localhost:5000/api/interviews?interviewerId=${userId}`;
    const res = await fetch(ms2Url, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch from ms2 backend' }, { status: res.status });
    }

    const interviews = await res.json();

    // Calculate stats from ms2 data
    const totalInterviews = interviews.length;
    const completedInterviews = interviews.filter((i: any) => i.status === 'COMPLETED').length;
    const upcomingInterviews = interviews.filter((i: any) => i.status === 'SCHEDULED' && new Date(i.date) >= new Date()).length;

    // Fetch feedbacks from ms2 backend for average rating
    const feedbackUrl = `http://localhost:5000/api/feedback/interviewer/${userId}`;
    const feedbackRes = await fetch(feedbackUrl, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    let averageRating = 0;
    if (feedbackRes.ok) {
      const feedbacks = await feedbackRes.json();
      if (feedbacks.length > 0) {
        const total = feedbacks.reduce((acc: number, f: any) => acc + (f.rating || 0), 0);
        averageRating = total / feedbacks.length;
      }
    }

    return NextResponse.json({
      totalInterviews,
      completedInterviews,
      upcomingInterviews,
      averageRating: Number(averageRating.toFixed(1)),
    });
  } catch (error) {
    console.error('Error fetching interviewer stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch interviewer statistics' },
      { status: 500 }
    );
  }
}