import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_MS2_API}/interviews`);

    if (!res.ok) {
      throw new Error('Failed to fetch interviews from MS2');
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching interviews' }, { status: 500 });
  }
}