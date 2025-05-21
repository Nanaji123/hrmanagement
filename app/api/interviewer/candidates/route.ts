import { NextResponse } from 'next/server';
import { Candidate } from '@/app/dashboard/interviewer/types';
import { candidates } from '@/app/dashboard/interviewer/data/mockData'; // Import mock data

// Mock candidates database - replace with actual database in production
// const candidates: Candidate[] = [ ... ]; // Remove hardcoded data

export async function GET() {
  try {
    return NextResponse.json(candidates);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch candidates' },
      { status: 500 }
    );
  }
} 