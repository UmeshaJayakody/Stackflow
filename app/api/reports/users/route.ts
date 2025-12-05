import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { fullName: 'asc' },
    });

    const data = users.map((user) => ({
      'User ID': user.userId,
      'Full Name': user.fullName,
      'Email': user.email,
      'Role': user.role,
      'Created At': new Date(user.createdAt).toLocaleString(),
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching users report:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users report' },
      { status: 500 }
    );
  }
}
