import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateResetToken, sendPasswordResetEmail } from '@/lib/emailService';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // If user doesn't exist, inform them to contact administrator
    if (!user) {
      return NextResponse.json(
        { error: 'Please contact your administrator to get login credentials. Currently you are not in the system.' },
        { status: 404 }
      );
    }

    // Generate reset token and expiry (1 hour from now)
    const resetToken = generateResetToken();
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    // Update user with reset token
    await prisma.user.update({
      where: { userId: user.userId },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // Send email
    try {
      await sendPasswordResetEmail(user.email, user.fullName, resetToken);
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      return NextResponse.json(
        { error: 'Failed to send reset email. Please check email configuration.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'If an account with that email exists, a password reset link has been sent.' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error in forgot password:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}
