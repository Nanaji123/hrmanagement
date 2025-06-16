import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req });
    console.log('TOKEN DEBUG', token); // Debug log to inspect token
    const userId = token?.id;
    const jwt = token?.jwt || token?.token || token?.accessToken; // try all possible fields
    console.log('JWT DEBUG', jwt); // Debug log to inspect jwt value
    if (!userId || !jwt) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // Fetch feedbacks for this interviewer from ms2 backend, passing the JWT
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
    return NextResponse.json(feedbacks);
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}