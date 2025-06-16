import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req });
    const userId = token?.id;
    const jwt = token?.accessToken || token?.token || token?.jwt; // try common token fields
    if (!userId || !jwt) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // Fetch all feedbacks for this interviewer, passing the JWT
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_MS2_API}/feedback/interviewer/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch feedbacks from ms2 backend' }, { status: res.status });
    }
    const feedbacks = await res.json();
    // Filter for pending feedbacks
    const pendingFeedbacks = feedbacks.filter((f: any) => f.status === 'Pending');
    return NextResponse.json(pendingFeedbacks);
  } catch (error) {
    console.error('Error fetching pending feedbacks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pending feedbacks' },
      { status: 500 }
    );
  }
}