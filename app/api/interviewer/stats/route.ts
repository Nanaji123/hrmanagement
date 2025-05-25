import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

interface Feedback {
  technicalSkills: number;
  problemSolving: number;
  communication: number;
  cultureFit: number;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Get total interviews
    const totalInterviews = await prisma.interview.count({
      where: {
        interviewerId: userId,
      },
    });

    // Get completed interviews
    const completedInterviews = await prisma.interview.count({
      where: {
        interviewerId: userId,
        status: 'COMPLETED',
      },
    });

    // Get upcoming interviews
    const upcomingInterviews = await prisma.interview.count({
      where: {
        interviewerId: userId,
        status: 'SCHEDULED',
        date: {
          gte: new Date(),
        },
      },
    });

    // Calculate average rating
    const feedbacks = await prisma.interviewFeedback.findMany({
      where: {
        interviewerId: userId,
      },
      select: {
        technicalSkills: true,
        problemSolving: true,
        communication: true,
        cultureFit: true,
      },
    });

    const averageRating = feedbacks.length > 0
      ? feedbacks.reduce((acc: number, curr: Feedback) => {
          const avg = (curr.technicalSkills + curr.problemSolving + curr.communication + curr.cultureFit) / 4;
          return acc + avg;
        }, 0) / feedbacks.length
      : 0;

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