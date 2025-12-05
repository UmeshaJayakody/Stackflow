import nodemailer from 'nodemailer';

// Configure email transporter
// Note: For production, use environment variables for email credentials
export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Generate a random reset token
export function generateResetToken(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15) +
         Date.now().toString(36);
}

// Send password reset email
export async function sendPasswordResetEmail(
  email: string,
  fullName: string,
  resetToken: string
) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset Request - StackFlow',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
              line-height: 1.6; 
              color: #111827; 
              background-color: #ffffff;
              margin: 0;
              padding: 0;
            }
            .container { 
              max-width: 600px; 
              margin: 0 auto; 
              padding: 20px; 
              background-color: #ffffff;
              border-radius: 12px;
              box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
              overflow: hidden;
            }
            .header { 
              background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
              padding: 30px 20px; 
              text-align: center; 
              border-bottom: 1px solid #e5e7eb;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              color: #111827;
              margin-bottom: 10px;
            }
            .content { 
              padding: 40px 30px; 
              background-color: rgba(255, 255, 255, 0.8);
              backdrop-filter: blur(10px);
              border-radius: 8px;
              margin: 20px;
            }
            .button { 
              display: inline-block; 
              padding: 14px 32px; 
              background-color: #111827; 
              color: white !important; 
              text-decoration: none; 
              border-radius: 8px; 
              margin: 24px 0; 
              font-weight: 600;
              box-shadow: 0 4px 12px rgba(17, 24, 39, 0.3);
              transition: all 0.2s ease;
            }
            .button:hover { 
              background-color: #374151;
              box-shadow: 0 6px 16px rgba(17, 24, 39, 0.4);
            }
            .link-box {
              background-color: #f3f4f6;
              padding: 16px;
              border-radius: 6px;
              border: 1px solid #e5e7eb;
              word-break: break-all;
              font-family: monospace;
              font-size: 14px;
              color: #374151;
            }
            .warning {
              background-color: #fef3c7;
              border: 1px solid #f59e0b;
              color: #92400e;
              padding: 12px;
              border-radius: 6px;
              margin: 20px 0;
            }
            .footer { 
              text-align: center; 
              margin-top: 30px; 
              color: #6b7280; 
              font-size: 12px; 
              padding: 20px;
              border-top: 1px solid #e5e7eb;
            }
            .greeting { color: #111827; font-weight: 600; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">StackFlow</div>
              <h1 style="color: #111827; margin: 0; font-size: 28px; font-weight: 700;">Password Reset Request</h1>
            </div>
            <div class="content">
              <p class="greeting">Hello ${fullName},</p>
              <p style="color: #374151;">We received a request to reset your password for your StackFlow account.</p>
              <p style="color: #374151;">Click the button below to reset your password:</p>
              <p style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </p>
              <p style="color: #374151;">Or copy and paste this link into your browser:</p>
              <div class="link-box">${resetUrl}</div>
              <div class="warning">
                <strong>This link will expire in 1 hour.</strong>
              </div>
              <p style="color: #374151;">If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
              <p style="color: #111827;">Best regards,<br><strong>StackFlow Team</strong></p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply to this message.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Hello ${fullName},

We received a request to reset your password for your StackFlow account.

Click the link below to reset your password:
${resetUrl}

This link will expire in 1 hour.

If you didn't request a password reset, please ignore this email or contact support if you have concerns.

Best regards,
StackFlow Team
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}
