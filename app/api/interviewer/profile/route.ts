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

    // Fetch profile from ms2 backend
    const ms2Url = `http://localhost:5000/api/interviewer/${userId}`;
    const res = await fetch(ms2Url, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch profile from ms2 backend' }, { status: res.status });
    }

    const profile = await res.json();
    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching interviewer profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch interviewer profile' },
      { status: 500 }
    );
  }
}