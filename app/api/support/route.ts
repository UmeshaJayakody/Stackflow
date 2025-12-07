import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/emailService';

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Send email to support team
    const supportEmail = process.env.SUPPORT_EMAIL || process.env.EMAIL_USER;
    
    if (!supportEmail) {
      console.error('SUPPORT_EMAIL or EMAIL_USER not configured in .env');
      return NextResponse.json(
        { success: false, error: 'Support email not configured' },
        { status: 500 }
      );
    }

    await sendEmail({
      to: supportEmail,
      subject: `Support Request: ${subject}`,
      text: `
New support request from StackFlow Inventory System

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
Reply to: ${email}
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1f2937; border-bottom: 2px solid #1f2937; padding-bottom: 10px;">
            New Support Request
          </h2>
          <p style="color: #6b7280;">From StackFlow Inventory System</p>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p style="margin: 5px 0;"><strong>Subject:</strong> ${subject}</p>
          </div>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #1f2937;">Message:</h3>
            <p style="color: #374151; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px;">
              Reply to this customer at: <a href="mailto:${email}">${email}</a>
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: 'Support request sent successfully',
    });
  } catch (error: any) {
    console.error('Error sending support email:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to send support request',
        message: error.message 
      },
      { status: 500 }
    );
  }
}
