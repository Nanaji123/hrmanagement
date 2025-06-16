import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Fetch candidates from ms2 backend (update endpoint if needed)
    const res = await fetch(`${process.env.NEXT_PUBLIC_MS2_API}/candidates`);
    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch candidates from ms2 backend' },
        { status: res.status }
      );
    }
    const candidates = await res.json();
    return NextResponse.json(candidates);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch candidates' },
      { status: 500 }
    );
  }
}