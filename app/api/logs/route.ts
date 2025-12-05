import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const logs = await prisma.activityLog.findMany({
      include: {
        user: {
          select: {
            userId: true,
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 100, // Limit to last 100 logs
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activity logs' },
      { status: 500 }
    );
  }
}
