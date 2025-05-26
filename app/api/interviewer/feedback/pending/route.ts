import { NextResponse } from "next/server";

export async function GET() {
  // Dummy data for pending feedbacks
  const pendingFeedbacks = [
    { id: 1, candidateName: "Candidate A", position: "Software Engineer", scheduledAt: "2023-10-01" },
    { id: 2, candidateName: "Candidate B", position: "Frontend Dev", scheduledAt: "2023-10-02" }
  ];
  return NextResponse.json(pendingFeedbacks, { status: 200 });
} 